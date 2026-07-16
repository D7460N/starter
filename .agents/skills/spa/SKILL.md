---
name: spa
description: Single-Page-Application rules for projects following the air-gapped, browser-native architecture. Defines the one entry document, radio-driven navigation read by CSS `:has()`, the fetch-once shell, the `oninput` data lifecycle per view change, and same-document content transitions. Use whenever wiring navigation, routing, view switching, deep-linking, or page-to-page behavior. Pairs with the `pwa` skill.
license: MIT
metadata:
  version: "1.0.0"
---

# SPA

One document. The browser is the router. Navigation is DOM state (`:checked`), read by CSS. JavaScript moves data, never drives the view. This is the twin of the `pwa` skill: SPA defines the in-page model, PWA defines the deployment posture.

## One entry document

A single `index.html` at project root holds the entire DOM up front (see the `html` skill's shell). There is no second HTML page, no client-side template engine, no innerHTML view rendering. Views are regions of the one document that show or hide based on data presence and `:checked` state.

## Navigation is a radio state machine

Global navigation is mutually-exclusive radio inputs inside labels, inside `<nav>` — never `<a href>` page loads, never a JS router, never the History API for view switching:

```html
<nav>
  <label><input type="radio" name="nav" aria-hidden="true" /></label>
  <label><input type="radio" name="nav" aria-hidden="true" /></label>
</nav>
```

CSS reads the checked radio with `:has()` and reveals the matching view. The `name="nav"` group gives single-selection for free (the browser enforces exclusivity). The full input-hiding + accessibility details live in the `css` skill's `state-machines` reference; the visual reaction lives in `css` layout/state.

**No `checked` attribute is set in the HTML.** The startup script restores the persisted selection (or the first radio) and dispatches an `input` event — see below.

## The shell is fetched once

Chrome-of-the-app content — `header`, `nav`, `footer`, meta — is fetched and injected a single time per runtime session, not on every view change. Only the per-view data is re-fetched when the nav selection changes. The `javascript` skill owns the transport; this skill owns the rule: **shell once, view data per selection.**

## Every view change enters the same `oninput` lifecycle

A view change is an `input` event on the selected nav radio. That is the only trigger for a data fetch. The lifecycle:

1. A nav radio becomes `:checked` (user click, or programmatic restore on load).
2. Its own `oninput` fires the shared lifecycle in `oninput.js`.
3. The lifecycle maps the radio's index to an endpoint suffix and fetches that view's JSON.
4. JSON is injected into the reused DOM targets; CSS reveals them via `:not(:empty)` / `:has()`.

`:checked` is the single source of truth for **both** the CSS view state and the data call. Full lifecycle rules are in the `javascript` skill — this skill only fixes that navigation and data are one event, never two.

### Initial load and return visits

No nav radio is `checked` in the HTML. On load, the startup script reads the persisted selection from storage (or falls back to the first nav radio), sets `input.checked = true`, then dispatches `input.dispatchEvent(new Event('input', { bubbles: true }))` so the input's own `oninput` runs the lifecycle. This `dispatchEvent` is the single sanctioned programmatic selection — `.click()` / `onclick` are forbidden. Return visits restore the persisted radio the same way, which is how the SPA "deep-links" to a view without a URL router.

## Same-document view transitions

Switching views is a **same-document** change, so it fades via the universal `*` transition plus `transition-behavior: allow-discrete` (see the `css` skill's `transitions` reference). **`@view-transition` is not used** — it fires only on cross-document navigations and is inert in this single-document app. If the project ever becomes multi-document, revisit that decision then.

## What the SPA never does

- Never a client-side router library (no hash router, no History-API view routing)
- Never a second HTML page or a JS template/rendering engine for views
- Never `<a href>` for in-app view changes (anchors are for real cross-document links only)
- Never a user-event handler for data fetching — the `oninput` lifecycle owns all CRUD
- Never `@view-transition` (cross-document only; does nothing here)
- Never store view state in JS variables — `:checked` in the DOM is the state

## Boundaries with other skills

| Piece | Owned by |
|---|---|
| The one `index.html` shell + regions | `html` |
| Nav state machine markup + input hiding | `html` + `css` (`state-machines`) |
| View reveal, layout, view transitions | `css` (`layout`, `transitions`) |
| `oninput` lifecycle, fetch, storage, startup dispatch | `javascript` |
| View JSON shape | `json` |
| Offline shell caching + install | `pwa` |

## Reference

- MDN `:has()`: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- MDN `:checked`: https://developer.mozilla.org/en-US/docs/Web/CSS/:checked
- MDN `transition-behavior`: https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
- MDN `Event()` / `dispatchEvent`: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
- MDN Single-page applications: https://developer.mozilla.org/en-US/docs/Glossary/SPA
- D7460N Architecture (canonical rules): https://github.com/Autocss-com/ai/blob/main/AGENTS.md
