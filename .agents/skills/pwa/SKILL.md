---
name: pwa
description: Progressive Web App rules for projects following the air-gapped, declarative-first architecture. Defines the manifest as the entry point and the architectural reasoning for defaulting to PWA. Use whenever a project starts (defaulting to PWA is non-negotiable), or when configuring manifest, service-worker scope, or install behavior.
license: MIT
metadata:
  version: "1.0.0"
---

# PWA

Every project in this architecture defaults to Progressive Web App. The decision is made once, at project start, and not revisited per-project.

## Why default to PWA

The architecture's load-bearing property is that **the presentation layer is a portable static resource** — HTML + CSS only, no JS driving the UI. PWA is the deployment posture that makes that property concrete:

- A service worker can cache the static shell, so the front-end works offline.
- A web app manifest lets the browser promote the shell to an installed app.
- The back-end remains independent. The `oninput` boundary still defines the data contract.

PWA introduces no new architectural seams. It deepens the ones already present.

## Scope

PWA spans multiple disciplines. Each piece has a single home:

| Concern | Owned by |
|---|---|
| Manifest file (`manifest.webmanifest`) | this skill |
| Manifest `<link>` in HTML `<head>` | `html` skill (`references/shell-layout.md`) |
| Service worker file and registration | `javascript` skill |
| HTTPS and HSTS headers | `security` skill (`references/headers.md`) |
| App icons (brand-bound) | `assets/images/brand/` |

This skill owns the PWA-specific surface: manifest format, install behavior, and the rationale. Cross-cutting pieces live in their own skills with pointers from here.

## The manifest

A single JSON file at project root, named `manifest.webmanifest`, linked from `<head>`:

```html
<link rel="manifest" href="manifest.webmanifest" />
```

Minimal manifest:

```json
{
  "name": "Project Name",
  "short_name": "Project",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "assets/images/brand/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/images/brand/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Icons live under `assets/images/brand/` because they are brand-bound (the architecture splits brand assets from project-functional assets).

## Service worker

A service worker is JavaScript that sits below the `oninput` boundary, doing data work — specifically, caching the static shell and proxying API requests. It does not drive the UI.

Service worker responsibilities:

- Cache the static shell (`index.html`, `assets/css/*.css`, `assets/js/*.js`, brand images) for offline use
- Proxy API requests through to the network with per-route caching strategies
- Update itself on each new shell version

The implementation file is one of the permitted JS files in `assets/js/` and is registered from `app.js`. The `javascript` skill catalogues which JS files exist.

## Install behavior

The browser provides the install prompt natively when manifest requirements are met. The architecture uses the browser-supplied prompt as-is; no custom install UI is implemented unless explicitly required.

If a project genuinely needs a custom in-page install affordance, the pattern uses the `beforeinstallprompt` event in the data-layer JS — never the presentation layer.

## What PWA never does in this architecture

- Never depends on a third-party PWA framework (Workbox, etc.) at runtime — see the `architecture` skill's "no third-party runtime dependencies" rule
- Never embeds secrets in the manifest or in service-worker code
- Never introduces UI logic into the service worker (service worker is data-layer only)
- Never blocks or replaces the native install prompt with a custom UI unless explicitly required and surfaced to the user

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `<link rel="manifest">` (Web App Manifest) — **Limited availability** (not Baseline; Firefox desktop does not support `rel="manifest"`) — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/manifest
- Service Worker API — **MDN assigns no Baseline tier** on the API overview; cross-browser per BCD (Chrome, Edge, Firefox, Safari 11.1+) — https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- `beforeinstallprompt` event — **Limited availability** (not Baseline; Chromium-only — absent in Firefox and Safari) — https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event

**AutoCSS Architecture:** serves the PWA baseline — the web app manifest, service worker, and install behavior. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## References

- W3C Web App Manifest: https://www.w3.org/TR/appmanifest/
- MDN Progressive Web Apps: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- MDN Web App Manifest reference: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
- MDN Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- web.dev Learn PWA: https://web.dev/learn/pwa
