import { useEffect, useState } from "react";
import SentimentPanel from "./components/SentimentPanel";
import SummarizePanel from "./components/SummarizePanel";
import EntitiesPanel from "./components/EntitiesPanel";
import KeywordsPanel from "./components/KeywordsPanel";
import SimilarityPanel from "./components/SimilarityPanel";
import BatchPanel from "./components/BatchPanel";
import ToastContainer from "./components/ToastContainer";
import SettingsPanel from "./components/SettingsPanel";

const TABS = [
  { id: "sentiment", label: "Sentiment", component: SentimentPanel },
  { id: "summarize", label: "Summarize", component: SummarizePanel },
  { id: "entities", label: "Entities", component: EntitiesPanel },
  { id: "keywords", label: "Keywords", component: KeywordsPanel },
  { id: "similarity", label: "Similarity", component: SimilarityPanel },
  { id: "batch", label: "Batch", component: BatchPanel },
];

export default function App() {
  const [active, setActive] = useState("sentiment");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const ActivePanel = TABS.find((t) => t.id === active).component;

  function selectTab(id) {
    setActive(id);
    setMobileNavOpen(false);
  }

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <div className="app-shell">
      <ToastContainer />

      <div className="mobile-topbar">
        <button
          className="hamburger-btn"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
        <div className="wordmark" style={{ fontSize: 18 }}>
          Marginalia
        </div>
        <button
          className="hamburger-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? "☾" : "☀"}
        </button>
      </div>

      {mobileNavOpen && (
        <div
          className="sidebar-backdrop show"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileNavOpen ? "mobile-open" : ""}`}>
        <div className="wordmark">
          Marginalia
          <small>NLP TOOLKIT · LOCAL MODELS</small>
        </div>

        <nav className="tab-list">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              className={`tab-item ${active === tab.id ? "active" : ""}`}
              onClick={() => selectTab(tab.id)}
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "☾ dark mode" : "☀ light mode"}
          </button>
          <SettingsPanel />
          <div style={{ marginTop: 10 }}>
            No API key required
          </div>
        </div>
      </aside>

      <main className="main">
        <div key={active} className="panel-transition">
          <ActivePanel />
        </div>
      </main>
    </div>
  );
}