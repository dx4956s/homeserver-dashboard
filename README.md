# Home Services Dashboard

A local React and Vite dashboard for checking and opening self-hosted services on `*.home.dx4956s.dev`.

The app renders a card for each service, periodically probes its domain, shows recent health history, and provides an `Open` button that launches the service domain in a new tab.

## Features

- Service cards with name, description, port, status, uptime percentage, and recent check sparkline.
- `Open` links use the configured service domain, for example `https://forgejo.home.dx4956s.dev`.
- Automatic health scan on page load.
- Manual `Re-check now` button.
- Repeats scans every 3 minutes after a completed pass.
- Server-side probe endpoint avoids browser CORS issues.
- Probe uses the local DNS server `192.168.0.100` before connecting.
- Probe starts with `HEAD` and retries with `GET` when a service returns `405 Method Not Allowed`.

## Getting Started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev -- --host 0.0.0.0
```

Build for production:

```sh
npm run build
```

Run lint:

```sh
npm run lint
```

Preview the production build:

```sh
npm run preview -- --host 0.0.0.0
```

## Configuration

Services are defined in [src/services.js](src/services.js).

Each service entry has:

- `id`: stable internal key.
- `name`: display name.
- `subdomain`: hostname prefix under `.home.dx4956s.dev`.
- `port`: service port shown in the dashboard.
- `desc`: short description shown on the card.

The domain suffix is also configured in [src/services.js](src/services.js):

```js
export const DOMAIN_SUFFIX = ".home.dx4956s.dev";
```

The probe DNS server is configured in [src/server/probeApiPlugin.js](src/server/probeApiPlugin.js):

```js
const DNS_SERVER = "192.168.0.100";
```

## Probe Behavior

The browser calls:

```text
/api/probe?url=<encoded-service-url>
```

The Vite server middleware then:

1. Resolves the service hostname with `192.168.0.100`.
2. Connects to the resolved IP while preserving the original `Host` header.
3. Sends a `HEAD` request.
4. Retries with `GET` if the service rejects `HEAD` with `405`.
5. Treats `2xx`, `3xx`, `401`, and `403` responses as healthy.

This keeps services like Forgejo and Navidrome from being marked unhealthy only because they reject `HEAD` requests.

## Project Structure

```text
src/
  App.jsx                         Main dashboard layout
  services.js                     Service list and domain helpers
  probe.js                        Browser probe client
  health.js                       Probe status helpers
  hooks/useServiceScanner.js      Scan loop and in-memory history
  server/probeApiPlugin.js        Vite probe API middleware
  components/                     Dashboard UI components
```

## Notes

Probe history is stored in browser memory for the current page session only. Refreshing the page resets recent checks and uptime percentages.
