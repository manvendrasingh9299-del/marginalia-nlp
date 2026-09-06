# Marginalia — NLP Toolkit

A small full-stack NLP dashboard. Python/FastAPI backend running local, free
Hugging Face and spaCy models; React frontend for exploring the results.
No API key required — everything runs on your machine.

**Features**
- Sentiment analysis (DistilBERT, SST-2)
- Abstractive summarization (DistilBART)
- Named entity recognition (spaCy `en_core_web_sm`), rendered as inline highlights
- Keyword / key-phrase extraction (YAKE)
- Semantic similarity search (Sentence-Transformers `all-MiniLM-L6-v2`)

## Project structure

```
nlp-toolkit/
├── backend/
│   └── app/
│       ├── main.py          # FastAPI app + CORS
│       ├── models.py        # request/response schemas
│       ├── nlp_models.py    # lazy-loaded, cached model singletons
│       └── routes/
│           └── analyze.py   # all /analyze/* endpoints
└── frontend/
    └── src/
        ├── App.jsx
        ├── api.js
        └── components/      # one panel per feature
```

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

## License

MIT — do whatever you want with it.
