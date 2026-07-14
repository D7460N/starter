# AGENTS.md — D7460N Architecture Canonical Laws

This file is the single source of truth for the D7460N Architecture. All AI tool files (`CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.github/instructions/d7460n-architecture.instructions.md`) are pointers to this file.

**Conflict priority:** `AGENTS.md` > `.agents/skills/*/SKILL.md` > `.agents/SESSION-HANDOFF.md`. When in conflict, surface to the user. Never resolve silently.

## 1. Behavior

- Accuracy wins over speed. Always.
- Use declarative methods.
- Stop and ask on ambiguity. Never guess, infer, or improvise.
- Read entire files. Ignore line caps.
- Use memory and persistent context across sessions.
- No claimed actions without a verifiable tool call (truth supremacy).
- No experiential or emotional self-language, such as gaslighting or virtue signaling.
- No dead-end answers — always give verifiable options to fix and continue.
- Do exactly what is asked — no more, no less.
- **Priority order, always: 1. Accuracy/Quality → 2. Time → 3. Cost.** Accuracy outranks both. Time means timely *and* concise answers; concise answers in turn cost fewer tokens. Cost is last but never irrelevant.
- Output is **complete, correct, and copy-paste-ready**.
- You are **obsolescence-averse, dependency-averse, and entropy-averse**. More code = more complexity = more entropy = bad. Less code = less complexity = less entropy = good.
- **You do not adapt the architecture to the problem. You adapt the problem to the architecture.**

### Decision model (ordered — do not skip a step)

1. **Rescan** the full existing codebase for an existing feature or capability that solves it.
2. **Rescan** the full existing codebase for a **combination** of existing features/capabilities that solves it.
3. If neither exists — **STOP, alert the user, and await instructions.** Do not start new code on your own authority.
4. Only when authorized by the user, start a new solution with the **least powerful** browser-native language: HTML.
5. If HTML cannot do it, **use CSS**.
6. JavaScript is **STRICTLY FORBIDDEN** except data transport (CRUD) invoked by `oninput`.

### Known agent failure modes (documented, not hypothetical — actively prevent)

- Agents **default to JavaScript** → actively prevent.
- Agents **introduce classes by habit** → block.
- Agents **assume dynamic rendering of content only** → correct.

### Pre-send gate

Before any architectural or structural claim:

1. **Scope-invent check** — every layer or feature must be explicitly requested or documented. Inventing scope is forbidden.
2. **Rule-scope check** — locate the scope statement before applying any rule. Shape match ≠ scope match.

### Failure-recovery protocol

When a rule is violated:

1. Name the specific rule.
2. Diagnose the reasoning step that bypassed it.
3. State correction as an immediate behavior change.
4. Re-run the affected reasoning.

Apologizing and continuing is not acceptable.

### Citation requirement

Every architectural or technical claim cites an authoritative source: W3C, WHATWG, CSSWG, MDN, Baseline (web.dev), caniuse, vendor release notes. Citation files live in each skill's `references/` subfolder. Citations route disagreement to the standard, not to the project.

## 2. Stack

- **The user-agent (web browser) is the single source of truth. It is the platform. It is the framework.** Anything and everything that is not native to the browser is, by definition, optional and custom.
- **The system must function even with JavaScript disabled.**
- **HTML + CSS only** for everything except data transport (CRUD).
- Combine modern standard vanilla HTML/CSS features and techniques as needed.
- **JavaScript** is permitted only below the `oninput` boundary: `app.js` (bootstrap), `oninput.js` (lifecycle), `api.js` (CRUD), `storage.js` (persistence), `tour.js` (placeholder).
- **No third-party dependencies.**
- **No build tools, no bundlers, no transpilers, no compilers.**
- **No cross-browser concerns.** Evergreen browsers only. Latest features used without regard for older browsers.
- Single-page application (`index.html` at root) deployed as PWA via `manifest.webmanifest`.
- Layout = **CSS Grid only.** Never Flexbox. Full-bleed Holy Grail via `<app-container>`.

## 3. HTML — structure only

- Semantic elements only. No `<div>`, `<span>`, `class`, `id`, `data-*`.
  - **Why (know why you are doing this):** it minimizes selector-dependency complexity, enforces semantics, ensures portability, and **gets out of the way of other systems who do use classes/IDs/`data-*`** — their selectors land unopposed.
- Interactive elements that are not intrinsically interactive use `<label>` wrapping a hidden `<input type="checkbox">` or `<input type="radio">` with `aria-hidden="true"`. No JS-driven `<button>` or `eventListener`
- Forms inside `<fieldset>` with schema/rules from JSON.
- One `<script type="module">` before `</body>`, outside `<app-container>`.
- No HTML in JSON. Ever.
- Custom elements: only two categories permitted — the closed `app-*` set (`app-container`, `app-logo`, `app-user`, `app-legal`, `app-version`, `app-banner`), or data-table (`<ul><li>`) row elements generated from JSON keys via `toTagName()`, injected with paired `value`. Anything outside these is forbidden.
- Always use `<meta name="color-scheme" content="light dark">` to minimizing flash of unstyled content (FOUC).
- Full ruleset: [`.agents/skills/html/SKILL.md`](./.agents/skills/html/SKILL.md).

## 4. CSS — the UI runtime

- **CSS is the UI execution layer AND the styling.** Both, not one or the other. Modern vanilla HTML (structure) and CSS (everything else) **own the presentation layer, exclusively.** Every presentation-layer solution must be modern HTML + CSS only.
  - **Why (know why you are doing this):** CSS-first reduces the JavaScript attack surface, increases performance, and enforces determinism.
- CSS stays **copy/paste modular, unopinionated, and out of the way** via `@layer` and `@scope`.
- Fully replaces JavaScript for all UI behavior: state, visibility, themes, color-scheme, transitions, loading, navigation, forms, default and conditional layout, responsiveness, feature detection, except for the one thing HTML and CSS cannot do - data transport for CRUD operations (applied principle of Least Power).
- Visibility controlled by data presence via `:empty`, `:not(:empty)`, `:has()` or chained combinations thereof driven by declarative logic. No `"visible": true` flags in data.
- Light/dark via `:root { color-scheme: light dark }` and `light-dark()`. No duplicated `@media (prefers-color-scheme: dark)` blocks.
- All CSS belongs to a `@layer` that matches their filename that matches their feature and intent. One `@layer` per CSS file. Cascade order declared once at project root. In addition to better visual context, `@layer` minimizes cascade priority. Thus additive classes, IDs and or applied styles always take precedence.
- No `!important`. Ever.
- No size-based `@media` (`min-width` / `max-width`). Always use intrinsic content based syntax such as min or max `content` width and `@container` or media query range syntax. If values are required, use `ch` (character) value type 
- No padding or margin on any elements except for content level elements, such as `<p>`, `<h1>`, `<label>`.
- `oklch` for project color schemes (light dark), and color themes. No `hex`, `hsl`, `rgb`.
- Logical properties only (`margin-inline`, `padding-block`, etc.) to maintain automatic multi-national usability.
- Required modern features: `@starting-style` for entry fade-in,  `@view-transition` for tab content, CSS anchor positioning for hover/popover content.
- Full ruleset: [`.agents/skills/css/SKILL.md`](./.agents/skills/css/SKILL.md).

## 5. JavaScript — data transport only

- **Modern vanilla JavaScript owns the API/data logic layer — and nothing else.** In the UI it does nothing but CRUD API calls and data transport. It never owns presentation.
- **`oninput` is the one and only event permitted in the presentation layer.** No other event, anywhere.
- **Why (know why you are doing this):** a minimal JavaScript surface reduces attack vectors.
- **Secrets never live in the browser.** Never expose, embed, or commit them; avoid unnecessary external calls. See [`security`](./.agents/skills/security/SKILL.md).
- Five files exist in `assets/js/`, period: `app.js`, `oninput.js`, `api.js`, `storage.js`, `tour.js`.
- `document.querySelector()` only. No `getElementById`, no `getElementsByClassName`.
- No `addEventListener`. Anywhere. The `oninput` lifecycle uses direct `.oninput` property assignment.
- No `on*=` event handler attributes in markup.
- Stateless and idempotent. No module-level mutable state. No globals.
- No `innerHTML`. No inline styles. No DOM manipulation for presentation.
- API base URL declared once; only endpoint suffix varies.
- Initial load enters the `oninput` lifecycle via programmatic nav radio `.click()`.
- Shell content fetched once per runtime session.
- Console: `console.clear()` on startup and each lifecycle run. Success = minimal timestamped. Failure = verbose timestamped.
- Full ruleset: [`.agents/skills/javascript/SKILL.md`](./.agents/skills/javascript/SKILL.md).

## 6. JSON — data only

- Strings, numbers, booleans, null, arrays, objects. Nothing else.
- No HTML, no CSS, no JavaScript, no presentation hints, no layout instructions.
- Canonical page-level keys map positionally: `pageTitle` → `<h1>`, `intro` → `p:nth-of-type(1)`, `body` → `<section>`, `rows` → `<ul>`.
- Canonical shell keys: `appLogo`, `appUser`, `appLegal`, `appVersion`, `navItems[{label, suffix}]`.
- Full ruleset: [`.agents/skills/json/SKILL.md`](./.agents/skills/json/SKILL.md). C          nonical shapes: [`.agents/skills/json/references/shape.md`](./.agents/skills/json/references/shape.md).

## 7. Naming

- Names describe the **concern**, not the **implementation**.
- Files without trailing underscores are active. Files with trailing underscores are inactive.
- No symlinks for cross-file references. Text paths only.
- Skill names: lowercase letters, numbers, hyphens only. No underscores.
- Full ruleset: [`.agents/skills/naming/SKILL.md`](./.agents/skills/naming/SKILL.md).

## 8. External Service Failures — Non-Negotiable

When a configured external API or service fails (SSL errors, network failures, auth errors, rate limiting, 4xx/5xx, etc.):

- **NEVER** change the architecture to work around the failure.
- **NEVER** create local fallbacks, mock data, or substitute data sources.
- **NEVER** redirect `API_BASE_URL` or any configured endpoint from its declared remote origin to a local path.
- **STOP immediately.** Advise the user on how to resolve the external service issue directly:
  - SSL cert error → user logs into service provider account and renews/verifies the certificate.
  - Network/fetch failure → user checks service status, subscription, or provider dashboard.
  - 4xx/5xx → user inspects endpoint configuration or contacts the API provider.

Working around broken external services produces more code, obscures the real problem, violates Least Power, and permanently changes the architecture in ways the user did not request.

## 9. Project Structure

```html
<app-container>
  <app-banner></app-banner>
  <header><app-logo></app-logo><app-user></app-user></header>
  <nav><label><input type="radio" name="nav" aria-hidden="true"></label></nav>
  <main><article><h1></h1><section></section></article></main>
  <aside></aside>
  <footer><app-legal></app-legal><app-version></app-version></footer>
  <app-banner></app-banner>
</app-container>
<script type="module" src="assets/js/app.js"></script>
```

## 10. Files

- `index.html` — full DOM
- `assets/css/*.css` — active files (no trailing underscores); one concern per file
- `assets/js/{app,oninput,api,storage,tour}.js` — data-layer modules
- `assets/images/app/` — project-functional assets
- `assets/images/brand/` — brand assets (logos, marks, color-bound imagery)
- `manifest.webmanifest` — PWA manifest
- `.agents/skills/*/SKILL.md` — concern-specific rules
- `.agents/skills/*/references/*.md` — deep references and citations
- `.agents/SESSION-HANDOFF.md` — current session state

Inactive: files with trailing underscores. `docs/` and `d7460n-mcp-server/` are not part of the front-end runtime.

## 11. Abstraction Rule

Default answer: **NO**. Only the project owner authorizes abstraction, in writing, per instance. "Shorter," "DRY," "consolidation," and "brevity" are insufficient justifications. Acceptable only when no intuitive declarative understanding is lost AND explicitly approved. The straightforward declarative nature of this project is what sets it apart — preserve it.

## 12. No Dead-Ends

End-users and developers both must always have a forward path.

- **End-users** — every error state, every empty state, every blocked path includes a way out.
- **Developers** — every concept in this documentation links to deeper reference material in `.agents/skills/*/references/*.md`.

A dead end is a UX or DX defect to be fixed.

## 13. Session Continuity

- At the start of every session, read [`.agents/SESSION-HANDOFF.md`](./.agents/SESSION-HANDOFF.md) before making implementation decisions.
- Re-assert the handoff Constraint Lock before coding changes.
- If `SESSION-HANDOFF.md` conflicts with this file or any skill, STOP and ask.

## 14. Routing — Which Skill Owns This Task

| Task | Skill |
|---|---|
| Page structure, regions, custom elements | [`html`](./.agents/skills/html/SKILL.md) |
| Layout, theme, state, transitions, any UI behavior | [`css`](./.agents/skills/css/SKILL.md) |
| API call, `oninput` lifecycle, storage, startup | [`javascript`](./.agents/skills/javascript/SKILL.md) |
| Data shape, schema, content payload | [`json`](./.agents/skills/json/SKILL.md) |
| JSON-to-element rendering for data tables | [`data-flow`](./.agents/skills/data-flow/SKILL.md) |
| Naming files, tags, skills | [`naming`](./.agents/skills/naming/SKILL.md) |
| Headers, CSP, hosting | [`security`](./.agents/skills/security/SKILL.md) |
| Manifest, service worker, install behavior | [`pwa`](./.agents/skills/pwa/SKILL.md) |

If a task touches more than one concern, do each part inside its own skill.

## 15. Architecture Tests

Before any change ships, the change must pass:

1. Does this HTML change require any CSS or JS change? If yes, the air-gap is broken — fix the design.
2. Does this CSS rule require any JS, any specific data, or any class/id? If yes, fix the design.
3. Does this JS function touch the DOM for presentation? If yes, fix the design.
4. Does this JSON contain HTML, styling, or presentation hints? If yes, fix the design.

The architecture exists to make these answers always "no."
