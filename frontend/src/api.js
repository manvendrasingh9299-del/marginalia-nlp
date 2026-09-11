const STORAGE_KEY = "nlp-toolkit-api-base-url";
const DEFAULT_BASE_URL = "http://localhost:8000";

function loadBaseUrl() {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_BASE_URL;
  } catch {
    return DEFAULT_BASE_URL;
  }
}

let BASE_URL = loadBaseUrl();

export function getBaseUrl() {
  return BASE_URL;
}

export function setBaseUrl(url) {
  BASE_URL = url.trim().replace(/\/+$/, "") || DEFAULT_BASE_URL;
  try {
    localStorage.setItem(STORAGE_KEY, BASE_URL);
  } catch {
    // localStorage unavailable — setting still applies for this session
  }
}

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