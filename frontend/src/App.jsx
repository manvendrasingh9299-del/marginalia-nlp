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
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const ActivePanel = TABS.find((t) => t.id === active).component;

  function selectTab(id) {
    setActive(id);
  }

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <div className="app-shell">
      <ToastContainer />

      <header className="topbar">
        <div className="topbar-row">
          <h1 className="app-title">Marginalia</h1>
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className="menu-icon" />
          </button>
        </div>

        {menuOpen && (
          <div className="menu-popover">
            <button className="theme-toggle" onClick={toggleTheme} type="button">
              {theme === "light" ? "☾ dark mode" : "☀ light mode"}
            </button>
            <SettingsPanel />
            <div className="menu-footnote">No API key required</div>
          </div>
        )}

        <nav className="tab-row" role="tablist" aria-label="Analysis type">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-pill ${active === tab.id ? "active" : ""}`}
              onClick={() => selectTab(tab.id)}
              role="tab"
              aria-selected={active === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        <div key={active} className="panel-transition">
          <ActivePanel />
        </div>
      </main>
    </div>
  );
}