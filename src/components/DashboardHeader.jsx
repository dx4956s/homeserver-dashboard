import { CYCLE_MS } from "../hooks/useServiceScanner.js";
import { formatCountdown } from "../time.js";

function StatusBadge({ label, value, colorClass }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)]/80 px-3 py-2 text-xs backdrop-blur-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className={`font-mono font-semibold ${colorClass}`}>{value}</span>
    </div>
  );
}

export function DashboardHeader({ now, scanning, nextScanIn, onScan, summary }) {
  return (
    <header className="panel rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white" aria-hidden="true">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                Home Services
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Monitor self-hosted services on
                <span className="ml-1.5 rounded-md bg-[var(--bg-tertiary)] px-2 py-0.5 font-mono text-xs text-[var(--text-primary)]">
                  *.home.dx4956s.dev
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label="Up" value={summary.up} colorClass="text-[var(--success)]" />
          <StatusBadge label="Down" value={summary.down} colorClass="text-[var(--danger)]" />
          <StatusBadge label="Pending" value={summary.pending} colorClass="text-[var(--warning)]" />
          <StatusBadge label="Total" value={summary.total} colorClass="text-[var(--text-primary)]" />

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <span className="hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 py-2 font-mono text-xs text-[var(--text-secondary)] sm:inline-block">
              {new Date(now).toLocaleTimeString()}
            </span>

            {scanning ? (
              <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--warning-border)] bg-[var(--warning-bg)] px-3 py-2 text-xs font-medium text-[var(--warning)]">
                <span className="status-dot status-dot-checking" />
                Scanning…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 py-2 font-mono text-xs text-[var(--text-secondary)]">
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
              className="rounded-lg bg-gradient-to-r from-[var(--primary)] to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:from-[var(--primary-hover)] hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Re-check now
            </button>
          </div>
        </div>
      </div>

      <div className="scan-bar-track relative mt-6 h-1.5 w-full overflow-hidden rounded-full">
        {scanning ? (
          <div className="absolute left-0 top-0 h-full animate-pulse rounded-full bg-gradient-to-r from-[var(--primary)] via-indigo-400 to-[var(--primary-hover)]" style={{ width: "100%" }} />
        ) : (
          <div
            className="scan-bar-fill h-full rounded-full"
            style={{ width: `${Math.max(0, Math.min(100, ((CYCLE_MS / 1000 - (nextScanIn ?? 0)) / (CYCLE_MS / 1000)) * 100))}%` }}
          />
        )}
      </div>
    </header>
  );
}
