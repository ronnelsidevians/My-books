# Stitch-adapted Personal PDF Reader

Адаптація інтерфейсу з архіву Stitch Personal PDF Reader під статичний GitHub Pages застосунок.

## Функції

- Бібліотека PDF з папки `books/`.
- Екрани: Library / Add / Recent / Settings у стилі Stitch/Lumen Reader.
- 4 теми: світла, темна, мʼятна, тепла.
- Повноекранний reader без білого контейнера навколо сторінки.
- На мобільному: ліва половина PDF-сторінки → права половина → наступна сторінка.
- Жести: свайп, тап по краях, тап по центру для панелей.
- Zoom +/−, прогрес читання, імпорт/експорт прогресу.

## Запуск локально

```bash
python library_builder.py
python -m http.server 8000
```

## GitHub Pages

1. Додай PDF у `books/`.
2. Залий усі файли в корінь репозиторію.
3. Увімкни `Settings → Pages → Source → GitHub Actions`.
4. Зроби push і дочекайся зеленого статусу Actions.

Після оновлення відкрий сайт з `?v=stitch2`, щоб оминути кеш.
