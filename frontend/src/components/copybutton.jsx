import { useState } from "react";

export default function CopyButton({ text, label = "copy" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  }

  return (
    <button className="copy-btn" onClick={handleCopy} type="button">
      {copied ? "copied ✓" : label}
    </button>
  );
}