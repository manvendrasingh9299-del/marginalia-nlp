import { useState } from "react";
import { api } from "../api";
import { Spinner, SkeletonLines } from "./Loading";
import { useToast } from "../context/ToastContext";
import CopyButton from "./CopyButton";
import WordCounter from "./WordCounter";
import EmptyState from "./EmptyState";
import HistoryList from "./HistoryList";
import ExportButtons from "./ExportButtons";
import DropTextarea from "./DropTextarea";
import useHistory from "../hooks/useHistory";

const SAMPLE =
  "Marie Curie was born in Warsaw, Poland, and later moved to Paris where she conducted her research at the Sorbonne. In 1903, she and Pierre Curie won the Nobel Prize in Physics.";

const COLORS = {
  PERSON: "#e8dcc4",
  ORG: "#dbe4de",
  GPE: "#e3d9ec",
  LOC: "#e3d9ec",
  DATE: "#f0e2df",
  NORP: "#dbe9f2",
  CARDINAL: "#eeeeee",
  DEFAULT: "#ececec",
};

function colorFor(label) {
  return COLORS[label] || COLORS.DEFAULT;
}

export default function EntitiesPanel() {
  const [text, setText] = useState(SAMPLE);
  const [entities, setEntities] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { history, addEntry, clearHistory } = useHistory();

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.entities(text);
      setEntities(res);
      addEntry({ text, result: res });
      addToast(`Found ${res.length} entities`, "success");
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

  function handleChange(value) {
    setText(value);
    setEntities(null);
  }

  function handleRerun(entry) {
    setText(entry.text);
    setEntities(entry.result);
  }

  function renderHighlighted() {
    if (!entities || entities.length === 0) return text;
    const sorted = [...entities].sort((a, b) => a.start - b.start);
    const parts = [];
    let cursor = 0;
    sorted.forEach((ent, i) => {
      if (ent.start > cursor) parts.push(text.slice(cursor, ent.start));
      parts.push(
        <span
          key={i}
          className="ent-mark"
          style={{ background: colorFor(ent.label) }}
        >
          {ent.text}
          <span className="ent-tag">{ent.label}</span>
        </span>
      );
      cursor = ent.end;
    });
    if (cursor < text.length) parts.push(text.slice(cursor));
    return parts;
  }

  const uniqueLabels = entities
    ? [...new Set(entities.map((e) => e.label))]
    : [];

  const entitiesAsText = entities
    ? entities.map((e) => `${e.text} (${e.label})`).join(", ")
    : "";

  const csvRows = entities
    ? [["text", "label", "start", "end"], ...entities.map((e) => [e.text, e.label, e.start, e.end])]
    : null;

  return (
    <div>
      <h1 className="panel-title">Entities</h1>
      <p className="panel-sub">spaCy en_core_web_sm · named entity recognition</p>

      <label className="field-label">TEXT</label>
      <DropTextarea
        className="manuscript"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <WordCounter text={text} />

      <button className="run-btn" onClick={run} disabled={loading || !text.trim()}>
        {loading && <Spinner />}
        {loading ? "tagging…" : "run analysis"}
      </button>
      <span className="shortcut-hint">⌘/Ctrl + Enter to run</span>

      {error && <div className="error-note">{error}</div>}

      {loading && <SkeletonLines lines={4} />}

      {!entities && !loading && !error && (
        <EmptyState message="Run analysis to see named entities highlighted here." />
      )}

      {entities && !loading && (
        <div className="output">
          <div className="output-label-row">
            <div className="output-label">
              TAGGED TEXT ({entities.length} entities)
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <CopyButton text={entitiesAsText} />
              <ExportButtons
                jsonData={entities}
                csvRows={csvRows}
                filenameBase="entities-result"
              />
            </div>
          </div>
          <div className="entity-text">{renderHighlighted()}</div>

          <div className="entity-legend">
            {uniqueLabels.map((label) => (
              <span key={label}>
                <span
                  className="legend-dot"
                  style={{ background: colorFor(label) }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <HistoryList
        history={history}
        onRerun={handleRerun}
        onClear={clearHistory}
        renderSummary={(entry) =>
          `${entry.text.slice(0, 40)}… → ${entry.result.length} entities`
        }
      />
    </div>
  );
}