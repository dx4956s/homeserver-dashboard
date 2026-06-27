import { formatCountdown } from "../time.js";

export function DashboardHeader({ now, scanning, nextScanIn, onScan, summary }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Home Services Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          {summary.up} up · {summary.down} down · {summary.pending} pending · {summary.total} total
          <span className="mx-2 text-slate-600">|</span>
          <span className="font-mono">*.home.dx4956s.dev</span>
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-mono text-slate-400">
          {new Date(now).toLocaleTimeString()}
        </span>
        {scanning ? (
          <span className="rounded-lg bg-amber-600/20 px-3 py-1.5 text-xs font-medium text-amber-300">
            scanning...
          </span>
        ) : (
          <span className="rounded-lg bg-slate-800 px-3 py-1.5 font-mono text-xs text-slate-300">
            next: {formatCountdown(nextScanIn)}
          </span>
        )}
        <button
          type="button"
          onClick={onScan}
          disabled={scanning}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium hover:bg-sky-500 disabled:opacity-50"
        >
          Re-check now
        </button>
      </div>
    </header>
  );
}
