import { useState } from "react";
import { api } from "../api";
import { Spinner, SkeletonLines } from "./Loading";

const SAMPLE =
  "Climate change is driving more frequent extreme weather events, including heatwaves, droughts, and intense rainfall. Scientists warn that without significant reductions in greenhouse gas emissions, these patterns will worsen over the coming decades, threatening food security and freshwater supplies worldwide.";

export default function KeywordsPanel() {
  const [text, setText] = useState(SAMPLE);
  const [keywords, setKeywords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.keywords(text);
      setKeywords(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const maxScore = keywords ? Math.max(...keywords.map((k) => k.score)) : 1;

  return (
    <div>
      <h1 className="panel-title">Keywords</h1>
      <p className="panel-sub">YAKE · unsupervised keyword and key-phrase extraction</p>

      <label className="field-label">TEXT</label>
      <textarea
        className="manuscript"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="run-btn" onClick={run} disabled={loading || !text.trim()}>
        {loading && <Spinner />}
        {loading ? "extracting…" : "run analysis"}
      </button>

      {error && <div className="error-note">{error}</div>}

      {loading && <SkeletonLines lines={5} />}

      {keywords && !loading && (
        <div className="output">
          <div className="output-label">TOP PHRASES</div>
          <div className="keyword-list">
            {keywords.map((k, i) => (
              <div className="keyword-row" key={i}>
                <span className="keyword-name">{k.keyword}</span>
                <div className="keyword-bar-track">
                  <div
                    className="keyword-bar-fill"
                    style={{ width: `${(k.score / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
