const Reader = {
  pdfDoc: null,
  currentPage: 1,
  totalPages: 0,
  scale: 1.5,
  bookId: '',
  bookUrl: '',
  bookTitle: '',
  isMobile: window.innerWidth <= 768,
  uiVisible: true,

  async init() {
    const params = new URLSearchParams(window.location.search);
    this.bookId = params.get('book') || 'unknown';
    this.bookUrl = params.get('url') || '';
    this.bookTitle = params.get('title') || 'Книга';

    if (!this.bookUrl) {
      alert('Помилка: не вказано URL книги');
      window.location.href = 'index.html';
      return;
    }

    document.getElementById('book-title').textContent = this.bookTitle;
    document.getElementById('mobile-title').textContent = this.bookTitle;

    const progress = Storage.getProgress(this.bookId);
    this.currentPage = progress.currentPage || 1;

    await this.loadPDF();
    this.setupEvents();
    this.setupTouchEvents();

    const settings = Storage.getSettings();
    if (settings.theme) {
      document.body.dataset.theme = settings.theme;
    }

    if (this.isMobile) {
      this.enterFullscreen();
    }
  },

  async loadPDF() {
    const canvas = document.getElementById('pdf-canvas');
    const container = document.querySelector('.reader-container');

    container.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <span>Завантаження книги...</span>
      </div>
    `;

    try {
      const loadingTask = pdfjsLib.getDocument(this.bookUrl);
      this.pdfDoc = await loadingTask.promise;
      this.totalPages = this.pdfDoc.numPages;

      container.innerHTML = '<canvas id="pdf-canvas"></canvas>';

      if (this.isMobile) {
        const touchZones = document.createElement('div');
        touchZones.className = 'touch-zones mobile-only';
        touchZones.id = 'touch-zones';
        touchZones.innerHTML = `
          <div class="touch-zone touch-left" data-action="prev"></div>
          <div class="touch-zone touch-center" data-action="menu"></div>
          <div class="touch-zone touch-right" data-action="next"></div>
        `;
        container.appendChild(touchZones);
        this.setupTouchZones();
      }

      if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
      }

      await this.renderPage(this.currentPage);
      this.updateUI();

    } catch (error) {
      console.error('Помилка завантаження PDF:', error);
      container.innerHTML = `
        <div class="loading-container">
          <span>❌ Помилка завантаження книги</span>
          <span style="font-size: 0.9rem; margin-top: 0.5rem;">Перевірте підключення до інтернету</span>
        </div>
      `;
    }
  },

  async renderPage(pageNum) {
    if (!this.pdfDoc || pageNum < 1 || pageNum > this.totalPages) return;

    const canvas = document.getElementById('pdf-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    try {
      const page = await this.pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: this.scale });

      const isRightSide = pageNum % 2 === 1;

      const halfWidth = Math.floor(viewport.width / 2);
      canvas.width = halfWidth;
      canvas.height = viewport.height;

      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--reader-bg');
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;
      const tempCtx = tempCanvas.getContext('2d');

      await page.render({
        canvasContext: tempCtx,
        viewport: viewport
      }).promise;

      const sx = isRightSide ? halfWidth : 0;
      ctx.drawImage(
        tempCanvas,
        sx, 0, halfWidth, viewport.height,
        0, 0, halfWidth, viewport.height
      );

      this.currentPage = pageNum;
      this.updateUI();

      Storage.saveProgress(this.bookId, this.currentPage, this.totalPages);

      if (this.currentPage >= this.totalPages) {
        Storage.markAsRead(this.bookId, this.totalPages);
      }

    } catch (error) {
      console.error('Помилка рендерингу:', error);
    }
  },

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.renderPage(this.currentPage + 1);
    }
  },

  prevPage() {
    if (this.currentPage > 1) {
      this.renderPage(this.currentPage - 1);
    }
  },

  updateUI() {
    const pageIndicator = document.getElementById('page-indicator');
    const mobileIndicator = document.getElementById('mobile-page-indicator');
    const progressFill = document.getElementById('progress-fill');

    const text = `${this.currentPage} / ${this.totalPages}`;
    if (pageIndicator) pageIndicator.textContent = `Сторінка ${text}`;
    if (mobileIndicator) mobileIndicator.textContent = text;

    if (progressFill) {
      const percent = this.totalPages > 0 ? (this.currentPage / this.totalPages) * 100 : 0;
      progressFill.style.width = `${percent}%`;
    }
  },

  setupEvents() {
    document.getElementById('prev-page')?.addEventListener('click', () => this.prevPage());
    document.getElementById('next-page')?.addEventListener('click', () => this.nextPage());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') this.prevPage();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') this.nextPage();
      if (e.key === 'Escape') this.exitFullscreen();
    });

    document.getElementById('back-btn')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
    document.getElementById('mobile-back')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    document.getElementById('mobile-exit')?.addEventListener('click', () => {
      this.exitFullscreen();
    });

    document.getElementById('theme-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleThemePanel();
    });

    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const theme = e.target.dataset.theme;
        this.setTheme(theme);
      });
    });

    document.querySelectorAll('.close-panel').forEach(btn => {
      btn.addEventListener('click', () => this.closePanels());
    });

    document.addEventListener('click', (e) => {
      const panel = document.getElementById('theme-panel');
      if (panel && !panel.contains(e.target) && !e.target.closest('#theme-btn')) {
        panel.classList.add('hidden');
      }
    });

    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      if (wasMobile !== this.isMobile) {
        location.reload();
      }
    });
  },

  setupTouchEvents() {
    if (!this.isMobile) return;

    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.prevPage();
        } else {
          this.nextPage();
        }
      }
    }, { passive: true });
  },

  setupTouchZones() {
    const zones = document.querySelectorAll('.touch-zone');

    zones.forEach(zone => {
      zone.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = zone.dataset.action;

        switch(action) {
          case 'prev':
            this.prevPage();
            break;
          case 'next':
            this.nextPage();
            break;
          case 'menu':
            this.toggleMobileUI();
            break;
        }
      });
    });
  },

  toggleMobileUI() {
    this.uiVisible = !this.uiVisible;
    const topBar = document.getElementById('mobile-top-bar');
    const bottomBar = document.getElementById('mobile-bottom-bar');

    if (this.uiVisible) {
      topBar?.classList.remove('hidden');
      bottomBar?.classList.remove('hidden');
    } else {
      topBar?.classList.add('hidden');
      bottomBar?.classList.add('hidden');
    }
  },

  enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }

    this.uiVisible = false;
    document.getElementById('mobile-top-bar')?.classList.add('hidden');
    document.getElementById('mobile-bottom-bar')?.classList.add('hidden');
  },

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }

    this.uiVisible = true;
    document.getElementById('mobile-top-bar')?.classList.remove('hidden');
    document.getElementById('mobile-bottom-bar')?.classList.remove('hidden');
  },

  toggleFullscreen() {
    if (document.fullscreenElement) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  },

  setTheme(theme) {
    document.body.dataset.theme = theme;
    Storage.saveSettings({ theme });

    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  },

  toggleThemePanel() {
    const panel = document.getElementById('theme-panel');
    panel?.classList.toggle('hidden');
  },

  closePanels() {
    document.getElementById('theme-panel')?.classList.add('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Reader.init();
});
