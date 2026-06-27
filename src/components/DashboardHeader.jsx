import { CYCLE_MS } from "../hooks/useServiceScanner.js";
import { formatCountdown } from "../time.js";

function StatusBadge({ label, value, colorClass }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className={`font-mono font-semibold ${colorClass}`}>{value}</span>
    </div>
  );
}

export function DashboardHeader({ now, scanning, nextScanIn, onScan, summary }) {
  return (
    <header className="panel rounded-xl p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Home Services Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Monitor and access self-hosted services on
            <span className="ml-1.5 rounded bg-[var(--bg-tertiary)] px-1.5 py-0.5 font-mono text-xs text-[var(--text-primary)]">
              *.home.dx4956s.dev
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label="Up" value={summary.up} colorClass="text-[var(--success)]" />
          <StatusBadge label="Down" value={summary.down} colorClass="text-[var(--danger)]" />
          <StatusBadge label="Pending" value={summary.pending} colorClass="text-[var(--warning)]" />
          <StatusBadge label="Total" value={summary.total} colorClass="text-[var(--text-primary)]" />

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <span className="hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-primary)] px-2.5 py-1.5 font-mono text-xs text-[var(--text-secondary)] sm:inline-block">
              {new Date(now).toLocaleTimeString()}
            </span>

            {scanning ? (
              <span className="inline-flex items-center gap-2 rounded-md border border-[var(--warning-bg)] bg-[var(--warning-bg)]/30 px-3 py-1.5 text-xs font-medium text-[var(--warning)]">
                <span className="status-dot status-dot-checking" />
                Scanning…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-1.5 font-mono text-xs text-[var(--text-secondary)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3.5 w-3.5 text-[var(--text-muted)]"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatCountdown(nextScanIn)}
              </span>
            )}

            <button
              type="button"
              onClick={onScan}
              disabled={scanning}
              className="rounded-md bg-[var(--primary)] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Re-check now
            </button>
          </div>
        </div>
      </div>

      <div className="scan-bar-track relative mt-5 h-1 w-full overflow-hidden rounded-full">
        {scanning ? (
          <div className="scan-bar-fill absolute left-0 top-0 h-full rounded-full" style={{ width: "100%" }} />
        ) : (
          <div
            className="scan-bar-fill h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.max(0, Math.min(100, ((CYCLE_MS / 1000 - (nextScanIn ?? 0)) / (CYCLE_MS / 1000)) * 100))}%` }}
          />
        )}
      </div>
    </header>
  );
}
