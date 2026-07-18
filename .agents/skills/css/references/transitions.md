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

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `transition` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/transition
- `transition-behavior` (`allow-discrete`) — **Baseline Newly available** (interoperable 2024-08-06) — https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
- `@starting-style` — **Baseline Newly available** (interoperable 2024-08-06) — https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- `interpolate-size` (`allow-keywords`) — **Limited availability (not Baseline)** — experimental; no Firefox or Safari support — https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size
- `prefers-reduced-motion` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- `scroll-behavior` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
- Custom properties (`--*` / `var()`) — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/--*

**AutoCSS Architecture:** serves CSS-replaces-JS UI motion (state/tab/init fades with no `setInterval`/`requestAnimationFrame`), single-source-of-truth timing via custom properties, and baked-in accessibility through `prefers-reduced-motion` — upholding Least Power and zero dependencies. `interpolate-size` is experimental: keep it as progressive enhancement (auto-keyword size transitions degrade gracefully where unsupported). Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `transition`: https://developer.mozilla.org/en-US/docs/Web/CSS/transition
- MDN `@starting-style`: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
