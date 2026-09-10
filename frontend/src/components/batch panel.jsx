import { useState } from "react";
import { api } from "../api";
import { Spinner, SkeletonLines } from "./Loading";
import { useToast } from "../context/ToastContext";
import CopyButton from "./CopyButton";
import ExportButtons from "./ExportButtons";
import EmptyState from "./EmptyState";

const SAMPLE = `This product exceeded my expectations.
Shipping was slow and the box arrived damaged.
Customer support was friendly and quick to respond.
The instructions were confusing and hard to follow.`;

export default function BatchPanel() {
  const [text, setText] = useState(SAMPLE);
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  async function run() {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        lines.map(async (line) => {
          const res = await api.sentiment(line);
          return { line, label: res.label, score: res.score };
        })
      );
      setRows(results);
      addToast(`Analyzed ${results.length} lines`, "success");
    } catch (e) {
      setError(e.message);
      addToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const csvRows = rows
    ? [["line", "label", "score"], ...rows.map((r) => [r.line, r.label, r.score])]
    : null;

  const copyText = rows
    ? rows.map((r) => `${r.line} → ${r.label} (${(r.score * 100).toFixed(1)}%)`).join("\n")
    : "";

  return (
    <div>
      <h1 className="panel-title">Batch</h1>
      <p className="panel-sub">
        distilbert-sst2 · runs sentiment analysis on each line separately
      </p>

      <label className="field-label">ONE ITEM PER LINE</label>
      <textarea
        className="manuscript"
        style={{ minHeight: 140 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="run-btn" onClick={run} disabled={loading || !text.trim()}>
        {loading && <Spinner />}
        {loading ? "processing…" : "run batch"}
      </button>

      {error && <div className="error-note">{error}</div>}

      {loading && <SkeletonLines lines={5} />}

      {!rows && !loading && !error && (
        <EmptyState message="Paste one item per line, then run batch sentiment analysis across all of them." />
      )}

      {rows && !loading && (
        <div className="output">
          <div className="output-label-row">
            <div className="output-label">RESULTS ({rows.length})</div>
            <div style={{ display: "flex", gap: 8 }}>
              <CopyButton text={copyText} />
              <ExportButtons
                jsonData={rows}
                csvRows={csvRows}
                filenameBase="batch-sentiment"
              />
            </div>
          </div>
          <table className="batch-table">
            <thead>
              <tr>
                <th>Line</th>
                <th>Label</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.line}</td>
                  <td>
                    <span
                      className={`sentiment-badge ${
                        r.label.toLowerCase() === "positive" ? "positive" : "negative"
                      }`}
                    >
                      {r.label}
                    </span>
                  </td>
                  <td>{(r.score * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}