#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
import argparse, json, html, re, unicodedata

ROOT = Path(__file__).resolve().parent
BOOKS_DIR = ROOT / 'books'
OUT = ROOT / 'index.html'
TEMPLATE = ROOT / 'template.html'

TRANSLIT = {
    'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ie','ж':'zh','з':'z','и':'y','і':'i','ї':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'iu','я':'ia','ы':'y','э':'e','ъ':'','ё':'yo'
}

def slug(text: str) -> str:
    text = ''.join(TRANSLIT.get(ch, ch) for ch in text.lower())
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(ch for ch in text if not unicodedata.combining(ch))
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-') or 'book'

def build_books():
    BOOKS_DIR.mkdir(exist_ok=True)
    pdfs = list(BOOKS_DIR.glob('*.pdf')) + list(BOOKS_DIR.glob('*.PDF'))
    used = set()
    books = []
    for pdf in sorted(pdfs, key=lambda p: p.name.lower()):
        title = pdf.stem.strip()
        base = slug(title)
        ident = base
        n = 2
        while ident in used:
            ident = f'{base}-{n}'
            n += 1
        used.add(ident)
        books.append({
            'id': ident,
            'title': title,
            'file': 'books/' + pdf.name,
            'category': 'PDF',
            'tags': []
        })
    return books

def main():
    parser = argparse.ArgumentParser(description='Генератор PDF-бібліотеки для GitHub Pages')
    parser.add_argument('--title', default='Моя PDF-бібліотека')
    args = parser.parse_args()
    data = json.dumps(build_books(), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    html_text = TEMPLATE.read_text(encoding='utf-8')
    html_text = html_text.replace('__TITLE__', html.escape(args.title)).replace('__BOOKS__', data)
    OUT.write_text(html_text, encoding='utf-8')
    print(f'Generated index.html. Books: {len(build_books())}')

if __name__ == '__main__':
    main()
