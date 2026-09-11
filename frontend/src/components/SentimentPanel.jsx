import { useState } from "react";
import { api } from "../api";
import { Spinner, SkeletonBar } from "./Loading";
import { useToast } from "../context/ToastContext";
import CopyButton from "./CopyButton";
import WordCounter from "./WordCounter";
import EmptyState from "./EmptyState";
import HistoryList from "./HistoryList";
import ExportButtons from "./ExportButtons";
import DropTextarea from "./DropTextarea";
import useHistory from "../hooks/useHistory";

export default function SentimentPanel() {
  const [text, setText] = useState(
    "The new interface is a huge improvement — fast, clear, and a pleasure to use."
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { history, addEntry, clearHistory } = useHistory();

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.sentiment(text);
      setResult(res);
      addEntry({ text, result: res });
      addToast("Sentiment analysis complete", "success");
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
      if (!loading && text.trim()) run();
    }
  }

  function handleRerun(entry) {
    setText(entry.text);
    setResult(entry.result);
  }

  return (
    <div>
      <h1 className="panel-title">Sentiment</h1>
      <p className="panel-sub">distilbert-sst2 · classifies polarity and confidence</p>

      <label className="field-label">TEXT</label>
      <DropTextarea
        className="manuscript"
        value={text}
        onChange={setText}
        onKeyDown={handleKeyDown}
      />
      <WordCounter text={text} />

      <button className="run-btn" onClick={run} disabled={loading || !text.trim()}>
        {loading && <Spinner />}
        {loading ? "analyzing…" : "run analysis"}
      </button>
      <span className="shortcut-hint">⌘/Ctrl + Enter to run</span>

      {error && <div className="error-note">{error}</div>}

      {loading && <SkeletonBar />}

      {!result && !loading && !error && (
        <EmptyState message="Run analysis to see the sentiment and confidence score here." />
      )}

      {result && !loading && (
        <div className="output">
          <div className="output-label-row">
            <div className="output-label">RESULT</div>
            <div style={{ display: "flex", gap: 8 }}>
              <CopyButton text={`${result.label} (${(result.score * 100).toFixed(1)}%)`} />
              <ExportButtons
                jsonData={result}
                csvRows={[["label", "score"], [result.label, result.score]]}
                filenameBase="sentiment-result"
              />
            </div>
          </div>
          <div className="sentiment-card">
            <span
              className={`sentiment-badge ${
                result.label.toLowerCase() === "positive" ? "positive" : "negative"
              }`}
            >
              {result.label}
            </span>
            <div className="sentiment-bar-track">
              <div
                className="sentiment-bar-fill"
                style={{ width: `${result.score * 100}%` }}
              />
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
              {(result.score * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      <HistoryList
        history={history}
        onRerun={handleRerun}
        onClear={clearHistory}
        renderSummary={(entry) =>
          `${entry.text.slice(0, 40)}${entry.text.length > 40 ? "…" : ""} → ${entry.result.label}`
        }
      />
    </div>
  );
}