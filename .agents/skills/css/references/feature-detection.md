# Feature Detection

`@supports` for property feature detection. `@supports at-rule()` for at-rule feature detection. No JavaScript Modernizr.

## Only this property feature-detection pattern

```css
@supports (display: grid) {
  /* the project assumes grid; this is a sanity check or a fallback path */
}

@supports not (display: grid) {
  /* legacy fallback (rarely used in this architecture, which targets modern browsers) */
}
```

`@supports` lets CSS itself check whether the browser understands a property and value combination. No JavaScript polyfill loader needed.

## At-rule feature detection

```css
@supports at-rule(@starting-style) {
  /* CSS for browsers that support @starting-style */
}

@supports at-rule(@view-transition) {
  /* CSS for browsers that support view transitions */
}
```

`@supports at-rule(@keyword)` checks whether the browser understands a particular at-rule. Useful when an at-rule is the new feature being detected.

## Conditional `@import`

```css
@import "view-transitions.css" supports(at-rule(@view-transition));
```

Only loads the file when the browser supports the feature.

## What feature detection never does

- Never use JavaScript Modernizr for CSS features
- Never use computed-style probing (`getComputedStyle()` heuristics)
- Never assume a feature exists — declare the supported path inside `@supports`

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `@supports` (feature queries) — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
- `@supports at-rule()` — **Limited availability / experimental (Chromium only)** — https://developer.mozilla.org/en-US/docs/Web/CSS/@supports#at-rule
- `@view-transition` (the detected feature in the example) — **Limited availability** (no Firefox) — https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition

**AutoCSS Architecture:** serves native `@supports` feature detection — the CSS-only alternative to JS capability probing. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `@supports`: https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
- MDN `@supports at-rule()`: https://developer.mozilla.org/en-US/docs/Web/CSS/@supports#at-rule
- W3C CSS Conditional Rules Module Level 5: https://www.w3.org/TR/css-conditional-5/
