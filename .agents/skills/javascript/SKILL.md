---
name: javascript
description: JavaScript rules for projects following the air-gapped, declarative-first architecture. JS is data transport only — it fetches, parses, stores, and injects JSON. It never controls UI state, never manipulates the DOM for presentation, and never uses event listeners. Use whenever writing or reviewing any .js file.
license: MIT
metadata:
  version: "1.0.0"
---

# JavaScript

JavaScript is data transport only. CRUD against an API. Nothing else.

## The only permitted JavaScript responsibilities

1. **API transport** — `fetch()` against the configured endpoint base, parsing JSON responses
2. **`oninput` lifecycle** — wiring nav radios and form inputs to data fetches via the `input` DOM event in `oninput.js`
3. **Storage** — localStorage primary, cookie fallback, in `storage.js`
4. **Startup wiring** — `console.clear()`, programmatic initial nav click, in `app.js`
5. **Tour placeholder** — `tour.js` reserved for future onboarding logic

Anything else is forbidden.

## Only these files exist in `assets/js/`

- `assets/js/app.js` — entrypoint, startup wiring, console reset
- `assets/js/oninput.js` — shared `input` event lifecycle, binds nav and form inputs, routes API calls
- `assets/js/api.js` — `fetch()`, base URL, endpoint suffix resolution, response parsing
- `assets/js/storage.js` — localStorage and cookie utilities
- `assets/js/tour.js` — placeholder

No other JavaScript files are added without explicit user instruction.

## Only these patterns for DOM access

- **`document.querySelector('selector')`** — the only permitted selector method

Forbidden:
- `document.getElementById()`
- `document.getElementsByClassName()` (and there are no classes anyway)
- `document.getElementsByTagName()`
- `document.querySelectorAll()` is permitted only when iterating a known set; prefer `querySelector` chaining
- jQuery, `$()`, any third-party DOM library

## Only these patterns for events

- **`element.addEventListener('input', handler)`** is forbidden in markup-driven flows. The `input` event is bound once in `oninput.js` via direct property assignment to the discovered nodes.
- The HTML attribute `oninput=` and every other `on*=` attribute is forbidden in markup. See the `html` skill.
- `addEventListener` is forbidden anywhere in the project, including inside JS files. The `oninput.js` lifecycle uses direct `.oninput` property assignment, which is idempotent.

The reasoning: every event registration is a piece of UI behavior. UI behavior belongs to CSS. The single exception is data transfer triggered by user input, which is the `oninput` lifecycle.

## Only these utilities for unavoidable DOM mutation

The architecture pulls all UI state into CSS. Two utilities exist for cases where CSS cannot reach a particular browser default:

- `removeInlineStyles(element)` — strips any inline `style` attribute that the browser or a third-party may have inserted
- `clearFieldset(fieldset)` — resets a `<fieldset>` to its empty state for a fresh data render

No other DOM mutation utilities are added. If a need arises, surface it to the user before writing.

## Constraints on every function

- **Stateless.** No module-level mutable state. No `let` declarations at module scope.
- **Idempotent.** Calling twice produces the same result as calling once.
- **No side effects** beyond the explicit responsibility (fetching, parsing, injecting data, writing to storage).
- **No global state.** No `window.foo`. No globals.

## Lifecycle conventions

- The API base URL is declared **once**, in `api.js`. Only the endpoint suffix varies per page (`shell`, `home`, `about`, `products`, `events`, `contact`).
- Initial page load enters the same `oninput` lifecycle path via a programmatic `element.click()` on the appropriate nav radio. There is no separate "boot" path.
- Shell content (header, nav, footer, meta) is fetched and injected once per runtime session, not on every page change.
- Nav radio index maps to page endpoint suffix; the same DOM targets are reused for content injection.
- `console.clear()` runs on startup and on each lifecycle run.

## Console policy

- **Success:** minimal, timestamped, single line.
- **Failure:** verbose, timestamped, full error context.
- `console.clear()` on startup and on each lifecycle run.

## External service failures

When an API call fails (SSL error, network failure, 4xx, 5xx, rate limit), the JS does not retry against a different endpoint, does not redirect to a local fallback, and does not invent data. It surfaces the error to the user with enough detail for them to resolve it. The architecture is never modified to work around external service issues — the user resolves them at the source.

## What JavaScript never does

- Never registers event listeners (`addEventListener`)
- Never reads or writes `class`, `id`, or `data-*` attributes (those don't exist in this architecture's HTML)
- Never injects HTML strings (`innerHTML = '<div>'` etc.)
- Never sets inline styles
- Never controls visibility (CSS does that via `:empty`, `:has()`)
- Never animates (CSS does that)
- Never tracks UI state in JS variables (state lives in DOM via native `checked`, `open`, attributes)
- Never uses `eval`, `Function` constructor, or dynamic code generation

## References

- `references/lifecycle.md` — the canonical `oninput` flow from input event to data injection
- `references/api.md` — fetch, base URL, suffix, error handling
- `references/storage.md` — localStorage and cookie patterns
- `references/forbidden.md` — full list of forbidden patterns with reasoning
- MDN JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- MDN Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- ECMAScript spec: https://tc39.es/ecma262/
