export function fmtAgo(ts) {
  if (!ts) return "never";
  const seconds = Math.round((Date.now() - ts) / 1000);
  if (seconds < 2) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s ago`;
}

export function formatCountdown(seconds) {
  if (seconds == null) return "-";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
