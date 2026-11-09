export default function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <div className="empty-state-mark">§</div>
      <p>{message}</p>
    </div>
  );
}