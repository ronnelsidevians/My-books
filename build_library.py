#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
import argparse, json, re, unicodedata, shutil

ROOT = Path(__file__).resolve().parent
BOOKS_DIR = ROOT / 'books'
SRC_DIR = ROOT / 'src'
ICONS_DIR = ROOT / 'icons'
TR = {'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ie','ж':'zh','з':'z','и':'y','і':'i','ї':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'iu','я':'ia','ы':'y','э':'e','ъ':'','ё':'yo'}

def slug(text):
    text=''.join(TR.get(c,c) for c in text.lower())
    text=unicodedata.normalize('NFKD', text)
    text=''.join(c for c in text if not unicodedata.combining(c))
    text=re.sub(r'[^a-z0-9]+','-',text).strip('-')
    return text or 'book'

def all_pdfs():
    return sorted([p for p in BOOKS_DIR.iterdir() if p.is_file() and p.suffix.lower()=='.pdf'], key=lambda p:p.name.lower()) if BOOKS_DIR.exists() else []

def render_cover(pdf, out_file, zoom=2.0):
    try:
        import fitz
        from PIL import Image
        doc=fitz.open(str(pdf))
        if doc.page_count < 1: return False
        page=doc.load_page(0); r=page.rect
        clip=fitz.Rect(r.x0+r.width/2, r.y0, r.x1, r.y1)  # right half
        pix=page.get_pixmap(matrix=fitz.Matrix(zoom,zoom), clip=clip, alpha=False)
        img=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
        target=2/3; w,h=img.size
        if h and w/h > target:
            nw=int(h*target); left=max(0,(w-nw)//2); img=img.crop((left,0,left+nw,h))
        if img.width > 720:
            nh=int(img.height*(720/img.width)); img=img.resize((720,nh), Image.LANCZOS)
        out_file.parent.mkdir(parents=True, exist_ok=True)
        img.save(out_file, 'JPEG', quality=88, optimize=True)
        return True
    except Exception as e:
        print(f'Cover skipped for {pdf.name}: {e}')
        return False

def copy_tree(src, dst):
    if src.exists():
        if dst.exists(): shutil.rmtree(dst)
        shutil.copytree(src, dst)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--out', default='dist')
    ap.add_argument('--title', default='Моя PDF-бібліотека')
    ap.add_argument('--author', default='Невідомий автор')
    ap.add_argument('--category', default='Без категорії')
    ap.add_argument('--cover-zoom', type=float, default=2.0)
    args=ap.parse_args()
    out=ROOT / args.out
    if out.exists(): shutil.rmtree(out)
    (out/'data').mkdir(parents=True)
    (out/'covers').mkdir(parents=True)
    (out/'books').mkdir(parents=True)
    (out/'icons').mkdir(parents=True)

    for name in ['index.html','app.js','styles.css','manifest.webmanifest','sw.js']:
        shutil.copy2(SRC_DIR/name, out/name)
    copy_tree(ICONS_DIR, out/'icons')
    shutil.copy2(ROOT/'.nojekyll', out/'.nojekyll') if (ROOT/'.nojekyll').exists() else (out/'.nojekyll').write_text('')
    copy_tree(BOOKS_DIR, out/'books')

    used=set(); books=[]; cover_count=0
    for pdf in all_pdfs():
        base=slug(pdf.stem); ident=base; i=2
        while ident in used:
            ident=f'{base}-{i}'; i+=1
        used.add(ident)
        cover_path=out/'covers'/f'{ident}.jpg'
        ok=render_cover(pdf, cover_path, args.cover_zoom)
        cover_count += 1 if ok else 0
        books.append({
            'id': ident,
            'title': pdf.stem,
            'author': args.author,
            'category': args.category,
            'file': 'books/' + pdf.name,
            'cover': 'covers/' + cover_path.name if ok else '',
            'tags': []
        })
    (out/'data'/'books.json').write_text(json.dumps({'title':args.title,'books':books}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'PDF found: {len(books)}')
    print(f'Covers generated: {cover_count}')
    print(f'Output: {out}')

if __name__=='__main__': main()
