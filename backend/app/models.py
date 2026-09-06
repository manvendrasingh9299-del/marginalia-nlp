from pydantic import BaseModel, Field
from typing import List


class TextRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Input text to analyze")


class SummarizeRequest(TextRequest):
    max_length: int = Field(120, ge=20, le=500)
    min_length: int = Field(30, ge=5, le=200)


class SimilarityRequest(BaseModel):
    query: str = Field(..., min_length=1)
    candidates: List[str] = Field(..., min_items=1)


class SentimentResult(BaseModel):
    label: str
    score: float


class EntityResult(BaseModel):
    text: str
    label: str
    start: int
    end: int


class KeywordResult(BaseModel):
    keyword: str
    score: float


class SimilarityResult(BaseModel):
    candidate: str
    score: float
