# PDF Library для GitHub Pages

Готовий шаблон: додаєш PDF у `books/`, робиш push — GitHub Actions сам генерує красивий сайт.

## Швидкий старт

1. Створи новий репозиторій на GitHub.
2. Розпакуй цей архів у корінь репозиторію.
3. Додай PDF-файли в папку `books/`.
4. Зроби commit/push у `main`.
5. Увімкни GitHub Pages: `Settings → Pages → Source → GitHub Actions`.

## Локальна перевірка

```bash
pip install -r requirements.txt
python library_builder_onefile.py --title "Моя PDF-бібліотека"
python -m http.server 8000
```

Кириличні назви PDF підтримуються. Обкладинка береться з правої половини першої сторінки.
