#!/usr/bin/env bash
set -e
python library_builder.py
python -m http.server 8000
