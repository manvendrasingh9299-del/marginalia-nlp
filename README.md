<div align="center">

# Marginalia
### NLP Toolkit

*Sentiment · Summarization · Entities · Keywords · Similarity · Batch*

[![CI](https://github.com/manvendrasingh9299-del/marginalia-nlp/actions/workflows/ci.yml/badge.svg)](https://github.com/manvendrasingh9299-del/marginalia-nlp/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-blue)

A full-stack NLP dashboard running six analysis tasks on free, local
Hugging Face and spaCy models — no API key, no billing, works offline
after the first model download.

</div>

<br>

<!--
  Add a real screenshot or GIF of the app here once you have one:
  ![Marginalia screenshot](docs/screenshot.png)
-->

## ⚡ Quick start

```bash
git clone https://github.com/manvendrasingh9299-del/marginalia-nlp.git
cd marginalia-nlp
./start.sh
```

Opens the backend on `:8000` and frontend on `:5173`. First-time setup
(installing dependencies) is one section down ↓

<br>

## 🧠 What it does

| Task | Model |
|---|---|
| **Sentiment** | `distilbert-base-uncased-finetuned-sst-2-english` |
| **Summarize** | `sshleifer/distilbart-cnn-12-6` |
| **Entities** | spaCy `en_core_web_sm` |
| **Keywords** | YAKE (unsupervised) |
| **Similarity** | `all-MiniLM-L6-v2` |
| **Batch** | Sentiment model, run per line |

Plus: dark mode, drag-and-drop `.txt` upload, per-panel history with
re-run, JSON/CSV export, `⌘/Ctrl + Enter` shortcuts, and a configurable
API URL — all in one menu, top bar.

<br>

## 🛠 First-time setup

<details>
<summary><b>Backend</b></summary>
<br>

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
python3 -m pip install -r requirements.txt
python3 -m spacy download en_core_web_sm

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
hosting processing 


<br>

## 🌍 Environment & deployment

<details>
<summary>Expand</summary>
<br>

tend/.env   # sets VITE_API_BASE_URL
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

- **First Summarize/Similarity/Batch request is slow** — model weights
  downloading, one-time only.

</details>

<br>

## 🗺 Roadmap


- [ ] `.pdf` upload support
- [ ] `docker-compose up` for both services
- [ ] Backend tests against real models (slow, opt-in CI job)

<br>

---

<div align="center">

MIT licensed — built as a personal project, PRs welcome.

</div>
