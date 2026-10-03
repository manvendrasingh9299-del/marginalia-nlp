# Marginalia

A full-stack NLP toolkit. FastAPI backend running six NLP tasks on free,
local Hugging Face and spaCy models, with a React frontend for exploring
results interactively. No API key required — everything runs on your
machine, offline after the first model download.

[![CI](https://github.com/manvendrasingh9299-del/marginalia-nlp/actions/workflows/ci.yml/badge.svg)](https://github.com/manvendrasingh9299-del/marginalia-nlp/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-blue)

## Quick start

```bash
git clone https://github.com/manvendrasingh9299-del/marginalia-nlp.git
cd marginalia-nlp
./start.sh
```

Backend runs on `:8000`, frontend on `:5173`. First-time setup is below.

## What it does

| Task | Model |
|---|---|
| Sentiment | `distilbert-base-uncased-finetuned-sst-2-english` |
| Summarize | `sshleifer/distilbart-cnn-12-6` |
| Entities | spaCy `en_core_web_sm` |
| Keywords | YAKE |
| Similarity | `all-MiniLM-L6-v2` |
| Batch | sentiment model, run per line |

Also: dark mode, drag-and-drop `.txt` upload, per-tab history with
re-run, JSON/CSV export, `⌘/Ctrl + Enter` to run, and a configurable API
URL — all from the menu in the top bar.

## Setup

**Backend**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
python3 -m spacy download en_core_web_sm
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

First request to each model downloads its weights (a few hundred MB
total) — happens once, then it's cached locally.

## Testing

```bash
cd frontend && npm test
cd backend  && python3 -m pytest tests/ -v
```

Backend tests mock the models, so they run in under a second with no
downloads.

## Project structure

nlp-toolkit/
├── start.sh
├── backend/
│ ├── requirements.txt
│ ├── tests/test_analyze.py
│ └── app/
│ ├── main.py
│ ├── models.py
│ ├── nlp_models.py
│ └── routes/analyze.py
└── frontend/
├── package.json
└── src/
├── App.jsx
├── api.js
├── index.css
├── hooks/useHistory.js
├── utils/export.js
├── context/ToastContext.jsx
├── test/
└── components/


## API

Interactive docs at `http://localhost:8000/docs` once running.

| Method | Endpoint | Body |
|---|---|---|
| POST | `/analyze/sentiment` | `{ text }` |
| POST | `/analyze/summarize` | `{ text, max_length, min_length }` |
| POST | `/analyze/entities` | `{ text }` |
| POST | `/analyze/keywords` | `{ text }` |
| POST | `/analyze/similarity` | `{ query, candidates }` |
| POST | `/analyze/batch-sentiment` | `{ texts }` |

## Configuration

```bash
cp backend/.env.example backend/.env      # FRONTEND_ORIGINS
cp frontend/.env.example frontend/.env    # VITE_API_BASE_URL
```

The frontend's API URL can also be changed at runtime from the menu,
saved to localStorage.

## Deployment

Frontend builds to a static bundle (`npm run build`) — deploy to
Vercel, Netlify, or GitHub Pages. Backend runs anywhere that hosts a
long-lived Python process (Render, Fly.io, Railway):

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Set `FRONTEND_ORIGINS` on the host to your deployed frontend's URL.

## Troubleshooting

- **`pip install` fails with "externally-managed-environment"** — your
  venv isn't active. Run `source .venv/bin/activate` and confirm
  `which python3` points inside `.venv/bin/`.
- **CORS errors** — check `FRONTEND_ORIGINS` in `backend/.env`.
- **"Failed to fetch"** — open the menu and confirm the API URL matches
  where your backend is running.
- **First Summarize/Similarity/Batch request is slow** — model weights
  downloading, one-time only.

## Roadmap

- [ ] Persist history to SQLite
- [ ] PDF upload support
- [ ] Docker Compose for both services

## License

MIT

