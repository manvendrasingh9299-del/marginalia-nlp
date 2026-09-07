export function Spinner({ size = 14 }) {
  return (
    <svg
      className="spinner"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="42 14"
      />
    </svg>
  );
}

export function SkeletonLines({ lines = 3 }) {
  return (
    <div className="skeleton-block">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonBar() {
  return (
    <div className="skeleton-block">
      <div className="skeleton-bar" />
    </div>
  );
}
