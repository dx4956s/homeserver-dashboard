import { useEffect, useState } from "react";
import { DashboardHeader } from "./components/DashboardHeader.jsx";
import { ServiceCard } from "./components/ServiceCard.jsx";
import { CYCLE_MS, useServiceScanner } from "./hooks/useServiceScanner.js";
import { SERVICES } from "./services.js";

export default function App() {
  const [now, setNow] = useState(() => Date.now());
  const { states, scanning, nextScanIn, runScan, summary } = useServiceScanner();

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <DashboardHeader
          now={now}
          scanning={scanning}
          nextScanIn={nextScanIn}
          onScan={runScan}
          summary={summary}
        />

        <main className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              state={states[service.id]}
            />
          ))}
        </main>

        <footer className="mt-10 text-center text-[11px] text-slate-600">
          Probe state lives in memory for this session. Cycle every {Math.round(CYCLE_MS / 1000)}s after a complete pass.
        </footer>
      </div>
    </div>
  );
}
