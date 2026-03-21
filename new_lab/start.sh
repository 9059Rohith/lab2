#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/backend"
npm install
npm run dev &
cd "../frontend"
npm install
npm run dev
