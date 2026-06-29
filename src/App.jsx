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
    <div className="page-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <DashboardHeader
          now={now}
          scanning={scanning}
          nextScanIn={nextScanIn}
          onScan={runScan}
          summary={summary}
        />

        <main className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              state={states[service.id]}
            />
          ))}
        </main>

        <footer className="mt-12 text-center text-xs text-[var(--text-muted)]">
          Probe state lives in memory for this session · Cycle every {Math.round(CYCLE_MS / 1000)}s after a complete pass
        </footer>
      </div>
    </div>
  );
}
