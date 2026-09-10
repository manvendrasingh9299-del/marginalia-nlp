import { useState } from "react";

export default function useHistory(maxItems = 10) {
  const [history, setHistory] = useState([]);

  function addEntry(entry) {
    setHistory((prev) =>
      [
        { ...entry, id: `${Date.now()}-${Math.random()}`, timestamp: new Date().toLocaleTimeString() },
        ...prev,
      ].slice(0, maxItems)
    );
  }

  function clearHistory() {
    setHistory([]);
  }

  return { history, addEntry, clearHistory };
}