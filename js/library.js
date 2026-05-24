/* ============================================
   СТИЛІ ЧИТАЛКИ
   ============================================ */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--reader-bg);
  color: var(--text-primary);
  overflow: hidden;
}

.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.book-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

#book-title {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

#page-indicator {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.reader-controls {
  display: flex;
  gap: 0.5rem;
}

.mobile-top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 200;
  transition: transform 0.3s ease;
}

.mobile-top-bar.hidden {
  transform: translateY(-100%);
}

#mobile-title {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}

.mobile-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(20px);
  padding: 0.75rem 1rem;
  z-index: 200;
  transition: transform 0.3s ease;
}

.mobile-bottom-bar.hidden {
  transform: translateY(100%);
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s;
}

#mobile-page-indicator {
  color: white;
  font-size: 0.8rem;
  white-space: nowrap;
}

.reader-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--reader-bg);
  height: calc(100vh - 60px);
}

#pdf-canvas {
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 4px 20px var(--shadow);
}

.touch-zones {
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 50;
}

.touch-zone {
  flex: 1;
  cursor: pointer;
}

.touch-left { flex: 0 0 25%; }
.touch-center { flex: 0 0 50%; }
.touch-right { flex: 0 0 25%; }

.desktop-nav {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 100;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px var(--shadow);
  transition: all 0.2s;
}

.nav-btn:hover {
  background: var(--bg-hover);
  transform: scale(1.1);
}

.nav-btn:active {
  transform: scale(0.95);
}

#theme-panel {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1rem;
  z-index: 300;
  box-shadow: 0 10px 40px var(--shadow);
  min-width: 280px;
}

#theme-panel.hidden {
  display: none !important;
}

#theme-panel .theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

#theme-panel .theme-option {
  padding: 0.75rem;
  font-size: 0.85rem;
  border-radius: 8px;
}

:fullscreen .reader-header,
:fullscreen .desktop-nav {
  display: none !important;
}

:fullscreen .reader-container {
  height: 100vh;
}

:-webkit-full-screen .reader-header,
:-webkit-full-screen .desktop-nav {
  display: none !important;
}

:-webkit-full-screen .reader-container {
  height: 100vh;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.book-card {
  animation: fadeIn 0.3s ease;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
}
