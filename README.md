<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#1a1a2e">
    <title>Book Reader</title>
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icons/icon-192x192.png">
    <link rel="stylesheet" href="css/themes.css">
    <link rel="stylesheet" href="css/styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
</head>
<body data-theme="dark">
    <div id="app">
        <header class="app-header">
            <h1>📚 Моя Бібліотека</h1>
            <div class="header-controls">
                <button id="theme-btn" class="icon-btn" title="Тема">🎨</button>
            </div>
        </header>

        <div id="theme-panel" class="panel hidden">
            <div class="panel-header">
                <h3>Оберіть тему</h3>
                <button class="close-panel">✕</button>
            </div>
            <div class="theme-grid">
                <button class="theme-option" data-theme="dark">🌑 Темна</button>
                <button class="theme-option" data-theme="light">☀️ Світла</button>
                <button class="theme-option" data-theme="warm">🔥 Тепла</button>
                <button class="theme-option" data-theme="mint">🌿 М'ятна</button>
                <button class="theme-option" data-theme="sage">🌾 Шавлієва</button>
                <button class="theme-option" data-theme="blue">💧 Блакитна</button>
                <button class="theme-option" data-theme="newspaper">📰 Газетна</button>
            </div>
        </div>

        <main class="library-grid" id="library">
            <div class="loading">Завантаження бібліотеки...</div>
        </main>

        <div id="empty-state" class="hidden">
            <div class="empty-icon">📂</div>
            <h2>Бібліотека порожня</h2>
            <p>Додайте PDF-файли у папку <code>books/</code> на GitHub</p>
        </div>
    </div>

    <script src="js/storage.js"></script>
    <script src="js/library.js"></script>
    <script src="js/app.js"></script>
</body>
</html>