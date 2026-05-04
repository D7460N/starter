# API

The single transport surface. Base URL declared once. Endpoint suffix varies per page. JSON in, JSON out. Errors thrown, not swallowed.

## The shape of `api.js`

```javascript
const API_BASE = 'https://api.example.tld';

const ENDPOINTS = {
  shell: '/shell',
  home: '/home',
  about: '/about',
  products: '/products',
  events: '/events',
  contact: '/contact',
};

export async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function fetchShell() {
  return fetchJSON(`${API_BASE}${ENDPOINTS.shell}`);
}

export function fetchPage(suffix) {
  const path = ENDPOINTS[suffix];
  if (!path) throw new Error(`Unknown endpoint suffix: ${suffix}`);
  return fetchJSON(`${API_BASE}${path}`);
}
```

`API_BASE` is declared once. `ENDPOINTS` is the only mapping from page name to URL path. New pages add an entry to `ENDPOINTS`, nothing else.

## Error handling

Failures throw. The caller catches in the lifecycle handler and logs verbosely:

```javascript
try {
  const data = await fetchPage(suffix);
  inject(data);
  console.log(`[${new Date().toISOString()}] OK ${suffix}`);
} catch (err) {
  console.error(`[${new Date().toISOString()}] FAIL ${suffix}`, err);
}
```

The error reaches the user via the console. The architecture does not invent fallback data, redirect to a local mock, or retry against a different endpoint. See the `architecture` skill's "External service failures" rule.

## CRUD verbs

`fetchJSON` is GET-shaped. For POST / PUT / PATCH / DELETE, pass options:

```javascript
fetchJSON(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

Keep the function signature minimal. If a project needs a higher-level wrapper, add it as a single named function (e.g., `postJSON`) — never via a class.

## What `api.js` never does

- Never has multiple `API_BASE` declarations
- Never inlines the URL into call sites (always go through the resolver)
- Never silently retries
- Never mocks data
- Never touches the DOM
- Never depends on UI state

## Reference

- MDN Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN `Response.ok`: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
- MDN `Response.json()`: https://developer.mozilla.org/en-US/docs/Web/API/Response/json
- MDN HTTP status codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
