const Library = {
  BOOKS_PATH: 'books/',
  books: [],

  async init() {
    const libraryEl = document.getElementById('library');
    libraryEl.innerHTML = '<div class="loading">Завантаження бібліотеки...</div>';

    try {
      this.books = await this.scanBooks();

      if (this.books.length === 0) {
        document.getElementById('empty-state').classList.remove('hidden');
        libraryEl.innerHTML = '';
        return;
      }

      this.render();
    } catch (error) {
      console.error('Помилка завантаження бібліотеки:', error);
      libraryEl.innerHTML = '<div class="loading">Помилка завантаження. Спробуйте оновити сторінку.</div>';
    }
  },

  async scanBooks() {
    try {
      const response = await fetch(this.BOOKS_PATH + 'books.json');
      if (response.ok) {
        const data = await response.json();
        return data.books || [];
      }
    } catch (e) {
      console.log('books.json не знайдено, використовуємо демо-режим');
    }
    return [];
  },

  async generateCover(pdfUrl) {
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const fullCanvas = document.createElement('canvas');
      const fullCtx = fullCanvas.getContext('2d');
      fullCanvas.width = viewport.width;
      fullCanvas.height = viewport.height;

      await page.render({
        canvasContext: fullCtx,
        viewport: viewport
      }).promise;

      const coverCanvas = document.createElement('canvas');
      const coverCtx = coverCanvas.getContext('2d');
      const halfWidth = Math.floor(viewport.width / 2);
      coverCanvas.width = halfWidth;
      coverCanvas.height = viewport.height;

      coverCtx.drawImage(
        fullCanvas,
        halfWidth, 0, halfWidth, viewport.height,
        0, 0, halfWidth, viewport.height
      );

      return coverCanvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      console.error('Помилка генерації обкладинки:', error);
      return null;
    }
  },

  async render() {
    const libraryEl = document.getElementById('library');
    libraryEl.innerHTML = '';

    for (const book of this.books) {
      const progress = Storage.getProgress(book.id);
      const card = await this.createBookCard(book, progress);
      libraryEl.appendChild(card);
    }
  },

  async createBookCard(book, progress) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.bookId = book.id;

    let coverUrl = book.cover || null;
    if (!coverUrl && book.url) {
      this.generateCover(book.url).then(url => {
        if (url) {
          const img = card.querySelector('.book-cover img');
          if (img) img.src = url;
        }
      });
    }

    const isRead = progress.isRead;
    const percent = progress.percent || 0;

    card.innerHTML = `
      <div class="book-cover">
        ${coverUrl ? `<img src="${coverUrl}" alt="${book.title}" loading="lazy">` : ''}
        <div class="book-cover-placeholder">📖</div>
        ${isRead ? '<span class="read-badge">✓ Прочитано</span>' : ''}
        ${!isRead && percent > 0 ? `
          <div class="reading-progress">
            <div class="reading-progress-bar" style="width: ${percent}%"></div>
          </div>
        ` : ''}
      </div>
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-pages">${progress.currentPage || 1} / ${progress.totalPages || '?'} стор.</div>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `reader.html?book=${encodeURIComponent(book.id)}&url=${encodeURIComponent(book.url)}&title=${encodeURIComponent(book.title)}`;
    });

    return card;
  }
};
