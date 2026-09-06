const BASE_URL = "http://localhost:8000";

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  sentiment: (text) => post("/analyze/sentiment", { text }),
  summarize: (text, max_length, min_length) =>
    post("/analyze/summarize", { text, max_length, min_length }),
  entities: (text) => post("/analyze/entities", { text }),
  keywords: (text) => post("/analyze/keywords", { text }),
  similarity: (query, candidates) =>
    post("/analyze/similarity", { query, candidates }),
};
