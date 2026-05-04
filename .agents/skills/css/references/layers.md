# Layers

`@layer` controls cascade order without specificity wars or `!important`.

## Only this layer order is used

Declared once at the project root, before any other rules:

```css
@layer reset, fonts, layout, typography, themes, transitions, inputs, media, state, loading;
```

Everything in the project is wrapped in one of those layers. A rule outside any layer wins over a rule inside any layer — that is forbidden, so every rule lives inside a layer.

## How to write a rule

```css
@layer layout {
  app-container {
    display: grid;
    grid-template-rows: auto auto auto 1fr auto auto auto;
  }
}
```

The layer name describes the concern. Grouping is by concern, not by file.

## How to override

When a later rule needs to win:

- **Within the same layer** — increase specificity by being more specific to the actual element.
- **Across layers** — put the override in a layer declared later in the order list.
- **Never** use `!important` to win.

## Precedence summary

1. Layered rules in declared order — last layer wins.
2. Unlayered rules win over layered rules. (We forbid unlayered rules to avoid this.)
3. `!important` wins over everything. (Forbidden.)

## What layers never do

- Never use `!important` inside a layer
- Never put a rule outside a layer
- Never reorder layers per file (the order list is declared once)

## Reference

- MDN @layer: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
- W3C CSS Cascading and Inheritance Level 5: https://www.w3.org/TR/css-cascade-5/
