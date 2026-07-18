# Starting Style

`@starting-style` defines the "before" state of an element so transitions run on first paint without JavaScript.

## Only this entry-animation pattern

```css
@layer transitions {
  article {
    transition: opacity 0.3s, transform 0.3s;

    @starting-style {
      opacity: 0;
      transform: translateY(10px);
    }
  }
}
```

`@starting-style` declares the values the element starts with. The browser transitions from those values to the final computed values on the very first paint.

## Why this replaces JavaScript

The old workaround was a class added in JavaScript after first paint — `setTimeout(() => element.classList.add('visible'), 0)` — which forced a reflow and was fragile. `@starting-style` is the native, declarative replacement.

## Universal first-paint fade

```css
@starting-style {
  * {
    visibility: hidden;
    opacity: 0;
  }
}
```

Everything fades in on first paint. Combined with the universal transition setup in `transitions.md`, this produces a smooth project-wide load.

## What starting-style never does

- Never add a JavaScript class to trigger an entry animation
- Never use `setTimeout` or `requestAnimationFrame` to delay a class addition

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `@starting-style` — **Baseline 2024 (Newly available, Aug 2024)** — https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- `transition` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/transition

**AutoCSS Architecture:** serves @starting-style fade-in on load; CSS-replaces-JS (no setTimeout class toggles). Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `@starting-style`: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- W3C CSS Transitions Level 2: https://www.w3.org/TR/css-transitions-2/
