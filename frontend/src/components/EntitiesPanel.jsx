import { useState } from "react";
import { api } from "../api";

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

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.entities(text);
      setEntities(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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

  return (
    <div>
      <h1 className="panel-title">Entities</h1>
      <p className="panel-sub">spaCy en_core_web_sm · named entity recognition</p>

      <label className="field-label">TEXT</label>
      <textarea
        className="manuscript"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setEntities(null);
        }}
      />

      <button className="run-btn" onClick={run} disabled={loading || !text.trim()}>
        {loading ? "tagging…" : "run analysis"}
      </button>

      {error && <div className="error-note">{error}</div>}

      {entities && (
        <div className="output">
          <div className="output-label">
            TAGGED TEXT ({entities.length} entities)
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
    </div>
  );
}
