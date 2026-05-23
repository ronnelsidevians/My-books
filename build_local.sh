#!/usr/bin/env bash
set -e
python -m pip install -r requirements.txt
python library_builder_onefile.py
python -m http.server 8000
