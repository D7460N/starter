# D7460N Architecture — Claude Code Instructions

This is a **zero-dependency, CSS-first, JAMstack-based, browser-native** starter template.
These rules are **non-negotiable**. Always fall back to these defaults.

## Accuracy & Clarification

- **ALWAYS prioritize accuracy over speed** — completing tasks correctly is ALWAYS more important than getting them done sooner.
- If there is ANY ambiguity in instructions or questions, STOP immediately, ask for clarification, and wait for a reply before proceeding.
- **NEVER GUESS.** Do not assume, infer, or improvise when instructions are unclear.
- You may NOT proceed without the clarification needed to do what is being asked.
- **ALWAYS use memory** — enable and use all available features for remembering context across sessions (e.g., memory, notepad, stored facts). Cross-session continuity is required.

## Core Constraints

- **JS == NEVER** — JS shall NEVER be used for anything unless otherwise stated
- **HTML + CSS == everything** — modern HTML and CSS must be used for all development
- **HTML == structure** — semantic elements only, no `<div>`, `<span>`, `class`, `id`, or `data-*`
- **CSS == all UI behavior** — state, heuristics, color-scheme, themes, loading states, visibility
- **Zero dependencies** — no frameworks, no bundlers, no compiled code, no npm packages
- **Single page** — one `index.html` at project root, SPA + PWA architecture
- **Layout** — CSS Grid only (never Flexbox), full-bleed Holy Grail via `<app-container>`

## Non-Negotiable Rules

1. NEVER use third-party dependencies. Third-party = any code that cannot render natively in an evergreen browser.
2. ALWAYS use modern, vanilla, W3C/WCAG-compliant, accessibility-first syntax.
3. Standards references: https://www.w3.org/TR/ and https://developer.mozilla.org/en-US/docs/Web
4. ALWAYS default to SPA navigational architecture.
5. ALWAYS default to PWA (`manifest.webmanifest`).
6. JS shall NEVER be used for anything unless otherwise stated (exception: `api.js` for CRUD data transport). Modern HTML and CSS must be used for all development.
7. CSS ALWAYS replaces JS for all functionality.
8. JS ALWAYS uses `document.querySelector('')` for targeting selectors.
9. JS ALWAYS uses `oninput` for ALL API CRUD operations (per `api.js` only).
10. JS NEVER uses user-initiated events for API CRUD operations.
11. JS NEVER uses event listeners — ever.
12. HTML ALWAYS uses `<label>` for interactive elements.
13. HTML markup ALWAYS is semantic, minimally nested, and intuitive.
14. Separation of Concerns between presentation and data layers ALWAYS maintained.
15. Principle of Least Power ALWAYS maintained.
16. CSS ALWAYS determines DOM element visibility via `:empty` and `:has()` pseudo selectors.
17. CSS ALWAYS uses modern style queries and CSS-only techniques — no hard/static values.
18. CSS ALWAYS manages light/dark mode color-scheme in `:root{}`.
19. CSS ALWAYS uses a11y selectors when possible.
20. CSS ALWAYS uses checkboxes inside `<label>`s with `role="button"` combined with `:has()`, `:not()`, `:empty` for state machines.
21. CSS ALWAYS uses radio buttons inside `<label>` with `role="button"` combined with `:has()`, `:not()`, `:empty` inside `<nav>` for global navigation.
22. HTML ALWAYS uses one single `index.html` at project root.
23. HTML ALWAYS uses full-bleed Holy Grail layout from `index.html`.
24. NEVER inline CSS or JS.
25. NEVER warn about or consider cross-browser compatibility.
26. NEVER use `<div>` or `<span>` — ALWAYS use semantic HTML equivalents that address the intent of the element.
27. NEVER nest wrapper elements for layout — ALWAYS use CSS Grid instead (e.g., `grid-template-columns` and `justify-content: space-between`).

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

## State Machine Pattern

This is intentional. NEVER replace with `<button>` or JS event handlers.

For forms:
```html
<label role="button" aria-label="Save">
  Save
  <input type="checkbox" aria-hidden="true" />
</label>
```

For navigation:
```html
<nav>
  <label role="button">
    Nav item
    <input type="radio" name="nav" aria-hidden="true" />
  </label>
</nav>
```

## File Responsibilities

- **index.html** — Complete DOM structure
- **assets/css/layout.css** — The only active CSS file; CSS Grid Holy Grail structure and all current layout
- **assets/js/api.js** — The only active JS file; contains the data layer API endpoint and all fetch/CRUD operations
- **assets/images/** — Static assets

### Ignored (inactive for now)

- **assets/data/** — Ignore completely; the data layer lives in `api.js` via its API endpoint
- **assets/js/app.js** — Inactive; ignore for now
- **assets/js/pipeline/** — Inactive; ignore for now
- **assets/css/*.css** (other than `layout.css`) — Inactive; ignore for now

## When Modifying This Project

- All UI states, including loading states, use CSS + HTML checkbox/radio state machines
- Keep JS focused on fetch/CRUD only
- Always use semantic HTML markup
- Never use `<div>`, `<span>`, `class`, `data-*`, or `id` — `<div>` and `<span>` shall NEVER be used; ALWAYS use semantic HTML equivalents that address the intent of the element
- NEVER nest wrapper elements for layout — ALWAYS use CSS Grid instead (e.g., `grid-template-columns` and `justify-content: space-between`)
- Forms go inside `<fieldset>` with schema/rules
- Custom elements generated from JSON via `toTagName()`
- Use `aria-disabled` for accessibility (styled via CSS)
- JS must be idempotent and stateless — no global state or side effects
- Reuse existing functions before creating new ones
- NEVER create new coding patterns — all patterns are already established; use what exists
- Adding code increases entropy — NEVER add new code or files unless the user explicitly states to
- Follow user instructions in detail — no more, no less
- Use cutting-edge experimental CSS without regard for browser support
