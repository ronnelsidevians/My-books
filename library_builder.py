#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
import argparse, json, html, re, unicodedata

ROOT = Path(__file__).resolve().parent
BOOKS = ROOT / 'books'
TEMPLATE = ROOT / 'template.html'
OUT = ROOT / 'index.html'
TR = {'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ie','ж':'zh','з':'z','и':'y','і':'i','ї':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'iu','я':'ia','ы':'y','э':'e','ъ':'','ё':'yo'}

def slug(text):
    text = ''.join(TR.get(ch, ch) for ch in text.lower())
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(ch for ch in text if not unicodedata.combining(ch))
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-') or 'book'

def scan_books():
    BOOKS.mkdir(exist_ok=True)
    pdfs = list(BOOKS.glob('*.pdf')) + list(BOOKS.glob('*.PDF'))
    used = set()
    out = []
    for pdf in sorted(pdfs, key=lambda p: p.name.lower()):
        title = pdf.stem.strip()
        base = slug(title)
        ident = base
        n = 2
        while ident in used:
            ident = f'{base}-{n}'
            n += 1
        used.add(ident)
        out.append({'id': ident, 'title': title, 'file': 'books/' + pdf.name, 'category': 'PDF', 'tags': []})
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--title', default='Моя PDF-бібліотека')
    args = ap.parse_args()
    data = json.dumps(scan_books(), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    html_text = TEMPLATE.read_text(encoding='utf-8').replace('__TITLE__', html.escape(args.title)).replace('__BOOKS__', data)
    OUT.write_text(html_text, encoding='utf-8')
    print(f'Generated index.html. Books: {len(scan_books())}')
if __name__ == '__main__':
    main()
