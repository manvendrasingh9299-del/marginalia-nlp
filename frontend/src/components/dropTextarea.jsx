export default function DropTextarea({ value, onChange, onKeyDown, className }) {
  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".txt")) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsText(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="drop-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
      <textarea
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="drop-hint">drop a .txt file here to load text</div>
    </div>
  );
}