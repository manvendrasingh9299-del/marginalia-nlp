import { useState } from "react";
import { api } from "../api";
import { Spinner, SkeletonLines } from "./Loading";
import { useToast } from "../context/ToastContext";
import CopyButton from "./CopyButton";
import EmptyState from "./EmptyState";
import HistoryList from "./HistoryList";
import ExportButtons from "./ExportButtons";
import useHistory from "../hooks/useHistory";

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
  const { addToast } = useToast();
  const { history, addEntry, clearHistory } = useHistory();

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
      addEntry({ query, candidates: cleaned, result: res });
      addToast("Ranked by similarity", "success");
    } catch (e) {
      setError(e.message);
      addToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!loading && query.trim() && candidates.filter(Boolean).length > 0) run();
    }
  }

  function handleRerun(entry) {
    setQuery(entry.query);
    setCandidates(entry.candidates);
    setResults(entry.result);
  }

  const resultsAsText = results
    ? results.map((r, i) => `${i + 1}. ${r.candidate} (${r.score.toFixed(3)})`).join("\n")
    : "";

  const csvRows = results
    ? [["rank", "candidate", "score"], ...results.map((r, i) => [i + 1, r.candidate, r.score])]
    : null;

  return (
    <div>
      <h1 className="panel-title">Similarity</h1>
      <p className="panel-sub">all-MiniLM-L6-v2 · ranks candidates by semantic closeness to the query</p>

      <label className="field-label">QUERY</label>
      <input
        className="manuscript"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
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
            onKeyDown={handleKeyDown}
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
          {loading && <Spinner />}
          {loading ? "comparing…" : "run analysis"}
        </button>
        <span className="shortcut-hint">⌘/Ctrl + Enter to run</span>
      </div>

      {error && <div className="error-note">{error}</div>}

      {loading && <SkeletonLines lines={4} />}

      {!results && !loading && !error && (
        <EmptyState message="Run analysis to see candidates ranked by similarity here." />
      )}

      {results && !loading && (
        <div className="output">
          <div className="output-label-row">
            <div className="output-label">RANKED BY SIMILARITY</div>
            <div style={{ display: "flex", gap: 8 }}>
              <CopyButton text={resultsAsText} />
              <ExportButtons
                jsonData={results}
                csvRows={csvRows}
                filenameBase="similarity-result"
              />
            </div>
          </div>
          {results.map((r, i) => (
            <div className="sim-result-row" key={i}>
              <span className="sim-rank">{i + 1}</span>
              <span className="sim-text">{r.candidate}</span>
              <span className="sim-score">{r.score.toFixed(3)}</span>
            </div>
          ))}
        </div>
      )}

      <HistoryList
        history={history}
        onRerun={handleRerun}
        onClear={clearHistory}
        renderSummary={(entry) => `${entry.query.slice(0, 40)}… → top: ${entry.result[0]?.candidate.slice(0, 30)}…`}
      />
    </div>
  );
}