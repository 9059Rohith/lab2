@echo off
cd /d "%~dp0backend"
start cmd /k "npm install && npm run dev"
cd /d "%~dp0frontend"
start cmd /k "npm install && npm run dev"
