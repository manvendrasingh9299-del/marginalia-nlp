import { downloadJSON, downloadCSV } from "../utils/export";

export default function ExportButtons({ jsonData, csvRows, filenameBase }) {
  return (
    <div className="export-buttons">
      <button
        className="copy-btn"
        onClick={() => downloadJSON(`${filenameBase}.json`, jsonData)}
        type="button"
      >
        export json
      </button>
      {csvRows && (
        <button
          className="copy-btn"
          onClick={() => downloadCSV(`${filenameBase}.csv`, csvRows)}
          type="button"
        >
          export csv
        </button>
      )}
    </div>
  );
}