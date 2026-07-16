# Layout

CSS Grid only. Holy Grail layout from `<app-container>`. Auto-grid for responsive regions. Container queries for component responsiveness.

## Only Grid is used

```css
@layer layout {
  :where(app-container, header, main, article, section, aside, footer) {
    display: grid;
  }
}
```

Flexbox is forbidden. Grid is two-dimensional, intrinsic-sizing-aware, and aligns nested grids via `subgrid`.

## The Holy Grail shell

```css
@layer layout {
  app-container {
    height: 100dvh;
    grid-template-rows: auto auto auto 1fr auto auto auto;
    align-items: start;
  }
}
```

Seven rows from top to bottom: optional banner, header, nav, main (`1fr` — the only flexible row), aside, footer, optional banner. Height is `100dvh` (dynamic viewport height — accounts for mobile address bar).

## Auto-grid for regions

For regions that hold a variable number of children:

```css
@layer layout {
  header,
  footer {
    grid-template-columns: repeat(auto-fit, minmax(min(6rem, 100%), 1fr));
  }
}
```

`repeat(auto-fit, minmax(min(SIZE, 100%), 1fr))` is the canonical auto-grid pattern. It produces as many columns as fit at minimum `SIZE`, never overflowing, never requiring breakpoints.

## Container queries

Components respond to their container, not the viewport:

```css
@layer layout {
  nav {
    container-type: inline-size;
    container-name: nav;
  }

  @container nav (max-width: 25rem) {
    nav > label {
      /* compact nav for narrow containers */
    }
  }
}
```

Static viewport breakpoints (`@media (min-width: 768px)`) are forbidden.

## Visibility from data presence

Layout regions are always present in the HTML. They show or hide based on whether they contain data:

```css
@layer layout {
  app-logo,
  app-user,
  app-legal,
  app-version,
  h1,
  p {
    display: none;
  }

  app-logo:not(:empty),
  app-user:not(:empty),
  app-legal:not(:empty),
  app-version:not(:empty),
  h1:not(:empty),
  p:not(:empty) {
    display: block;
  }
}
```

`:empty` and `:not(:empty)` react automatically as JavaScript injects content. No JS toggle needed.

## Scrollable containers

Only `<section>`, `<ul>`, `<ol>` receive overflow:

```css
@layer layout {
  app-container,
  main,
  article {
    overflow: hidden;
  }

  section {
    overflow: auto;
  }
}
```

This pattern produces intrinsically sticky headers (header is in the non-scrolling parent; only the section scrolls).

## Subgrid for aligned nested grids

> **Future — not in use yet.** Subgrid is the intended mechanism for aligning
> data-table cells to their header columns. The snippet below uses `.parent` /
> `.child-grid` classes purely as a generic demo — D7460N runtime CSS never uses
> classes, so this does not apply to any live element. Kept here as a reminder for
> the table-alignment effort. Tracked in AutoCSS board issue #99.

When inner grids must align with parent tracks:

```css
@layer layout {
  .parent {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .child-grid {
    display: grid;
    grid-template-columns: subgrid;
  }
}
```

Inner grid inherits parent tracks. No track duplication.

## What layout never does

- Never Flexbox (`display: flex`, `display: inline-flex`, `flex-direction`, `flex-wrap`, `flex-flow`)
- Never wrapper elements added to HTML for layout
- Never static viewport breakpoints (`@media (min-width: 768px)`)
- Never magic numbers (use `clamp`, `minmax`, container query units, custom properties)
- Never `!important`

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `display: grid` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/display
- `minmax()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/minmax
- `min()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/min
- `subgrid` — **Baseline Widely available** (interoperable 2023-09-12; crossed 30-month threshold 2026-03) — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid
- `container-type` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/container-type
- `@container` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/@container
- `:has()` — **Baseline Widely available** (interoperable 2023-12-19; crossed 30-month threshold 2026-06) — https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- `:where()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/:where
- `:not()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/:not
- `:empty` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
- Dynamic viewport units (`dvh` etc.) — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/length

**D7460N Architecture:** serves Grid-only Holy Grail layout, breakpoint-free intrinsic sizing (`minmax`/`min`/auto-fit), container-driven component responsiveness, and CSS-replaces-JS visibility keyed to data presence (`:empty`/`:not(:empty)`/`:has()`) — upholding Least Power, Separation of Concerns, zero dependencies, and no wrapper elements. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN CSS Grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- MDN container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- MDN subgrid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid
- W3C Grid Level 2: https://www.w3.org/TR/css-grid-2/
- W3C Container Queries: https://www.w3.org/TR/css-contain-3/
