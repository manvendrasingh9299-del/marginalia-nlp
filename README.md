# Marginalia — NLP Toolkit

[![CI](https://github.com/manvendrasingh9299-del/marginalia-nlp/actions/workflows/ci.yml/badge.svg)](https://github.com/manvendrasingh9299-del/marginalia-nlp/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

A full-stack NLP dashboard: a FastAPI backend running six NLP tasks on
local, free Hugging Face and spaCy models, paired with a React frontend
for exploring the results interactively. **No API key required** —
everything runs on your machine, offline after the first model download.

---

## Features

| Task | Model | What it does |
|---|---|---|
| **Sentiment** | `distilbert-base-uncased-finetuned-sst-2-english` | Classifies text as positive/negative with a confidence score |
| **Summarize** | `sshleifer/distilbart-cnn-12-6` | Generates an abstractive summary of longer passages |
| **Entities** | spaCy `en_core_web_sm` | Extracts people, places, organizations, dates, etc., rendered as inline highlights |
| **Keywords** | YAKE | Unsupervised extraction of key terms and phrases, no training data needed |
| **Similarity** | `all-MiniLM-L6-v2` | Ranks a set of candidate texts by semantic closeness to a query |
| **Batch** | Sentiment model, run per line | Paste multiple lines, get sentiment for each in one request |

Every model above is open-source and runs locally via `transformers`,
`spacy`, and `sentence-transformers` — no external API call, no billing.

**Frontend extras:** dark mode, drag-and-drop `.txt` file upload, per-panel
analysis history with re-run, JSON/CSV export, keyboard shortcuts
(`⌘/Ctrl + Enter` to run), and a configurable API base URL — all from a
single menu in the top bar.

## Project structure