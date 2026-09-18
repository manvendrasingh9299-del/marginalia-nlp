"""
Tests for the /analyze/* routes.

These do NOT load real ML models — every model-loading function is
monkeypatched with a lightweight fake, so the suite runs in under a
second with no downloads and no torch/spacy/sentence-transformers
import cost.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routes import analyze

client = TestClient(app)


# --- Fakes standing in for the real model-loading functions ---

def fake_sentiment_pipeline():
    def _run(text):
        return [{"label": "POSITIVE", "score": 0.987}]
    return _run


def fake_summarizer_pipeline():
    def _run(text, max_length=None, min_length=None, do_sample=None):
        return [{"summary_text": "A short fake summary."}]
    return _run


class _FakeSpacyEntity:
    def __init__(self, text, label, start, end):
        self.text = text
        self.label_ = label
        self.start_char = start
        self.end_char = end


class _FakeSpacyDoc:
    def __init__(self, ents):
        self.ents = ents


def fake_ner_model():
    def _run(text):
        return _FakeSpacyDoc(ents=[_FakeSpacyEntity("Paris", "GPE", 0, 5)])
    return _run


class _FakeKeywordExtractor:
    def extract_keywords(self, text):
        return [("test keyword", 0.05), ("another phrase", 0.12)]


def fake_keyword_extractor():
    return _FakeKeywordExtractor()


class _FakeEmbeddingModel:
    def encode(self, text, convert_to_tensor=True):
        # Return something util.cos_sim-compatible isn't needed here since
        # we monkeypatch semantic_similarity's use of util too, via a
        # simplified fake below.
        return text


# --- Health check ---

def test_health_check():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json() == {"status": "ok", "service": "nlp-toolkit-api"}


# --- Sentiment ---

def test_sentiment_success(monkeypatch):
    monkeypatch.setattr(analyze, "get_sentiment_pipeline", fake_sentiment_pipeline)
    res = client.post("/analyze/sentiment", json={"text": "I love this"})
    assert res.status_code == 200
    data = res.json()
    assert data["label"] == "POSITIVE"
    assert data["score"] == 0.987


def test_sentiment_rejects_empty_text():
    res = client.post("/analyze/sentiment", json={"text": ""})
    assert res.status_code == 422


# --- Summarize ---

def test_summarize_success(monkeypatch):
    monkeypatch.setattr(analyze, "get_summarizer_pipeline", fake_summarizer_pipeline)
    text = " ".join(["word"] * 20)  # 20 words, clears the 15-word minimum
    res = client.post(
        "/analyze/summarize",
        json={"text": text, "max_length": 50, "min_length": 10},
    )
    assert res.status_code == 200
    assert res.json()["summary"] == "A short fake summary."


def test_summarize_rejects_short_text(monkeypatch):
    monkeypatch.setattr(analyze, "get_summarizer_pipeline", fake_summarizer_pipeline)
    res = client.post(
        "/analyze/summarize",
        json={"text": "too short", "max_length": 50, "min_length": 10},
    )
    assert res.status_code == 400


# --- Entities ---

def test_entities_success(monkeypatch):
    monkeypatch.setattr(analyze, "get_ner_model", fake_ner_model)
    res = client.post("/analyze/entities", json={"text": "I visited Paris"})
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["text"] == "Paris"
    assert data[0]["label"] == "GPE"


# --- Keywords ---

def test_keywords_success(monkeypatch):
    monkeypatch.setattr(analyze, "get_keyword_extractor", fake_keyword_extractor)
    res = client.post("/analyze/keywords", json={"text": "This is a test."})
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2
    assert data[0]["keyword"] == "test keyword"


# --- Batch sentiment ---

def test_batch_sentiment_success(monkeypatch):
    monkeypatch.setattr(analyze, "get_sentiment_pipeline", fake_sentiment_pipeline)
    res = client.post(
        "/analyze/batch-sentiment",
        json={"texts": ["great product", "terrible service", "  "]},
    )
    assert res.status_code == 200
    data = res.json()
    # blank line is skipped
    assert len(data) == 2
    assert data[0]["label"] == "POSITIVE"


def test_batch_sentiment_rejects_empty_list():
    res = client.post("/analyze/batch-sentiment", json={"texts": []})
    assert res.status_code == 422