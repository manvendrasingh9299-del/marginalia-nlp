import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analyze import router as analyze_router

load_dotenv()

DEFAULT_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
FRONTEND_ORIGINS = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", DEFAULT_ORIGINS).split(",")
    if origin.strip()
]

app = FastAPI(
    title="NLP Toolkit API",
    description="Local, free NLP analysis: sentiment, summarization, NER, keywords, semantic similarity.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "nlp-toolkit-api"}