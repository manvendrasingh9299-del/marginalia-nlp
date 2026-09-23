<div align="center">

# Marginalia
### NLP Toolkit

*Sentiment · Summarization · Entities · Keywords · Similarity · Batch*
badge/license-MIT-blue)


uvicorn app.main:app --reload --port 8000
```

First request to each endpoint downloads its model weights (a few
hundred MB total) — happens once, then it's cached locally.

</details>

<details>
<summary><b>Frontend</b></summary>
<br>

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

</details>

<br>

## 🧪 Testing

```bash
cd frontend && npm test              # Vitest + React Testing Library
cd backend  && python3 -m pytest tests/ -v   # mocked models, no downloads
```

<br>

## 📁 Project structure

<details>
<summary>Expand</summary>
<br>

nlp-toolkit/
├── start.sh
├── backend/
│ ├── requirements.txt
│ ├── .env.example
│ ├── tests/test_analyze.py
│ └── app/
│ ├── main.py
│ ├── models.py
│ ├── nlp_models.py
│ └── routes/analyze.py
└── frontend/
├── index.html
├── package.json
├── .env.example
└── src/
├── App.jsx
├── api.js
├── index.css
├── hooks/useHistory.js
├── utils/export.js
├── context/ToastContext.jsx
├── test/
└── components/


</details>

<br>

## 📡 API reference
  
<details>
<summary>Expand — full endpoint list</summary>
<br>

Interactive docs at `http://localhost:8000/docs` once running.

| Method | Endpoint | Body |
|---|---|---|
| `POST` | `/analyze/sentiment` | `{ "text": string }` |
| `POST` | `/analyze/summarize` | `{ "text": string, "max_length": int, "min_length": int }` |
| `POST` | `/analyze/entities` | `{ "text": string }` |
| `POST` | `/analyze/keywords` | `{ "text": string }` |
| `POST` | `/analyze/similarity` | `{ "query": string, "candidates": string[] }` |
| `POST` | `/analyze/batch-sentiment` | `{ "texts": string[] }` |

</details>

<br>

## 🌍 Environment & deployment

<details>
<summary>Expand</summary>
<br>

**Env config:**
```bash
cp backend/.env.example backend/.env     # sets FRONTEND_ORIGINS
cp frontend/.env.example frontend/.env   # sets VITE_API_BASE_URL
```
The frontend URL can also be changed at runtime from the ☰ menu.

**Deploy frontend** (static build) to Vercel/Netlify/GitHub Pages:
```bash
cd frontend && npm run build
```

**Deploy backend** to Render/Fly.io/Railway:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
Set `FRONTEND_ORIGINS` on the host to your deployed frontend's URL.

**CI:** `.github/workflows/ci.yml` runs tests + build on every push.

</details>

<br>

## 🩹 Troubleshooting

<details>
<summary>Expand</summary>
<br>

- **`pip install` fails with "externally-managed-environment"** — venv
  isn't actually active. Run `source .venv/bin/activate` and confirm
  `which python3` points inside `.venv/bin/`.
- **Summarize returns 500** — fixed in current `nlp_models.py`, which
  tries both old and new `transformers` task names.
- **CORS errors** — check `FRONTEND_ORIGINS` in `backend/.env`.
- **"Failed to fetch"** — open the ☰ menu, confirm the API URL matches
  where your backend is actually running.
- **First Summarize/Similarity/Batch request is slow** — model weights
  downloading, one-time only.

</details>

<br>

## 🗺 Roadmap

- [ ] Persist history to SQLite (currently in-memory)
- [ ] `.pdf` upload support
- [ ] `docker-compose up` for both services
- [ ] Backend tests against real models (slow, opt-in CI job)

<br>

---

<div align="center">

MIT licensed — built as a personal project, PRs welcome.

</div>
