import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SERVICES, serviceDomainUrl } from "../services.js";
import { probe } from "../probe.js";

export const CYCLE_MS = 3 * 60 * 1000;
export const HISTORY_LIMIT = 60;

const emptyProbeState = { kind: "idle" };

function createServiceState() {
  return {
    domain: emptyProbeState,
    history: [],
  };
}

function createInitialStates() {
  return Object.fromEntries(SERVICES.map((service) => [service.id, createServiceState()]));
}

export function useServiceScanner() {
  const [states, setStates] = useState(createInitialStates);
  const [scanning, setScanning] = useState(false);
  const [lastScanAt, setLastScanAt] = useState(null);
  const [nextScanIn, setNextScanIn] = useState(null);

  const scanLock = useRef(false);

  const setServiceState = useCallback((id, updater) => {
    setStates((prev) => ({
      ...prev,
      [id]: updater(prev[id] ?? createServiceState()),
    }));
  }, []);

  const runScan = useCallback(async () => {
    if (scanLock.current) return;
    scanLock.current = true;
    setScanning(true);

    await Promise.all(SERVICES.map(async (service) => {
      setServiceState(service.id, (state) => ({
        ...state,
        domain: { ...state.domain, kind: "checking" },
      }));

      const domainRes = await probe(serviceDomainUrl(service.subdomain));

      const updatedAt = Date.now();
      setServiceState(service.id, (state) => ({
        domain: { ...domainRes, kind: "checked", updatedAt },
        history: state.history.concat({
          at: updatedAt,
          domain_ok: domainRes.ok,
        }).slice(-HISTORY_LIMIT),
      }));
    }));

    setLastScanAt(Date.now());
    setScanning(false);
    scanLock.current = false;
  }, [setServiceState]);

  useEffect(() => {
    runScan();
  }, [runScan]);

  useEffect(() => {
    if (!lastScanAt || scanning) return undefined;

    const target = lastScanAt + CYCLE_MS;
    let intervalId;
    const tick = () => {
      const remainingSeconds = Math.max(0, Math.round((target - Date.now()) / 1000));
      setNextScanIn(remainingSeconds);
      if (remainingSeconds <= 0 && intervalId) {
        window.clearInterval(intervalId);
        runScan();
      }
    };

    tick();
    intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [lastScanAt, scanning, runScan]);

  const summary = useMemo(() => {
    let up = 0;
    let down = 0;
    let pending = 0;

    for (const service of SERVICES) {
      const state = states[service.id];
      if (!state) continue;
      if (state.domain.kind === "checking") pending += 1;
      else if (state.domain.ok === true) up += 1;
      else if (state.domain.ok === false) down += 1;
    }

    return { up, down, pending, total: SERVICES.length };
  }, [states]);

  return {
    states,
    scanning,
    lastScanAt,
    nextScanIn,
    runScan,
    summary,
  };
}
