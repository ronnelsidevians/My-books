#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pathlib import Path
import argparse
import json
import html
import re
import unicodedata
import shutil

ROOT = Path(__file__).resolve().parent
BOOKS_DIR = ROOT / "books"
TEMPLATE_FILE = ROOT / "template.html"

TR = {
    "а": "a", "б": "b", "в": "v", "г": "h", "ґ": "g",
    "д": "d", "е": "e", "є": "ie", "ж": "zh", "з": "z",
    "и": "y", "і": "i", "ї": "i", "й": "i", "к": "k",
    "л": "l", "м": "m", "н": "n", "о": "o", "п": "p",
    "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f",
    "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh",
    "щ": "shch", "ь": "", "ю": "iu", "я": "ia"
}


def slug(text: str) -> str:
    text = "".join(TR.get(ch, ch) for ch in text.lower())
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "book"


def scan_books():
    BOOKS_DIR.mkdir(exist_ok=True)

    pdfs = list(BOOKS_DIR.glob("*.pdf")) + list(BOOKS_DIR.glob("*.PDF"))
    used = set()
    books = []

    for pdf in sorted(pdfs, key=lambda p: p.name.lower()):
        title = pdf.stem.strip()
        base = slug(title)
        ident = base
        i = 2

        while ident in used:
            ident = f"{base}-{i}"
            i += 1

        used.add(ident)

        books.append({
            "id": ident,
            "title": title,
            "file": "books/" + pdf.name,
            "category": "PDF",
            "tags": []
        })

    return books


def fallback_template():
    return """<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<title>__TITLE__</title>
<style>
body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  background: #031714;
  color: #d0e7e2;
}
.wrap {
  padding: 24px;
}
.marker {
  display: inline-block;
  background: #fffb00;
  color: #111;
  padding: 10px 14px;
  border-radius: 14px;
  font-weight: 900;
}
.card {
  margin-top: 20px;
  padding: 18px;
  border-radius: 20px;
  background: #0a1f1c;
  border: 1px solid #3c4947;
}
</style>
</head>
<body>
<div class="wrap">
  <div class="marker">ОНОВЛЕНО: BUILD FIX</div>
  <h1>__TITLE__</h1>
  <p>PDF знайдено: <b id="count"></b></p>
  <div id="books"></div>
</div>

<script type="application/json" id="booksData">__BOOKS__</script>
<script>
const books = JSON.parse(document.getElementById("booksData").textContent);
document.getElementById("count").textContent = books.length;
document.getElementById("books").innerHTML = books.map(book => `
  <div class="card">
    <h2>${book.title}</h2>
    <p>${book.file}</p>
  </div>
`).join("") || "<p>PDF не знайдено. Додай файли в папку books/.</p>";
</script>
</body>
</html>"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="dist")
    parser.add_argument("--title", default="Моя PDF-бібліотека")
    args = parser.parse_args()

    out_dir = ROOT / args.out

    if out_dir.exists():
        shutil.rmtree(out_dir)

    out_dir.mkdir(parents=True, exist_ok=True)

    books = scan_books()
    books_json = json.dumps(
        books,
        ensure_ascii=False,
        separators=(",", ":")
    ).replace("</", "<\\/")

    if TEMPLATE_FILE.exists():
        template = TEMPLATE_FILE.read_text(encoding="utf-8")
    elif (ROOT / "index.html").exists():
        template = (ROOT / "index.html").read_text(encoding="utf-8")
    else:
        template = fallback_template()

    result = (
        template
        .replace("__TITLE__", html.escape(args.title))
        .replace("__BOOKS__", books_json)
    )

    (out_dir / "index.html").write_text(result, encoding="utf-8")
    (out_dir / ".nojekyll").write_text("", encoding="utf-8")

    if BOOKS_DIR.exists():
        shutil.copytree(BOOKS_DIR, out_dir / "books", dirs_exist_ok=True)

    print(f"Built {out_dir}/index.html")
    print(f"Books found: {len(books)}")


if __name__ == "__main__":
    main()
