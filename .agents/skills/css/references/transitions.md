# Transitions

Universal transitions driven by custom properties. `prefers-reduced-motion` honored.

## Only this universal transition setup

```css
@layer transitions {
  :root {
    --transition-property: visibility, opacity, display, transform, background, background-color, border-color, color, min-width;
    --transition-timing-function: ease-in;
    --transition-duration: 500ms;

    scroll-behavior: smooth;
    interpolate-size: allow-keywords;
  }

  * {
    transition-property: var(--transition-property);
    transition-timing-function: var(--transition-timing-function);
    transition-duration: var(--transition-duration);
    transition-behavior: allow-discrete;
  }
}
```

The universal `*` selector applies the same transition to everything. Per-element overrides come later in the cascade if needed.

`transition-behavior: allow-discrete` enables transitions on discrete properties like `display: none → display: block` and `visibility` — this is what fades same-document (tab) content as it is injected.
`interpolate-size: allow-keywords` enables transitions to/from `auto`, `min-content`, etc.

## Reduced motion is honored

```css
@layer transitions {
  @media (prefers-reduced-motion) {
    * {
      transition-duration: 0ms;
    }
  }
}
```

When the user has enabled reduced motion in their OS, transitions become instant.

## Initial-load fade

```css
@layer transitions {
  @starting-style {
    * {
      visibility: hidden;
      opacity: 0;
    }
  }
}
```

`@starting-style` defines the "before" state. The browser transitions from this to the actual computed value on first paint.

## What transitions never do

- Never animate via JavaScript when CSS can do it
- Never use `setInterval` or `requestAnimationFrame` for UI animation
- Never use `transition: all` (over-broad — list properties explicitly)
- Never use timing values that magic-number out of `:root` custom properties
- Never use `@view-transition` — it fires only on cross-document navigations, so it does nothing in this SPA. (Add it only if the app ever navigates between documents.)

## Reference

- MDN `transition`: https://developer.mozilla.org/en-US/docs/Web/CSS/transition
- MDN `@starting-style`: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
