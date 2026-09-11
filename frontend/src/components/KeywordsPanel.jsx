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
  "Climate change is driving more frequent extreme weather events, including heatwaves, droughts, and intense rainfall. Scientists warn that without significant reductions in greenhouse gas emissions, these patterns will worsen over the coming decades, threatening food security and freshwater supplies worldwide.";

export default function KeywordsPanel() {
  const [text, setText] = useState(SAMPLE);
  const [keywords, setKeywords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { history, addEntry, clearHistory } = useHistory();

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.keywords(text);
      setKeywords(res);
      addEntry({ text, result: res });
      addToast(`Extracted ${res.length} keywords`, "success");
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
    setKeywords(entry.result);
  }

  const maxScore = keywords ? Math.max(...keywords.map((k) => k.score)) : 1;
  const keywordsAsText = keywords ? keywords.map((k) => k.keyword).join(", ") : "";
  const csvRows = keywords
    ? [["keyword", "score"], ...keywords.map((k) => [k.keyword, k.score])]
    : null;

  return (
    <div>
      <h1 className="panel-title">Keywords</h1>
      <p className="panel-sub">YAKE · unsupervised keyword and key-phrase extraction</p>

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
        {loading ? "extracting…" : "run analysis"}
      </button>
      <span className="shortcut-hint">⌘/Ctrl + Enter to run</span>

      {error && <div className="error-note">{error}</div>}

      {loading && <SkeletonLines lines={5} />}

      {!keywords && !loading && !error && (
        <EmptyState message="Run analysis to see extracted keywords here." />
      )}

      {keywords && !loading && (
        <div className="output">
          <div className="output-label-row">
            <div className="output-label">TOP PHRASES</div>
            <div style={{ display: "flex", gap: 8 }}>
              <CopyButton text={keywordsAsText} />
              <ExportButtons
                jsonData={keywords}
                csvRows={csvRows}
                filenameBase="keywords-result"
              />
            </div>
          </div>
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

      <HistoryList
        history={history}
        onRerun={handleRerun}
        onClear={clearHistory}
        renderSummary={(entry) =>
          `${entry.text.slice(0, 40)}… → ${entry.result.length} keywords`
        }
      />
    </div>
  );
}