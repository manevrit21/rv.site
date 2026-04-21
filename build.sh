#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
mkdir -p dist

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name 'dist' \
  ! -name 'node_modules' \
  ! -name '.claude' \
  -exec cp -R {} dist/ \;
