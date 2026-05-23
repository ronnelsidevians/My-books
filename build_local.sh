#!/usr/bin/env bash
set -e
python library_builder_onefile.py
python -m http.server 8000
