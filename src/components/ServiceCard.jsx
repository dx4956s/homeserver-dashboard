import { serviceOverallState } from "../health.js";
import { serviceDomainUrl } from "../services.js";
import { ProbeLine } from "./ProbeLine.jsx";
import { Sparkline } from "./Sparkline.jsx";
import { StatusDot } from "./StatusDot.jsx";

function pct(n, d) {
  if (!d) return null;
  return Math.round((n / d) * 1000) / 10;
}

function uptimeColor(uptime) {
  if (uptime == null) return "text-slate-600";
  if (uptime >= 99) return "text-emerald-400";
  if (uptime >= 90) return "text-amber-400";
  return "text-rose-400";
}

export function ServiceCard({ service, state }) {
  const overall = serviceOverallState(state);
  const domainUrl = serviceDomainUrl(service.subdomain);
  const borderClass =
    overall === "up" ? "border-emerald-500/30"
      : overall === "checking" ? "border-amber-500/30"
        : "border-rose-500/30";
  const upCount = state.history.filter((entry) => entry.domain_ok).length;
  const overallUptime = pct(upCount, state.history.length);

  return (
    <div className={`rounded-lg border ${borderClass} bg-slate-900/60 p-4 backdrop-blur-sm transition hover:shadow-lg hover:shadow-black/20`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-semibold text-slate-100">
            <StatusDot kind={overall === "up" ? "online" : overall === "checking" ? "checking" : "offline"} />
            <span className="truncate">{service.name}</span>
          </h3>
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-400">{service.desc}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={domainUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-300 hover:bg-slate-700 hover:text-white"
            title={`Open ${service.name} domain`}
          >
            :{service.port}
          </a>
          <a
            href={domainUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-sky-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-sky-500"
            title={`Open ${service.name}`}
          >
            Open
          </a>
        </div>
      </div>

      <div className="mt-3">
        <ProbeLine label="Domain" status={state.domain} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Recent checks</p>
          <Sparkline history={state.history} />
        </div>
        <div className="text-right">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Healthy</p>
          <span className={`font-mono text-lg ${uptimeColor(overallUptime)}`}>
            {overallUptime == null ? "-" : `${overallUptime}%`}
          </span>
          <p className="mt-1 text-[10px] text-slate-600">{state.history.length} checks</p>
        </div>
      </div>
    </div>
  );
}
