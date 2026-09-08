import { useState } from "react";
import { api } from "../api";
import { Spinner, SkeletonBar } from "./Loading";
import { useToast } from "../context/ToastContext";

export default function SentimentPanel() {
  const [text, setText] = useState(
    "The new interface is a huge improvement — fast, clear, and a pleasure to use."
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.sentiment(text);
      setResult(res);
      addToast("Sentiment analysis complete", "success");
    } catch (e) {
      setError(e.message);
      addToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="panel-title">Sentiment</h1>
      <p className="panel-sub">distilbert-sst2 · classifies polarity and confidence</p>

      <label className="field-label">TEXT</label>
      <textarea
        className="manuscript"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="run-btn" onClick={run} disabled={loading || !text.trim()}>
        {loading && <Spinner />}
        {loading ? "analyzing…" : "run analysis"}
      </button>

      {error && <div className="error-note">{error}</div>}

      {loading && <SkeletonBar />}

      {result && !loading && (
        <div className="output">
          <div className="output-label">RESULT</div>
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
    </div>
  );
}