# Radii

Inner and outer radius math via custom properties. The outer radius is always the inner radius plus the padding — preserves the visual relationship between nested rounded elements.

## Only this radius math

```css
@layer themes {
  :root {
    --inner-radius: 0.5rem;
    --padding: 1rem;
    --outer-radius: calc(var(--inner-radius) + var(--padding));
  }
}
```

Whenever the inner radius or padding changes, the outer radius recalculates automatically.

## Application

```css
@layer themes {
  section {
    padding: var(--padding);
    border-radius: var(--outer-radius);
  }

  article > section {
    border-radius: var(--inner-radius);
  }
}
```

The outer container has the larger radius; nested content keeps the proportional inner radius.

## Why this matters

If the outer radius equals the inner radius, the nested element looks pinched against the outer rounded edge. The `inner + padding = outer` rule keeps the corners visually parallel — the inner curve sits inside the outer curve at a constant offset.

## Beyond rounded — corner shapes

```css
@layer themes {
  .squircle {
    border-radius: 2em;
    corner-shape: squircle;
  }
}
```

`corner-shape` provides named non-circular shapes (squircle, scoop, notch) without `clip-path` or SVG masks.

## What radii never do

- Never hardcode the outer radius — derive it from `inner-radius + padding`
- Never use different radius units for related elements (use the same custom property)

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `border-radius` + `calc()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius
- `corner-shape` (`squircle`, `scoop`, `notch`, …) — **Limited availability / experimental (not Baseline)** — https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape

**D7460N Architecture:** serves derive values (inner + padding = outer); no magic numbers. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `border-radius`: https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius
- MDN `corner-shape`: https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape
- W3C CSS Borders and Box Decorations Level 4: https://www.w3.org/TR/css-borders-4/
