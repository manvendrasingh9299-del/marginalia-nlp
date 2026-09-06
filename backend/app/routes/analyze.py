from fastapi import APIRouter, HTTPException

from app.models import (
    TextRequest,
    SummarizeRequest,
    SimilarityRequest,
    SentimentResult,
    EntityResult,
    KeywordResult,
    SimilarityResult,
)
from app.nlp_models import (
    get_sentiment_pipeline,
    get_summarizer_pipeline,
    get_ner_model,
    get_keyword_extractor,
    get_embedding_model,
)

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("/sentiment", response_model=SentimentResult)
def analyze_sentiment(payload: TextRequest):
    pipe = get_sentiment_pipeline()
    result = pipe(payload.text[:2000])[0]
    return SentimentResult(label=result["label"], score=round(result["score"], 4))


@router.post("/summarize")
def summarize_text(payload: SummarizeRequest):
    if len(payload.text.split()) < 15:
        raise HTTPException(
            status_code=400,
            detail="Text is too short to summarize meaningfully (need 15+ words).",
        )
    pipe = get_summarizer_pipeline()
    result = pipe(
        payload.text,
        max_length=payload.max_length,
        min_length=payload.min_length,
        do_sample=False,
    )[0]
    return {"summary": result["summary_text"]}


@router.post("/entities", response_model=list[EntityResult])
def extract_entities(payload: TextRequest):
    nlp = get_ner_model()
    doc = nlp(payload.text[:5000])
    return [
        EntityResult(text=ent.text, label=ent.label_, start=ent.start_char, end=ent.end_char)
        for ent in doc.ents
    ]


@router.post("/keywords", response_model=list[KeywordResult])
def extract_keywords(payload: TextRequest):
    extractor = get_keyword_extractor()
    # yake scores are "distance" — lower is more relevant, so we invert for the UI
    raw = extractor.extract_keywords(payload.text)
    return [
        KeywordResult(keyword=kw, score=round(1 / (1 + score), 4))
        for kw, score in raw
    ]


@router.post("/similarity", response_model=list[SimilarityResult])
def semantic_similarity(payload: SimilarityRequest):
    from sentence_transformers import util

    model = get_embedding_model()
    query_emb = model.encode(payload.query, convert_to_tensor=True)
    cand_embs = model.encode(payload.candidates, convert_to_tensor=True)
    scores = util.cos_sim(query_emb, cand_embs)[0]

    results = [
        SimilarityResult(candidate=cand, score=round(float(score), 4))
        for cand, score in zip(payload.candidates, scores)
    ]
    return sorted(results, key=lambda r: r.score, reverse=True)
