# Layers

`@layer` sets cascade priority by order — no specificity wars, no `!important`.
(`@layer` is Baseline: available across browsers since March 2022.)

## Every rule lives in a named layer

All D7460N CSS is wrapped in a `@layer` named for its concern — one layer per file.

```css
@layer layout {
  app-container {
    display: grid;
    grid-template-rows: auto auto auto 1fr auto auto auto;
  }
}
```

A normal (non-`!important`) rule left **outside** any layer overrides every layered rule, so nothing is left unlayered — that is what keeps our styles deliberately low priority (see the interop note below).

## Layer order = load order (no master list)

There is **no master `@layer` order statement**. A layer takes its priority from **where its name first appears**, and in this project that is the **`<link>` order in `index.html`**. The load order *is* the cascade (the "C" in CSS), used on purpose: link the most foundational file first (e.g. `reset`) so it is **lowest priority**, and each later `<link>` layers on top.

A master order list would just be a second source of truth to keep in sync with the link order — extra complexity for no gain — so it is omitted. (Re-declaring an existing layer name later only appends rules to it; it does not change the order already established by first appearance.)

## How to override

- **Within a layer** — be more specific to the actual element.
- **Across layers** — put the override in a file that links later.
- **Never** `!important`.

## Why no `!important`

```css
/* No !important — ever.
   Normal layered styles are deliberately LOW priority: a consuming system's own
   unlayered styles then win by default (interop). !important throws that away —
   important declarations beat the whole normal cascade, important *layered*
   styles beat important *unlayered* ones, and among important layers the order
   is INVERTED. So !important defeats the entire point of layers.
   We win priority by layer/load order, never by escalation. */
```

## What layers never do

- Never use `!important`
- Never leave a rule outside a layer
- Never declare a master layer-order list — the `<link>` order is the order

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `@layer` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/@layer

**D7460N Architecture:** serves cascade control without `!important` and deliberate low-priority interop (a consuming system's unlayered styles win by default) — upholding Separation of Concerns, Least Power, and zero-dependency, browser-native styling. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `@layer`: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
- W3C CSS Cascading and Inheritance Level 5: https://www.w3.org/TR/css-cascade-5/
