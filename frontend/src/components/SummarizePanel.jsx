import { useState } from "react";
import { api } from "../api";
import { Spinner, SkeletonLines } from "./Loading";
import { useToast } from "../context/ToastContext";

const SAMPLE = `The James Webb Space Telescope has revolutionized our view of the early universe. Since becoming operational, it has captured images of galaxies formed within a few hundred million years of the Big Bang, far earlier than astronomers expected to find well-structured galaxies. Its infrared instruments allow it to peer through cosmic dust that blocked earlier telescopes, revealing star-forming regions in unprecedented detail. Researchers are now revising models of galaxy formation to account for these surprisingly mature early structures. The telescope is also analyzing the atmospheres of exoplanets, searching for chemical signatures that could indicate habitability.`;

export default function SummarizePanel() {
  const [text, setText] = useState(SAMPLE);
  const [maxLen, setMaxLen] = useState(80);
  const [minLen, setMinLen] = useState(25);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.summarize(text, Number(maxLen), Number(minLen));
      setResult(res);
      addToast("Summary generated", "success");
    } catch (e) {
      setError(e.message);
      addToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="panel-title">Summarize</h1>
      <p className="panel-sub">distilbart-cnn · abstractive summary of longer passages</p>

      <label className="field-label">TEXT (15+ words)</label>
      <textarea
        className="manuscript"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

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

      {error && <div className="error-note">{error}</div>}

      {loading && <SkeletonLines lines={3} />}

      {result && !loading && (
        <div className="output">
          <div className="output-label">SUMMARY</div>
          <p className="summary-text">{result.summary}</p>
        </div>
      )}
    </div>
  );
}