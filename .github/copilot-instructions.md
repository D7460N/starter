# D7460N Architecture — Copilot Instructions

This is a **zero-dependency, CSS-first, JAMstack-based, browser-native** starter template.  
These rules are **non-negotiable**. Always fall back to these defaults.

## Core Constraints

- **HTML == structure** — semantic elements only, no `<div>`, `<span>`, `class`, `id`, or `data-*`
- **CSS == all UI behavior** — state, heuristics, color-scheme, themes, loading states, visibility
- **JS == CRUD data transport only** — `fetch`, inject, nothing else
- **Zero dependencies** — no frameworks, no bundlers, no compiled code, no npm packages
- **Single page** — one `index.html` at project root, SPA + PWA architecture
- **Layout** — CSS Grid only (never Flexbox), full-bleed Holy Grail via `<app-container>`

## Non-Negotiable Rules

1. NEVER use third-party dependencies. Third-party = any code that cannot render natively in an evergreen browser.
2. ALWAYS use modern, vanilla, W3C/WCAG-compliant, accessibility-first syntax.
3. Standards references: https://www.w3.org/TR/ and https://developer.mozilla.org/en-US/docs/Web
4. ALWAYS default to SPA navigational architecture.
5. ALWAYS default to PWA (`manifest.webmanifest`).
6. CSS ALWAYS replaces JS for all UI functionality EXCEPT API calls for CRUD operations.
7. JS is ALWAYS limited to API calls for CRUD operations only.
8. JS ALWAYS uses `document.querySelector('')` for targeting selectors.
9. JS ALWAYS uses `oninput` for ALL API CRUD operations.
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
- **assets/css/** — Modular CSS: layout, a11y, themes, reset, typography, scrollbars, transitions
- **assets/js/app.js** — Data transport entry point
- **assets/js/api.js** — Fetch/CRUD operations
- **assets/js/pipeline/** — Numbered pipeline stages for data processing
- **assets/data/** — JSON data files (decoupled from presentation)
- **assets/images/** — Static assets

## CSS Files (single-purpose, like JS utilities)

- `a11y.css` — Accessibility styles
- `layout.css` — CSS Grid Holy Grail structure
- `reset.css` — Browser normalization
- `fonts.css` — Font loading
- `themes.css` — Color-scheme, variables
- `typography.css` — Fluid type, overflow, behavior
- `scrollbars.css` — Custom scrollbar styling
- `transitions.css` — Motion and transitions
- `radii.css` — Border radius tokens

## When Modifying This Project

- All UI states, including loading states, use CSS + HTML checkbox/radio state machines
- Keep JS focused on fetch/CRUD only
- Always use semantic HTML markup
- Never use `<div>`, `<span>`, `class`, `data-*`, or `id`
- Forms go inside `<fieldset>` with schema/rules
- Custom elements generated from JSON via `toTagName()`
- Use `aria-disabled` for accessibility (styled via CSS)
- JS must be idempotent and stateless — no global state or side effects
- Reuse existing functions before creating new ones
- Use cutting-edge experimental CSS without regard for browser support
