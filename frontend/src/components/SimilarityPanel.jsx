import { useState } from "react";
import { api } from "../api";

export default function SimilarityPanel() {
  const [query, setQuery] = useState("a fast way to cook rice");
  const [candidates, setCandidates] = useState([
    "How to prepare rice quickly using a pressure cooker",
    "The history of the Roman Empire's expansion",
    "Steaming vegetables to retain nutrients",
    "Best practices for watering houseplants",
  ]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function updateCandidate(i, value) {
    const next = [...candidates];
    next[i] = value;
    setCandidates(next);
  }

  function removeCandidate(i) {
    setCandidates(candidates.filter((_, idx) => idx !== i));
  }

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const cleaned = candidates.map((c) => c.trim()).filter(Boolean);
      const res = await api.similarity(query, cleaned);
      setResults(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="panel-title">Similarity</h1>
      <p className="panel-sub">all-MiniLM-L6-v2 · ranks candidates by semantic closeness to the query</p>

      <label className="field-label">QUERY</label>
      <input
        className="manuscript"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <label className="field-label" style={{ marginTop: 18 }}>
        CANDIDATES
      </label>
      {candidates.map((c, i) => (
        <div className="candidate-input-row" key={i}>
          <input
            className="manuscript"
            value={c}
            onChange={(e) => updateCandidate(i, e.target.value)}
          />
          <button className="remove-btn" onClick={() => removeCandidate(i)}>
            ×
          </button>
        </div>
      ))}
      <button
        className="add-candidate"
        onClick={() => setCandidates([...candidates, ""])}
      >
        + add candidate
      </button>

      <div>
        <button
          className="run-btn"
          onClick={run}
          disabled={loading || !query.trim() || candidates.filter(Boolean).length === 0}
        >
          {loading ? "comparing…" : "run analysis"}
        </button>
      </div>

      {error && <div className="error-note">{error}</div>}

      {results && (
        <div className="output">
          <div className="output-label">RANKED BY SIMILARITY</div>
          {results.map((r, i) => (
            <div className="sim-result-row" key={i}>
              <span className="sim-rank">{i + 1}</span>
              <span className="sim-text">{r.candidate}</span>
              <span className="sim-score">{r.score.toFixed(3)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
