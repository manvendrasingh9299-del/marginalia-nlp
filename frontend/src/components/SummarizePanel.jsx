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

const SAMPLE = `The James Webb Space Telescope has revolutionized our view of the early universe. Since becoming operational, it has captured images of galaxies formed within a few hundred million years of the Big Bang, far earlier than astronomers expected to find well-structured galaxies. Its infrared instruments allow it to peer through cosmic dust that blocked earlier telescopes, revealing star-forming regions in unprecedented detail. Researchers are now revising models of galaxy formation to account for these surprisingly mature early structures. The telescope is also analyzing the atmospheres of exoplanets, searching for chemical signatures that could indicate habitability.`;

export default function SummarizePanel() {
  const [text, setText] = useState(SAMPLE);
  const [maxLen, setMaxLen] = useState(80);
  const [minLen, setMinLen] = useState(25);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { history, addEntry, clearHistory } = useHistory();

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.summarize(text, Number(maxLen), Number(minLen));
      setResult(res);
      addEntry({ text, result: res });
      addToast("Summary generated", "success");
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
      <h1 className="panel-title">Summarize</h1>
      <p className="panel-sub">distilbart-cnn · abstractive summary of longer passages</p>

      <label className="field-label">TEXT (15+ words)</label>
      <DropTextarea
        className="manuscript"
        value={text}
        onChange={setText}
        onKeyDown={handleKeyDown}
      />
      <WordCounter text={text} minWords={15} />

      <div className="row">
        <div className="num-field">
          <label className="field-label">MIN LENGTH</label>
          <input
            className="manuscript"
            type="number"
            value={minLen}
            onChange={(e) => setMinLen(e.target.value)}
          />
        </div>
        <div className="num-field">
          <label className="field-label">MAX LENGTH</label>
          <input
            className="manuscript"
            type="number"
            value={maxLen}
            onChange={(e) => setMaxLen(e.target.value)}
          />
        </div>
      </div>

      <button className="run-btn" onClick={run} disabled={loading || !text.trim()}>
        {loading && <Spinner />}
        {loading ? "summarizing…" : "run analysis"}
      </button>
      <span className="shortcut-hint">⌘/Ctrl + Enter to run</span>

      {error && <div className="error-note">{error}</div>}

      {loading && <SkeletonLines lines={3} />}

      {!result && !loading && !error && (
        <EmptyState message="Run analysis to see a generated summary here." />
      )}

      {result && !loading && (
        <div className="output">
          <div className="output-label-row">
            <div className="output-label">SUMMARY</div>
            <div style={{ display: "flex", gap: 8 }}>
              <CopyButton text={result.summary} />
              <ExportButtons
                jsonData={result}
                csvRows={[["summary"], [result.summary]]}
                filenameBase="summary-result"
              />
            </div>
          </div>
          <p className="summary-text">{result.summary}</p>
        </div>
      )}

      <HistoryList
        history={history}
        onRerun={handleRerun}
        onClear={clearHistory}
        renderSummary={(entry) =>
          `${entry.text.slice(0, 30)}… → ${entry.result.summary.slice(0, 40)}…`
        }
      />
    </div>
  );
}