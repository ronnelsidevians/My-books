const Storage = {
  STORAGE_KEY: 'book_reader_progress',
  SETTINGS_KEY: 'book_reader_settings',

  getAllProgress() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Помилка читання прогресу:', e);
      return {};
    }
  },

  saveProgress(bookId, currentPage, totalPages, isRead = false) {
    const progress = this.getAllProgress();
    progress[bookId] = {
      currentPage,
      totalPages,
      isRead,
      lastRead: new Date().toISOString(),
      percent: totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  },

  getProgress(bookId) {
    const progress = this.getAllProgress();
    return progress[bookId] || { currentPage: 1, totalPages: 0, isRead: false, percent: 0 };
  },

  markAsRead(bookId, totalPages) {
    this.saveProgress(bookId, totalPages, totalPages, true);
  },

  saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  },

  getSettings() {
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      return data ? JSON.parse(data) : { theme: 'dark' };
    } catch (e) {
      return { theme: 'dark' };
    }
  }
};
