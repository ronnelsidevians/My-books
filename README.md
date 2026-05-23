# My Books PWA

Готовий шаблон PDF-бібліотеки для GitHub Pages.

## Як додавати книжки

1. Додай PDF-файли у папку `books/`.
2. Зроби `Commit changes`.
3. GitHub Actions автоматично згенерує `data/books.json`, обкладинки з правої половини першої сторінки PDF і опублікує сайт.
4. Дочекайся зеленої галочки у `Actions → Build and deploy PDF library`.
5. Відкрий сайт GitHub Pages.

## Важливо

- Кириличні назви PDF підтримуються.
- Краще не використовувати в назвах файлів символи `#`, `?`, `%`.
- Прогрес читання зберігається локально в браузері користувача через `localStorage`.
- Додавання нових книжок не стирає локальний прогрес, якщо старі файли не перейменовувати.

## PWA

Сайт має `manifest.webmanifest`, `sw.js`, іконки та iOS meta-теги. На Android має з'являтися кнопка встановлення. На iPhone: Safari → Поділитися → На початковий екран.

## Локальна перевірка

```bash
pip install -r requirements.txt
python build_library.py --out dist --title "Моя PDF-бібліотека"
cd dist
python -m http.server 8000
```

Потім відкрити: `http://localhost:8000`.
