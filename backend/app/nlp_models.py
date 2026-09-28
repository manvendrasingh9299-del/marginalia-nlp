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
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

    model_name = "sshleifer/distilbart-cnn-12-6"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    def _summarize(text, max_length=120, min_length=30, do_sample=False):
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=1024)
        summary_ids = model.generate(
            inputs["input_ids"],
            max_length=max_length,
            min_length=min_length,
            do_sample=do_sample,
        )
        summary_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return [{"summary_text": summary_text}]

    return _summarize


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