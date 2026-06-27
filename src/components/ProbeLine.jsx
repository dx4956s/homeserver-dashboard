import { probeStateFromResult, probeStatusTitle, summarizeProbe } from "../health.js";
import { fmtAgo } from "../time.js";
import { StatusDot } from "./StatusDot.jsx";

export function ProbeLine({ label, status }) {
  const kind = probeStateFromResult(status);

  return (
    <div
      className="panel-inset rounded-lg px-3.5 py-2.5"
      title={probeStatusTitle(status)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <StatusDot kind={kind} />
          <span className="shrink-0 text-xs font-medium text-[var(--text-primary)]">{label}</span>
        </div>
        {status?.httpCode ? (
          <span
            className={`rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[11px] ${
              status.ok ? "text-[var(--text-secondary)]" : "text-[var(--danger)]"
            }`}
          >
            HTTP {status.httpCode}
          </span>
        ) : null}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
        <span className="truncate">{summarizeProbe(status)}</span>
        {status?.updatedAt ? <span className="shrink-0">{fmtAgo(status.updatedAt)}</span> : null}
      </div>
    </div>
  );
}
