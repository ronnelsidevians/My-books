#!/usr/bin/env bash
set -e
python -m pip install -r requirements.txt
python build_library.py --out dist --title "Моя PDF-бібліотека"
cd dist
python -m http.server 8000
