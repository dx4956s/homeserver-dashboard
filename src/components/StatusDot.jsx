export function StatusDot({ kind }) {
  const className =
    kind === "online"
      ? "status-dot status-dot-online"
      : kind === "checking"
        ? "status-dot status-dot-checking"
        : "status-dot status-dot-offline";

  return <span className={className} />;
}
