import http from "node:http";
import https from "node:https";
import { Resolver } from "node:dns";
import { URL } from "node:url";

const CONNECT_TIMEOUT_MS = 3000;
const MAX_TIME_MS = 8000;
const DNS_SERVER = "192.168.0.100";

const resolver = new Resolver();
if (DNS_SERVER) resolver.setServers([DNS_SERVER]);

function firstErrorLine(err) {
  return (err?.message || "request failed").trim().split("\n")[0];
}

async function resolveHostname(hostname) {
  try {
    const addresses = await new Promise((resolve, reject) => {
      resolver.resolve4(hostname, (err, addrs) => {
        if (err) reject(err);
        else resolve(addrs);
      });
    });
    return addresses?.[0] ?? null;
  } catch {
    return null;
  }
}

async function probeUrl(urlStr) {
  const startedAt = Date.now();

  let ip = null;
  const parsedUrl = new URL(urlStr);

  if (DNS_SERVER) {
    ip = await resolveHostname(parsedUrl.hostname);
  }

  const isHttps = parsedUrl.protocol === "https:";
  const transport = isHttps ? https : http;

  const port = parsedUrl.port || (isHttps ? 443 : 80);
  const hostname = ip || parsedUrl.hostname;

  const options = {
    hostname,
    port,
    path: parsedUrl.pathname + parsedUrl.search,
    headers: {
      "Host": parsedUrl.hostname,
      "User-Agent": "HomeDashboard/1.0",
    },
    timeout: CONNECT_TIMEOUT_MS,
  };

  try {
    let response = await requestUrl(transport, { ...options, method: "HEAD" });
    if (response.statusCode === 405) {
      response.destroy();
      response = await requestUrl(transport, { ...options, method: "GET" });
    }

    const latencyMs = Date.now() - startedAt;
    const httpCode = response.statusCode;
    const reachable = httpCode > 0;
    const ok = (httpCode >= 200 && httpCode < 400) || httpCode === 401 || httpCode === 403;

    response.destroy();

    return {
      ok,
      online: ok,
      reachable,
      httpCode,
      latencyMs,
      error: ok || reachable ? null : "unhealthy status",
    };
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    return {
      ok: false,
      online: false,
      reachable: false,
      httpCode: 0,
      latencyMs,
      error: firstErrorLine(err),
    };
  }
}

function requestUrl(transport, options) {
  return Promise.race([
    new Promise((resolve, reject) => {
      const req = transport.request(options, (res) => {
        resolve(res);
      });
      req.on("error", reject);
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("timeout"));
      });
      req.end();
    }),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("timeout")), MAX_TIME_MS);
    }),
  ]);
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function isValidProbeUrl(url) {
  return typeof url === "string" && /^https?:\/\//.test(url);
}

export function probeApiPlugin() {
  const middleware = async (req, res, next) => {
    const requestUrl = new URL(req.url || "", "http://localhost");
    if (requestUrl.pathname !== "/api/probe") return next();

    const target = requestUrl.searchParams.get("url");
    if (!isValidProbeUrl(target)) {
      sendJson(res, 400, { error: "invalid url" });
      return;
    }

    const result = await probeUrl(target);
    sendJson(res, 200, result);
  };

  return {
    name: "probe-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
