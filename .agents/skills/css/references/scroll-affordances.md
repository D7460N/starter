# Scroll Affordances

Top and bottom scroll-shadow indicators that fade in only when more content exists in that direction. Driven by `@property` opacity transitions and `scroll-state` container queries.

## Only this scroll-shadow pattern

```css
@layer state {
  @property --_scroll-shadow-color-1-opacity {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 0%;
  }

  @property --_scroll-shadow-color-2-opacity {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 0%;
  }

  .scroll-container {
    container-type: scroll-state size;
    overflow: auto;
    overscroll-behavior: contain;
    display: grid;

    > * {
      grid-area: 1 / 1;
    }

    &::after {
      content: "";
      grid-area: 1 / 1;
      display: block;
      position: sticky;
      inset-block-start: 0;
      block-size: 100cqh;
      inline-size: 100cqw;
      pointer-events: none;
      background: var(--_shadow-top), var(--_shadow-bottom);
      transition:
        --_scroll-shadow-color-1-opacity 0.5s ease,
        --_scroll-shadow-color-2-opacity 0.5s ease;

      --_scroll-shadow-color-1: oklch(from var(--surface-1) 10% calc(c * 2) h / var(--_scroll-shadow-color-1-opacity));
      --_scroll-shadow-color-2: oklch(from var(--surface-1) 10% calc(c * 2) h / var(--_scroll-shadow-color-2-opacity));

      --_shadow-top: linear-gradient(to bottom, var(--_scroll-shadow-color-1), transparent 20px);
      --_shadow-bottom: linear-gradient(to top, var(--_scroll-shadow-color-2), transparent 20px);
    }
  }

  @container scroll-state(scrollable: top) {
    .scroll-container::after {
      --_scroll-shadow-color-1-opacity: 25%;
    }
  }

  @container scroll-state(scrollable: bottom) {
    .scroll-container::after {
      --_scroll-shadow-color-2-opacity: 25%;
    }
  }
}
```

(In this architecture's HTML, `.scroll-container` would be a semantic element such as `<section>` or `<ul>`. The class is shown for portability.)

## How it works

- The container is `scroll-state size` so its descendants and pseudo-elements can query both scroll position and dimensions.
- A sticky `::after` pseudo-element overlays the container with two layered gradients — one at the top, one at the bottom.
- `@property` declares two opacity values as typed `<percentage>` so they can be transitioned smoothly (untyped custom properties cannot animate).
- Two `@container scroll-state(scrollable: top)` and `(scrollable: bottom)` queries flip the opacities on or off based on whether more content exists above or below the visible area.
- The shadow colors are derived from the surface color via `oklch(from var(--surface-1) ... )` so the shadow stays harmonious with the theme.

## What scroll affordances never do

- Never use JavaScript scroll listeners
- Never use untyped custom properties for animated values (use `@property`)
- Never hardcode shadow colors (derive from theme via `oklch(from ...)`)

## Reference

- MDN `@property`: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
- MDN `scroll-state` container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/@container#scroll-state_queries
- MDN container query units (`cqh`, `cqw`): https://developer.mozilla.org/en-US/docs/Web/CSS/length#cqh
- W3C CSS Properties and Values API Level 1: https://www.w3.org/TR/css-properties-values-api-1/
