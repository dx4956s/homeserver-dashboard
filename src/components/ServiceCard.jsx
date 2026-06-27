import { serviceOverallState } from "../health.js";
import { serviceDomainUrl } from "../services.js";
import { ProbeLine } from "./ProbeLine.jsx";
import { Sparkline } from "./Sparkline.jsx";

function pct(n, d) {
  if (!d) return null;
  return Math.round((n / d) * 1000) / 10;
}

function uptimeColor(uptime) {
  if (uptime == null) return "text-[var(--text-muted)]";
  if (uptime >= 99) return "text-[var(--success)]";
  if (uptime >= 90) return "text-[var(--warning)]";
  return "text-[var(--danger)]";
}

const statusConfig = {
  up: {
    label: "Online",
    border: "border-[var(--success)]",
    badgeBg: "bg-[var(--success-bg)]",
    badgeBorder: "border-[var(--success)]",
    text: "text-[var(--success)]",
  },
  checking: {
    label: "Checking",
    border: "border-[var(--warning)]",
    badgeBg: "bg-[var(--warning-bg)]",
    badgeBorder: "border-[var(--warning)]",
    text: "text-[var(--warning)]",
  },
  down: {
    label: "Offline",
    border: "border-[var(--danger)]",
    badgeBg: "bg-[var(--danger-bg)]",
    badgeBorder: "border-[var(--danger)]",
    text: "text-[var(--danger)]",
  },
};

export function ServiceCard({ service, state }) {
  const overall = serviceOverallState(state);
  const domainUrl = serviceDomainUrl(service.subdomain);
  const upCount = state.history.filter((entry) => entry.domain_ok).length;
  const overallUptime = pct(upCount, state.history.length);
  const config = statusConfig[overall] ?? statusConfig.down;

  return (
    <article
      className={`panel flex flex-col rounded-xl p-5 hover-lift border-l-4 ${config.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-[var(--text-primary)]">
              {service.name}
            </h3>
            <a
              href={domainUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center rounded-md text-[var(--text-muted)] transition hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1"
              title={`Open ${service.name} in a new tab`}
              aria-label={`Open ${service.name} in a new tab`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M14 4h6v6" />
                <path d="M20 4 10 14" />
                <path d="M20 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
              </svg>
            </a>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            {service.desc}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium uppercase tracking-wide ${config.badgeBg} ${config.badgeBorder} ${config.text}`}
        >
          <span className={`status-dot status-dot-${overall === "up" ? "online" : overall === "checking" ? "checking" : "offline"}`} />
          {config.label}
        </span>
        <a
          href={domainUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-secondary)] px-2 py-1 font-mono text-[11px] text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--text-primary)]"
          title={`Port ${service.port}`}
        >
          :{service.port}
        </a>
      </div>

      <div className="mt-4">
        <ProbeLine label="Domain" status={state.domain} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="panel-inset rounded-lg p-3">
          <p className="mb-2 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Recent checks</p>
          <Sparkline history={state.history} />
        </div>
        <div className="panel-inset rounded-lg p-3 text-right">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Healthy</p>
          <span className={`font-mono text-2xl font-semibold ${uptimeColor(overallUptime)}`}>
            {overallUptime == null ? "-" : `${overallUptime}%`}
          </span>
          <p className="mt-1 text-[10px] text-[var(--text-muted)]">{state.history.length} checks</p>
        </div>
      </div>
    </article>
  );
}
