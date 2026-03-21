# New Lab2 - Neo Brutalist Portfolio + Backend

A fully new project created in `new lab2` with a raw-code frontend and a proper backend API.

## What is included

- Neo-brutalist portfolio UI (`frontend/index.html`)
- Terminal resume mode (`frontend/terminal.html`)
- Vanilla HTML/CSS/JS only on frontend (no framework, no build step)
- Express + Mongo-capable backend with memory fallback (`backend/server.js`)
- Asset wall that loads all provided files in `frontend/image/`
- Contact API, visit tracking API, terminal command logging API
- Interactive map + timeline linking
- Matrix hero typing effect
- Falling decorative icon animation on scroll
- Book-flip journey section
- Scroll-highlight marker animation
- Terminal themes, split panes, command history, and snake game via p5.js

## Folder structure

.
├── frontend/
│   ├── index.html
│   ├── neo-styles.css
│   ├── neo-main.js
│   ├── terminal.html
│   ├── styles.css
│   ├── script.js
│   ├── favicon.svg
│   ├── image/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── CNAME
└── backend/
    ├── server.js
    ├── package.json
    ├── .env
    └── .env.example

## Run backend

```bash
cd backend
npm install
npm run dev
```

## Run frontend (any static server)

```bash
cd frontend
npx serve .
```

or

```bash
cd frontend
python -m http.server 8000
```

Then open:

- Main site: `http://localhost:8000` (or your selected port)
- Terminal mode: `http://localhost:8000/terminal.html`

## Backend endpoints

- `GET /api/health`
- `GET /api/portfolio-data`
- `POST /api/visit`
- `POST /api/contact`
- `POST /api/terminal-log`
- `GET /api/stats`

## Notes

- Existing env file was copied from `c:\lab2\backend\.env` to `c:\lab2\new lab2\backend\.env` as requested.
- If MongoDB is unreachable, backend auto-falls back to in-memory mode.
