export default function WordCounter({ text, minWords }) {
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const belowMin = minWords ? words < minWords : false;

  return (
    <div className={`word-counter ${belowMin ? "word-counter-warn" : ""}`}>
      {words} word{words === 1 ? "" : "s"} · {chars} char{chars === 1 ? "" : "s"}
      {minWords ? ` · min ${minWords} words` : ""}
    </div>
  );
}