import { probeStateFromResult, probeStatusTitle, summarizeProbe } from "../health.js";
import { fmtAgo } from "../time.js";
import { StatusDot } from "./StatusDot.jsx";

export function ProbeLine({ label, status }) {
  const kind = probeStateFromResult(status);

  return (
    <div className="rounded-lg bg-slate-950/60 px-3 py-2" title={probeStatusTitle(status)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <StatusDot kind={kind} />
          <span className="shrink-0 text-xs font-medium text-slate-200">{label}</span>
        </div>
        {status?.httpCode ? (
          <span className={`font-mono text-[11px] ${status.ok ? "text-slate-400" : "text-rose-300"}`}>
            {status.httpCode}
          </span>
        ) : null}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-500">
        <span className="truncate">{summarizeProbe(status)}</span>
        {status?.updatedAt ? <span className="shrink-0">{fmtAgo(status.updatedAt)}</span> : null}
      </div>
    </div>
  );
}
