# Marginalia — NLP Toolkit

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

A full-stack NLP dashboard: a FastAPI backend running five NLP tasks on
local, free Hugging Face and spaCy models, paired with a React frontend
for exploring the results interactively. **No API key required** —
everything runs on your machine, offline after the first model download.

<p align="center">
  <em>Sentiment · Summarization · Named Entity Recognition · Keyword Extraction · Semantic Similarity</em>
</p>

---

## Features

| Task | Model | What it does |
|---|---|---|
| **Sentiment** | `distilbert-base-uncased-finetuned-sst-2-english` | Classifies text as positive/negative with a confidence score |
| **Summarize** | `sshleifer/distilbart-cnn-12-6` | Generates an abstractive summary of longer passages |
| **Entities** | spaCy `en_core_web_sm` | Extracts people, places, organizations, dates, etc., rendered as inline highlights |
| **Keywords** | YAKE | Unsupervised extraction of key terms and phrases, no training data needed |
| **Similarity** | `all-MiniLM-L6-v2` | Ranks a set of candidate texts by semantic closeness to a query |

Every model above is open-source and runs locally via `transformers`,
`spacy`, and `sentence-transformers` — there's no external API call and
no billing to worry about.

## Project structure
nlp-toolkit/
├── backend/
│ ├── requirements.txt
│ └── app/
│ ├── main.py # FastAPI app + CORS
│ ├── models.py # request/response schemas
│ ├── nlp_models.py # lazy-loaded, cached model singletons
│ └── routes/
│ └── analyze.py # all /analyze/* endpoints
└── frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
├── App.jsx
├── api.js
├── index.css
└── components/ # one panel per feature + shared Loading UI


## Architecture

┌─────────────────┐ HTTP/JSON ┌──────────────────────┐
│ React (Vite) │ ───────────────────▶ │ FastAPI │
│ localhost:5173 │ ◀─────────────────── │ localhost:8000 │
└─────────────────┘ └──────────┬────────────┘
│
┌───────────▼────────────┐
│ transformers / spaCy / │
│ sentence-transformers │
│ (local, cached models) │
└─────────────────────────┘


The frontend never talks to any external AI API — every request goes to
your own FastAPI server, which runs inference locally.

## API reference

Once the backend is running, full interactive docs are available at
`http://localhost:8000/docs` (Swagger UI). Quick reference:

| Method | Endpoint | Body |
|---|---|---|
| `POST` | `/analyze/sentiment` | `{ "text": string }` |
| `POST` | `/analyze/summarize` | `{ "text": string, "max_length": int, "min_length": int }` |
| `POST` | `/analyze/entities` | `{ "text": string }` |
| `POST` | `/analyze/keywords` | `{ "text": string }` |
| `POST` | `/analyze/similarity` | `{ "query": string, "candidates": string[] }` |

## Setup

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

uvicorn app.main:app --reload --port 8000
```

First request to each endpoint will download its model weights (a few
hundred MB total) — that only happens once.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend expects the API at
`http://localhost:8000` (see `src/api.js`).

## Roadmap / good next commits

These are real, scoped follow-ups — good candidates for your own commits
as you extend the project (and genuinely useful things to have built):

- [ ] Add a `/analyze/batch` endpoint to run all five analyses on one text in a single call
- [ ] Persist analysis history (SQLite) so past runs are browsable
- [ ] Add file upload (.txt/.pdf) instead of paste-only input
- [ ] Swap DistilBART for a smaller quantized model to cut cold-start time
- [ ] Add unit tests for each route (pytest + httpx)
- [ ] Dockerize backend + frontend with a single `docker-compose up`
- [ ] Deploy backend to a free tier (Render/Fly.io) and frontend to Vercel/Netlify

Working through a list like this one feature at a time, with a real commit
per change, is exactly what makes a repo worth showing in an interview —
the history shows how you build, not just that a button was clicked.

## Troubleshooting

- **`ModuleNotFoundError: No module named 'spacy'` or similar** — make sure
  your virtual environment is activated (`source .venv/bin/activate`)
  before running `pip install` or `uvicorn`.
- **`pip` can't find a matching `torch` version** — this usually means
  your Python version is newer than the pinned version supports. Use
  `>=` version ranges in `requirements.txt` instead of `==`, or install
  Python 3.11/3.12 via `pyenv`/`brew` if you're on a very new release.
- **CORS errors in the browser console** — confirm the backend is running
  on port 8000 and the frontend on port 5173; `app/main.py` only allows
  those two origins by default.
- **First request to Summarize/Similarity is slow** — that's the model
  weights downloading (a few hundred MB total). It only happens once;
  subsequent requests use the local cache.

## Contributing

This started as a personal project, but issues and PRs are welcome —
especially for items on the roadmap above.

## License

MIT — do whatever you want with it.