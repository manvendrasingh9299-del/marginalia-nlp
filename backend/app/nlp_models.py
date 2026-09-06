"""
Central place where every NLP model is loaded, once, and cached.

All models here are free and run fully locally — no API key, no external
calls once the weights are downloaded the first time.
"""
from functools import lru_cache


@lru_cache(maxsize=1)
def get_sentiment_pipeline():
    from transformers import pipeline
    return pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english",
    )


@lru_cache(maxsize=1)
def get_summarizer_pipeline():
    from transformers import pipeline
    # distilbart is much lighter than bart-large-cnn and runs fine on CPU
    return pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")


@lru_cache(maxsize=1)
def get_ner_model():
    import spacy
    try:
        return spacy.load("en_core_web_sm")
    except OSError as exc:
        raise RuntimeError(
            "spaCy model 'en_core_web_sm' is not installed. Run:\n"
            "  python -m spacy download en_core_web_sm"
        ) from exc


@lru_cache(maxsize=1)
def get_keyword_extractor():
    import yake
    return yake.KeywordExtractor(lan="en", n=2, top=10)


@lru_cache(maxsize=1)
def get_embedding_model():
    from sentence_transformers import SentenceTransformer
    return SentenceTransformer("all-MiniLM-L6-v2")
