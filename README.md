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
