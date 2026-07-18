# Anchor Positioning

Position an element relative to another element via `anchor-name` and `position-anchor`. Replaces JavaScript positioning libraries (Popper.js, Floating UI) for tooltips, popovers, and contextual menus.

## Only this anchor pattern

```css
@layer state {
  .trigger {
    anchor-name: --tip;
  }

  .tooltip {
    position-anchor: --tip;
    inset-block-start: anchor(end);
    inset-inline-start: anchor(start);
  }
}
```

The trigger declares an `anchor-name`. The dependent element declares a `position-anchor` referencing that name. CSS keeps the dependent positioned correctly as the trigger moves or resizes.

## Position-relative-to-anchor functions

- `anchor(start)` / `anchor(end)` — start or end edge of the anchor
- `anchor(center)` — center of the anchor
- `anchor(top)`, `anchor(bottom)`, `anchor(left)`, `anchor(right)` — physical edges
- `anchor-size(width)` / `anchor-size(height)` — the anchor's dimensions

Use logical (`start` / `end`) instead of physical (`left` / `right`) when possible.

## Avoid going off-screen

```css
@layer state {
  .tooltip {
    position-anchor: --tip;
    position-try-fallbacks: flip-block, flip-inline;
  }
}
```

`position-try-fallbacks` provides alternate positions when the primary would clip off-screen. The browser tries each in order until one fits.

## What anchor positioning never does

- Never use JavaScript libraries for positioning (Popper.js, Floating UI)
- Never use `getBoundingClientRect()` to measure for positioning
- Never use absolute positioning with magic-number offsets

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `anchor-name` / `position-anchor` — **Baseline 2026 (Newly available)** — https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name
- `anchor()` — **Baseline 2026 (Newly available)** — https://developer.mozilla.org/en-US/docs/Web/CSS/anchor
- `anchor-size()` — **Baseline 2026 (Newly available)** — https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-size
- `position-try-fallbacks` — **Baseline 2026 (Newly available)** — https://developer.mozilla.org/en-US/docs/Web/CSS/position-try-fallbacks

**AutoCSS Architecture:** serves anchor positioning for hover/popover content (keeps it on-screen); no JS positioning libraries. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN anchor positioning: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
- MDN `anchor-name`: https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name
- MDN `position-anchor`: https://developer.mozilla.org/en-US/docs/Web/CSS/position-anchor
- MDN `position-try-fallbacks`: https://developer.mozilla.org/en-US/docs/Web/CSS/position-try-fallbacks
- W3C CSS Anchor Positioning Module Level 1: https://www.w3.org/TR/css-anchor-position-1/
