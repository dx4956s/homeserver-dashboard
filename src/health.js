export const HEALTHY_AUTH_CODES = new Set([401, 403]);

export function hasHttpResponse(httpCode) {
  return Number.isInteger(httpCode) && httpCode > 0;
}

export function isHealthyHttpStatus(httpCode) {
  if (!hasHttpResponse(httpCode)) return false;
  return (httpCode >= 200 && httpCode < 400) || HEALTHY_AUTH_CODES.has(httpCode);
}

export function probeStateFromResult(result) {
  if (result?.kind === "checking") return "checking";
  if (result?.kind === "idle" || !result) return "idle";
  if (result.ok) return "online";
  return "offline";
}

export function serviceOverallState(state) {
  if (state?.domain?.ok === true) return "up";
  if (state?.domain?.kind === "checking") return "checking";
  return "down";
}

export function summarizeProbe(result) {
  if (!result) return "";
  if (result.kind === "checking") return "checking...";
  if (result.kind === "idle") return "not checked";
  if (result.ok && result.latencyMs != null) return `${result.latencyMs} ms`;
  if (result.reachable && result.httpCode) return `HTTP ${result.httpCode} is not healthy`;
  return result.error || "no response";
}

export function probeStatusTitle(result) {
  if (!result || result.kind === "idle") return "Not checked yet";
  if (result.kind === "checking") return "Checking";
  if (result.ok) return "Healthy";
  if (result.reachable) return "Responded with an unhealthy HTTP status";
  return "No reachable HTTP service";
}
