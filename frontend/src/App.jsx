import { useState } from "react";
import SentimentPanel from "./components/SentimentPanel";
import SummarizePanel from "./components/SummarizePanel";
import EntitiesPanel from "./components/EntitiesPanel";
import KeywordsPanel from "./components/KeywordsPanel";
import SimilarityPanel from "./components/SimilarityPanel";
import ToastContainer from "./components/ToastContainer";

const TABS = [
  { id: "sentiment", label: "Sentiment", component: SentimentPanel },
  { id: "summarize", label: "Summarize", component: SummarizePanel },
  { id: "entities", label: "Entities", component: EntitiesPanel },
  { id: "keywords", label: "Keywords", component: KeywordsPanel },
  { id: "similarity", label: "Similarity", component: SimilarityPanel },
];

export default function App() {
  const [active, setActive] = useState("sentiment");
  const ActivePanel = TABS.find((t) => t.id === active).component;

  return (
    <div className="app-shell">
      <ToastContainer />
      <aside className="sidebar">
        <div className="wordmark">
          Marginalia
          <small>NLP TOOLKIT · LOCAL MODELS</small>
        </div>

        <nav className="tab-list">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              className={`tab-item ${active === tab.id ? "active" : ""}`}
              onClick={() => setActive(tab.id)}
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          FastAPI backend on :8000
          <br />
          No API key required
        </div>
      </aside>

      <main className="main">
        <ActivePanel />
      </main>
    </div>
  );
}