// Browser-side probe client. Hits the dev/preview server's `/api/probe`
// endpoint which runs curl (see vite.config.js). No CORS, no manual
// timeout — long-responding services ride it out.

const RETRIES = 2;
const RETRY_DELAY_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function isNetworkError(result) {
  // Only retry when curl could not establish a connection at all.
  // An HTTP response (any code) means the service answered; don't retry.
  return !result.reachable && /refused|resolve|timeout|timed|connection|tls|ssl|network/i.test(result.error || "");
}

function normalizeProbeResult(result) {
  return {
    ok: Boolean(result?.ok ?? result?.online),
    online: Boolean(result?.ok ?? result?.online),
    reachable: Boolean(result?.reachable ?? result?.httpCode > 0),
    httpCode: Number.isInteger(result?.httpCode) ? result.httpCode : 0,
    latencyMs: result?.latencyMs ?? null,
    error: result?.error ?? null,
  };
}

export async function probe(url) {
  let lastResult = null;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch("/api/probe?url=" + encodeURIComponent(url), {
        cache: "no-store",
      });
      if (!res.ok) {
        lastResult = { ok: false, online: false, reachable: false, httpCode: 0, latencyMs: null, error: `api ${res.status}` };
      } else {
        lastResult = normalizeProbeResult(await res.json());
      }
    } catch (err) {
      lastResult = { ok: false, online: false, reachable: false, httpCode: 0, latencyMs: null, error: err?.message || "fetch failed" };
    }

    if (lastResult.ok || lastResult.reachable || !isNetworkError(lastResult)) return lastResult;
    if (attempt < RETRIES) await sleep(RETRY_DELAY_MS);
  }
  return lastResult;
}
