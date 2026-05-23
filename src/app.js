import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

const $ = s => document.querySelector(s);
const STORAGE_KEY = 'my-books-progress-v3';
let books = [];
let progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
let currentBook = null, pdfDoc = null, pageNum = 1, rendering = false;
let deferredInstallPrompt = null;
const canvas = $('#pdfCanvas');
const ctx = canvas.getContext('2d');

function saveProgress(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(progress, null, 2)); updateStats(); }
function state(id){ return progress[id] || (progress[id] = {status:'unread', lastPage:1, totalPages:null, updatedAt:null}); }
function esc(s=''){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
function fileUrl(path){ return encodeURI(path); }

async function loadBooks(){
  const res = await fetch('data/books.json', {cache:'no-store'});
  const data = await res.json();
  books = data.books || [];
  $('#appTitle').textContent = data.title || 'Моя PDF-бібліотека';
  document.title = data.title || 'Моя PDF-бібліотека';
  renderLibrary();
}

function updateStats(){
  $('#totalBooks').textContent = books.length;
  $('#readBooks').textContent = books.filter(b => state(b.id).status === 'read').length;
  $('#readingBooks').textContent = books.filter(b => state(b.id).status === 'reading').length;
}

function renderLibrary(){
  const q = $('#search').value.trim().toLowerCase();
  const f = $('#filter').value;
  const items = books.filter(b => {
    const st = state(b.id);
    const hay = [b.title,b.author,b.category,...(b.tags||[])].join(' ').toLowerCase();
    return hay.includes(q) && (f === 'all' || st.status === f);
  });
  updateStats();
  if(!items.length){ $('#library').innerHTML = '<div class="empty glass">Книжки не знайдено. Якщо ти щойно додав PDF — дочекайся зеленого GitHub Actions і онови сторінку.</div>'; return; }
  $('#library').innerHTML = items.map(b => {
    const st = state(b.id);
    const statusText = {read:'Прочитано', reading:'Читаю', unread:'Не прочитано'}[st.status || 'unread'];
    const pct = st.status === 'read' ? 100 : (st.totalPages ? Math.min(99, Math.round((st.lastPage || 1) / st.totalPages * 100)) : 0);
    const cover = b.cover ? `<img class="cover" src="${fileUrl(b.cover)}" alt="${esc(b.title)}">` : `<div class="fallback">${esc(b.title)}</div>`;
    return `<article class="card">
      <div class="coverWrap">${cover}</div>
      <div class="cardBody">
        <div class="title">${esc(b.title)}</div>
        <div class="meta">${esc(b.author)} · ${esc(b.category)}</div>
        <div class="badges"><span class="badge ${st.status}">${statusText}</span><span class="badge">${pct}%</span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="actions"><button class="primary small" data-open="${b.id}">Відкрити</button><button class="small" data-status="reading" data-id="${b.id}">Читаю</button><button class="small" data-status="read" data-id="${b.id}">✓</button></div>
      </div>
    </article>`;
  }).join('');
  document.querySelectorAll('[data-open]').forEach(btn => btn.onclick = () => openBook(btn.dataset.open));
  document.querySelectorAll('[data-status]').forEach(btn => btn.onclick = () => { state(btn.dataset.id).status = btn.dataset.status; state(btn.dataset.id).updatedAt = new Date().toISOString(); saveProgress(); renderLibrary(); });
}

async function openBook(id){
  currentBook = books.find(b => b.id === id);
  if(!currentBook) return;
  $('#reader').classList.add('open');
  $('#reader').setAttribute('aria-hidden','false');
  $('#readerBookTitle').textContent = currentBook.title;
  const st = state(id);
  if(st.status === 'unread') st.status = 'reading';
  pageNum = st.lastPage || 1;
  saveProgress();
  pdfDoc = await pdfjsLib.getDocument(fileUrl(currentBook.file)).promise;
  st.totalPages = pdfDoc.numPages;
  pageNum = Math.min(Math.max(1, pageNum), pdfDoc.numPages);
  $('#pageSlider').max = pdfDoc.numPages;
  await renderPage(pageNum);
}

function calcScale(page){
  const base = page.getViewport({scale:1});
  const mobile = matchMedia('(max-width:850px)').matches;
  const maxW = mobile ? innerWidth * .96 : Math.min(innerWidth * .88, 1100);
  const maxH = mobile ? innerHeight * .78 : innerHeight * .72;
  return Math.min(maxW / base.width, maxH / base.height, mobile ? 2.2 : 1.9);
}

async function renderPage(num){
  if(!pdfDoc || rendering) return;
  rendering = true;
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({scale:calcScale(page)});
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({canvasContext:ctx, viewport}).promise;
  $('#pageInfo').textContent = `Сторінка ${num} / ${pdfDoc.numPages}`;
  $('#pageSlider').value = num;
  const st = state(currentBook.id);
  st.lastPage = num;
  st.totalPages = pdfDoc.numPages;
  st.updatedAt = new Date().toISOString();
  if(st.status === 'unread') st.status = 'reading';
  saveProgress();
  rendering = false;
}

async function turnTo(nextNum, direction){
  if(!pdfDoc || nextNum < 1 || nextNum > pdfDoc.numPages || rendering) return;
  const wrap = $('#pageWrap');
  wrap.classList.add(direction === 'next' ? 'flipNext' : 'flipPrev');
  await new Promise(r => setTimeout(r, 130));
  pageNum = nextNum;
  await renderPage(pageNum);
  await new Promise(r => setTimeout(r, 70));
  wrap.classList.remove('flipNext','flipPrev');
}

$('#prevPage').onclick = () => turnTo(pageNum - 1, 'prev');
$('#nextPage').onclick = () => turnTo(pageNum + 1, 'next');
$('#tapPrev').onclick = () => $('#prevPage').click();
$('#tapNext').onclick = () => $('#nextPage').click();
$('#pageSlider').oninput = e => turnTo(Number(e.target.value), Number(e.target.value) > pageNum ? 'next' : 'prev');
$('#closeReader').onclick = () => { $('#reader').classList.remove('open'); $('#reader').setAttribute('aria-hidden','true'); pdfDoc = null; renderLibrary(); };
$('#markRead').onclick = () => { if(!currentBook || !pdfDoc) return; const st=state(currentBook.id); st.status='read'; st.lastPage=pdfDoc.numPages; st.totalPages=pdfDoc.numPages; st.updatedAt=new Date().toISOString(); saveProgress(); renderLibrary(); alert('Книжку позначено як прочитану'); };

let sx=0, sy=0;
$('#reader').addEventListener('touchstart', e => { sx=e.changedTouches[0].clientX; sy=e.changedTouches[0].clientY; }, {passive:true});
$('#reader').addEventListener('touchend', e => {
  const dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
  if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.4){ dx < 0 ? $('#nextPage').click() : $('#prevPage').click(); }
}, {passive:true});
addEventListener('keydown', e => { if(!$('#reader').classList.contains('open')) return; if(e.key==='ArrowLeft') $('#prevPage').click(); if(e.key==='ArrowRight') $('#nextPage').click(); if(e.key==='Escape') $('#closeReader').click(); });
addEventListener('resize', () => { if(pdfDoc) renderPage(pageNum); });

$('#search').oninput = renderLibrary;
$('#filter').onchange = renderLibrary;
$('#exportProgress').onclick = () => { const blob = new Blob([JSON.stringify(progress,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='progress.json'; a.click(); URL.revokeObjectURL(a.href); };
$('#importProgress').onchange = async e => { const f=e.target.files[0]; if(!f) return; progress=JSON.parse(await f.text()); saveProgress(); renderLibrary(); };

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstallPrompt = e; showInstallPanel(false); });
function isiOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function isStandalone(){ return matchMedia('(display-mode: standalone)').matches || navigator.standalone; }
function showInstallPanel(ios){
  if(isStandalone() || localStorage.getItem('install-panel-closed')) return;
  $('#installPanel').classList.remove('hidden');
  $('#installText').textContent = ios ? 'На iPhone: Safari → Поділитися → На початковий екран.' : 'Натисни кнопку, щоб встановити бібліотеку як застосунок.';
  $('#installBtn').textContent = ios ? 'Інструкція' : 'Встановити';
}
$('#installBtn').onclick = async () => { if(deferredInstallPrompt){ deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt=null; $('#installPanel').classList.add('hidden'); } else if(isiOS()){ alert('Відкрий сайт у Safari → натисни Поділитися → На початковий екран.'); } };
$('#closeInstall').onclick = () => { localStorage.setItem('install-panel-closed','1'); $('#installPanel').classList.add('hidden'); };
if(isiOS()) setTimeout(() => showInstallPanel(true), 1000);

if('serviceWorker' in navigator){ window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.warn)); }
loadBooks().catch(err => { console.error(err); $('#library').innerHTML = '<div class="empty glass">Не вдалося завантажити каталог. Перевір data/books.json або дочекайся завершення GitHub Actions.</div>'; });
