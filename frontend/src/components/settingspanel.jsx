import { useState } from "react";
import { getBaseUrl, setBaseUrl } from "../api";
import { useToast } from "../context/ToastContext";

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(getBaseUrl());
  const { addToast } = useToast();

  function save() {
    setBaseUrl(url);
    setUrl(getBaseUrl());
    addToast("API base URL updated", "success");
    setOpen(false);
  }

  return (
    <div className="settings-block">
      <button className="theme-toggle" onClick={() => setOpen(!open)} type="button">
        ⚙ settings
      </button>
      {open && (
        <div className="settings-popover">
          <label className="field-label">API BASE URL</label>
          <input
            className="manuscript"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="run-btn"
            style={{ marginTop: 8, width: "100%", justifyContent: "center" }}
            onClick={save}
            type="button"
          >
            save
          </button>
        </div>
      )}
    </div>
  );
}