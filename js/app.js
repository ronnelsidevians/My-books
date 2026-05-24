const App = {
  init() {
    this.registerSW();
    this.setupTheme();
    this.setupUI();
    Library.init();
  },

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('SW зареєстровано:', reg.scope))
        .catch(err => console.log('Помилка SW:', err));
    }
  },

  setupTheme() {
    const settings = Storage.getSettings();
    if (settings.theme) {
      document.body.dataset.theme = settings.theme;
    }
  },

  setupUI() {
    document.getElementById('theme-btn')?.addEventListener('click', () => {
      const panel = document.getElementById('theme-panel');
      panel?.classList.toggle('hidden');
    });

    document.querySelector('.close-panel')?.addEventListener('click', () => {
      document.getElementById('theme-panel')?.classList.add('hidden');
    });

    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const theme = e.target.dataset.theme;
        document.body.dataset.theme = theme;
        Storage.saveSettings({ theme });

        document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    document.addEventListener('click', (e) => {
      const panel = document.getElementById('theme-panel');
      if (panel && !panel.contains(e.target) && !e.target.closest('#theme-btn')) {
        panel.classList.add('hidden');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
