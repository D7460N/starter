# Containers

Container queries replace media queries for component-level responsiveness. Style queries respond to custom property values. Scroll-state queries respond to scroll position.

## Size container queries

The component declares itself a container, then descendants respond to its size:

```css
@layer layout {
  nav {
    container-type: inline-size;
    container-name: nav;
  }

  @container nav (max-width: 25rem) {
    nav > label {
      /* compact nav */
    }
  }
}
```

The `nav` is the container. The `@container` block applies when the container is at most 25rem wide. The component's behavior is independent of viewport size — it adapts to whatever container it sits in.

## Style queries

Respond to a custom property's value:

```css
@layer state {
  /* Style queries need no container-type — every element is a style-query
     container by default. The queried custom property (--progress) is read
     from the nearest ancestor that sets it. */
  @container style(--progress > 75%) {
    .bar { background: oklch(70% 0.18 145); }
  }

  @container style(--progress > 25%) and style(--progress <= 75%) {
    .bar { background: oklch(75% 0.18 90); }
  }
}
```

Range comparisons (`>`, `<`, `<=`, `>=`, `=`) avoid stacked discrete blocks. The range form compares resolved values numerically, so `--progress` must hold a numeric value (e.g. a `<percentage>`); the plain form `style(--x: value)` compares against the computed value instead.

## Scroll-state queries

Respond to whether the container is stuck, snapped, or scrollable:

```css
@layer state {
  .header-wrap {
    container-type: scroll-state;
  }

  @container scroll-state(stuck: top) {
    .header {
      box-shadow: 0 2px 8px color-mix(in srgb, currentColor 10%, transparent);
      backdrop-filter: blur(12px);
    }
  }
}
```

The header gets a shadow when it becomes sticky. No JS scroll listener.

## What containers never do

- Never use viewport `@media` for component-scoped responsiveness (containers do that)
- Never use static `min-width` / `max-width` breakpoints
- Never read scroll position via JavaScript when scroll-state queries cover the case

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `@container` (size + style queries) — **Baseline Widely available (Feb 2023)** — https://developer.mozilla.org/en-US/docs/Web/CSS/@container
- `container-type` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/container-type
- `container-type: scroll-state` + `scroll-state()` queries — **Limited availability / experimental (Chromium only)** — https://developer.mozilla.org/en-US/docs/Web/CSS/@container#scroll-state_queries

**D7460N Architecture:** serves container queries replace media queries; intrinsic sizing (no static breakpoints). Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- MDN style queries: https://developer.mozilla.org/en-US/docs/Web/CSS/@container#style_queries
- MDN scroll-state queries: https://developer.mozilla.org/en-US/docs/Web/CSS/@container#scroll-state_queries
- W3C CSS Containment Module Level 3: https://www.w3.org/TR/css-contain-3/
