---
name: d7460n-css-only
description: 'D7460N Architecture — zero-dependency, CSS-only, JAMstack-based, browser-native starter template. Use when modifying HTML, CSS, or JS files in this project. Enforces CSS-driven UI state, semantic HTML, no frameworks, no dependencies, and strict separation of concerns between presentation and data layers.'
license: MIT
metadata:
  author: D7460N
---

# D7460N CSS-only Architecture

## When to use this skill

Use this skill when working on any file in the D7460N Architecture starter template. This ensures all changes comply with the zero-dependency, CSS-only, browser-native architecture.

## External Service Issues (Non-Negotiable)

When a configured external API or service fails for any reason (SSL certificate errors, network failures, authentication errors, rate limiting, HTTP errors, etc.):

- **NEVER** change the codebase architecture or redirect API endpoints to work around the failure.
- **NEVER** create local fallback files, mock data, or substitute data sources to replace the external service.
- **NEVER** redirect `API_BASE_URL` or any configured endpoint from its declared remote origin to a local path.
- **STOP immediately** and advise the user on how to resolve the external service issue directly.
- **Examples of correct responses:**
  - SSL cert error → advise the user to log into their service provider account and renew or verify the certificate.
  - Network/fetch failure → advise the user to check service status, subscription, or provider dashboard.
  - 4xx/5xx HTTP error → advise the user to inspect the endpoint configuration or contact the API provider.
- Creating workarounds in code for broken external services produces more code, obscures the real problem, violates Least Power, and permanently changes the architecture in ways the user did not request.

## Session Continuity (Non-Negotiable)

- At the start of every session, ALWAYS read `SESSION-HANDOFF.md` before making implementation decisions.
- ALWAYS re-assert the handoff "Constraint Lock" before coding changes.
- If `SESSION-HANDOFF.md` conflicts with canonical architecture rules, STOP and ask for clarification.
- NEVER skip handoff review due to time pressure.

## Non-Negotiable Rules

1. Unless otherwise indicated, this code base shall NEVER default to, NEVER consider, NEVER refer to, NEVER suggest, and NEVER use third party dependencies.
2. Third party dependencies are defined as any packaged code or system that is not able render natively (without assistance) or must be compiled and or pre-built to run in an evergreen web browser.
3. Unless otherwise indicated, this code base shall ALWAYS default to, ALWAYS consider, ALWAYS refer to, ALWAYS suggest, and ALWAYS use modern, advanced, vanilla, W3C/WCAG standards compliant, accessibility-first, syntax, techniques, approaches, strategies for all project design and development.
4. Established standards can ALWAYS be found here, (https://www.w3.org/TR/) and here (https://developer.mozilla.org/en-US/docs/Web).
5. Unless otherwise indicated, this code base shall ALWAYS default to Single Page Application (SPA) navigational architecture.
6. Unless otherwise indicated, this code base shall ALWAYS default to being a Progressive Web Application (PWA).
7. Unless otherwise indicated, JS shall NEVER be used for anything (exception: modular `assets/js/*.js` runtime files for API transport, `oninput` lifecycle orchestration, storage, and startup wiring). Modern HTML and CSS must be used for all development.
8. Unless otherwise indicated, CSS shall ALWAYS default to and ALWAYS replace JS equivalent functionality.
9. Unless otherwise indicated, JS shall ALWAYS default to and ALWAYS use `document.querySelector('');` for targeting all selectors.
10. Unless otherwise indicated, JS shall ALWAYS default to and ALWAYS use `oninput` for ALL API CRUD operations through a shared lifecycle utility.
11. Unless otherwise indicated, JS shall NEVER default to and NEVER use any user initiated event for any API CRUD operations.
12. Unless otherwise indicated, JS shall NEVER default to and NEVER set or use any event listeners.
13. Unless otherwise indicated, JS shall NEVER default to and NEVER set or use any listeners at all - ever.
14. Unless otherwise indicated, HTML shall ALWAYS default to and ALWAYS use `<label>`.
15. Unless otherwise indicated, HTML markup shall ALWAYS default to and ALWAYS be semantic, minimally nested, and intuitive to developers.
16. Unless otherwise indicated, the principal of Separation of Concerns between presentation and data layers shall ALWAYS be maintained.
17. Unless otherwise indicated, the principal of Least Power shall ALWAYS be maintained.
18. Unless otherwise indicated, CSS shall ALWAYS default to and ALWAYS determine DOM element visibility via `:empty` and `:has()` pseudo selectors.
19. Unless otherwise indicated, CSS shall ALWAYS default to and ALWAYS use modern CSS style queries and other CSS only combinations of modern CSS techniques to design and build functionality without requiring hard or static values that would otherwise need to be maintained.
20. Unless otherwise indicated, CSS shall ALWAYS default to and ALWAYS manage light and dark mode color-scheme syntax and variables in `:root{}`.
21. Unless otherwise indicated, CSS shall ALWAYS default to and ALWAYS use a11y selectors when possible.
22. Unless otherwise indicated, CSS shall ALWAYS default to and ALWAYS use checkboxes inside `<label>`s with `role="button"` combined with `:has()`, `:not`, and `:empty()` for state machines.
23. Unless otherwise indicated, CSS shall ALWAYS default to and ALWAYS use a radio buttons inside a `<label>` with `role="button"` combined with `:has()`, `:not`, and `:empty()` inside `<nav>` for global navigation.
24. Unless otherwise indicated, HTML shall ALWAYS default to and ALWAYS use one single file, `index.html` at project root.
25. Unless otherwise indicated, HTML shall ALWAYS default to and ALWAYS be a full-bleed Holy Grail layout using the skeletal layout markup found in the `index.html` file.
26. Unless otherwise indicated, `<div>` and `<span>` shall NEVER be used. ALWAYS use semantic HTML equivalents that address the intent of the element.
27. Unless otherwise indicated, wrapper elements shall NEVER be nested for layout purposes. ALWAYS use CSS Grid solutions instead (e.g., `grid-template-columns` and `justify-content: space-between`).

## Architecture

- **index.html** (root): Complete DOM structure, pre-built
- **assets/css/layout.css**: The only active CSS file; CSS Grid Holy Grail structure and all current layout
- **assets/js/app.js**: JS entrypoint; startup checks, console reset, and initialization wiring
- **assets/js/oninput.js**: Shared `oninput` lifecycle; binds nav inputs, routes API calls, and injects data
- **assets/js/api.js**: API transport utilities; base URL, endpoint suffix resolution, fetch/parse, and logging helpers
- **assets/js/storage.js**: Generic storage utilities (localStorage primary, cookie fallback)
- **assets/js/tour.js**: Safe placeholder module for future onboarding/tour logic
- **assets/images/**: Static assets

### Ignored (inactive for now)

- **assets/js/pipeline/**: Inactive; ignore for now
- **assets/css/*.css** (other than `layout.css`): Inactive; ignore for now

## When modifying this project

- All UI states, including loading states, use CSS and HTML checkboxes as state machines
- Keep JS focused on fetch/CRUD only
- Always only ever use semantic HTML markup
- Never use `<div>`, `<span>`, `class`, `data-*`, or `id` — `<div>` and `<span>` shall NEVER be used; ALWAYS use semantic HTML equivalents that address the intent of the element
- NEVER nest wrapper elements for layout — ALWAYS use CSS Grid instead (e.g., `grid-template-columns` and `justify-content: space-between`)
- NEVER create new coding patterns — all patterns are already established; use what exists
- Adding code increases entropy — NEVER add new code or files unless the user explicitly states to
- Follow user instructions in detail — no more, no less

## JS Runtime Conventions (Non-Negotiable)

- API base address is declared once; only endpoint suffix varies (for example `shell`, `home`, `about`, `products`, `events`, `contact`)
- Initial page load MUST enter the same `oninput` lifecycle path via programmatic nav radio `.click()`
- Shell content (`header`, `nav`, `footer`, `meta`) is fetched/injected once per runtime session, not on every page call
- Nav radio index maps to page endpoint suffix; same DOM targets are reused for injection
- Console reporting policy: minimal timestamped success reports, verbose timestamped failure reports, and `console.clear()` on startup and each lifecycle run

## HTML Layout Pattern

The full-bleed Holy Grail layout from `index.html`. This is the canonical structure — ALWAYS follow this pattern unless otherwise stated or a more efficient way is discovered.

```html
<app-container>
  <header>
    <app-logo></app-logo>
    <app-user></app-user>
  </header>
  <nav>
    <label>
      <input type="radio" aria-hidden="true" name="nav">
    </label>
  </nav>
  <main>
    <article>
      <h1></h1>
      <section></section>
    </article>
  </main>
  <aside></aside>
  <footer>
    <app-legal></app-legal>
    <app-version></app-version>
  </footer>
</app-container>
```

### Layout Regions

- **`<app-container>`** — Root layout wrapper; CSS Grid Holy Grail structure
- **`<header>`** — Contains `<app-logo>` and `<app-user>` custom elements
- **`<nav>`** — Global navigation; radio button `<label>` state machines (see State Machine Pattern below)
- **`<main>`** — Primary content area; contains `<article>` with `<h1>`, `<p>`, `<section>` elements
- **`<aside>`** — Sidebar/supplementary content
- **`<footer>`** — Contains `<app-legal>` and `<app-version>` custom elements
- **`<script type="module">`** — Single script tag at end of `<body>`, outside `<app-container>`

## State Machines

Consist of four parts . . .

- HTML `<label>` element
- HTML `<input type="checkbox">` or `<input type="radio">` - nested inside the `<label>`
- CSS `:has()` for UI change
- JS `oninput` for API CRUD operations

. . . and are built with this vanilla HTML design pattern.

```html
<label role="button">
  label text
  <input type="checkbox">
</label>
```

Global nav items will be exactly the same but use `<input type="radio" name="nav">`

```html
<nav>
  <label role="button">
    global nav item 01
    <input type="radio" name="nav">
  </label>
  <label role="button">
    global nav item 02
    <input type="radio" name="nav">
  </label>
  <label role="button">
    global nav item 03
    <input type="radio" name="nav">
  </label>
  <label role="button">
    global nav item 04
    <input type="radio" name="nav">
  </label>
  <label role="button">
    global nav item 05
    <input type="radio" name="nav">
  </label>
<nav>
```
