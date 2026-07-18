# Loading

CSS-only loading indicator that activates when the H1 is empty (data not yet arrived). No JS toggle, no spinner element in the markup.

## Only this loading pattern

```css
@layer loading {
  :root:has(article h1:empty)::before {
    content: "";
    position: fixed;
    inset: 0;
    inline-size: 3rem;
    block-size: 3rem;
    margin: auto;
    border: 0.35rem solid color-mix(in srgb, currentColor 25%, transparent);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    pointer-events: none;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Accessibility: never spin for users who request reduced motion.
     Replace the rotating ring with static text via `content`. */
  @media (prefers-reduced-motion: reduce) {
    :root:has(article h1:empty)::before {
      content: "Loading . . .";
      inline-size: auto;
      block-size: auto;
      border: none;
      border-radius: 0;
      animation: none;
    }
  }
}
```

The spinner is a `::before` pseudo-element on `:root`. It exists only when `article h1:empty` matches — that is, when data has not arrived. As soon as JS injects the page title, the H1 is no longer empty and the spinner disappears automatically.

Under `prefers-reduced-motion: reduce` the animation is dropped and the same pseudo-element shows static `content: "Loading . . ."` text instead — the loading state stays visible without any motion.

## Why this works

- The spinner element is not in the HTML — it's a pseudo-element conjured by CSS.
- The activation condition is data presence, not a flag.
- No JS code adds or removes a `loading` class (classes don't exist).
- `pointer-events: none` keeps the spinner from blocking the user once content does appear.

## Per-section loading (optional)

For sections that load independently:

```css
@layer loading {
  section:empty::before {
    content: "Loading...";
    /* style as needed */
  }
}
```

`section:empty` matches when the section has no rendered children.

## What loading never does

- Never add a `<div class="spinner">` to the HTML
- Never add a `loading` class to anything
- Never use `display: none` toggled by JS
- Never use a JavaScript timer to hide the spinner — let the data drive it

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `:empty` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
- `:has()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- `::before` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/::before
- `@keyframes` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes
- `color-mix()` — **Baseline Widely available (May 2023)** — https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
- `prefers-reduced-motion` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

**AutoCSS Architecture:** serves CSS loading states from data presence; accessibility baked-in. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `:empty`: https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
- MDN `:has()`: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- MDN `::before`: https://developer.mozilla.org/en-US/docs/Web/CSS/::before
- MDN `@keyframes`: https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes
