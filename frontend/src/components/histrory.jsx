import { useState } from "react";

export default function HistoryList({ history, onRerun, onClear, renderSummary }) {
  const [open, setOpen] = useState(false);

  if (!history || history.length === 0) return null;

  return (
    <div className="history-block">
      <button className="history-toggle" onClick={() => setOpen(!open)} type="button">
        {open ? "▾" : "▸"} history ({history.length})
      </button>

      {open && (
        <div className="history-list">
          {history.map((entry) => (
            <div className="history-row" key={entry.id}>
              <span className="history-time">{entry.timestamp}</span>
              <span className="history-summary">{renderSummary(entry)}</span>
              <button
                className="history-rerun"
                onClick={() => onRerun(entry)}
                type="button"
              >
                rerun
              </button>
            </div>
          ))}
          <button className="history-clear" onClick={onClear} type="button">
            clear history
          </button>
        </div>
      )}
    </div>
  );
}