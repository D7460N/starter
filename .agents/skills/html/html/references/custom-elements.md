# Custom Elements

Custom elements are not a free escape hatch. They exist in exactly two finite categories. If a use case fits neither, the design is flawed — re-engineer until a semantic HTML element fits its **main semantic purpose**.

## Semantic-first rule

The first choice is always a standard semantic HTML element used for its main semantic purpose. A semantic element is never repurposed for a meaning it does not own. `<aside>` is for tangentially-related content, not for "anything off to the side." `<article>` is for self-contained, independently-distributable content, not for "any card-like block."

If no semantic element's main purpose fits, stop. Walk back up to the parent element. Re-engineer the design until the markup expresses the actual meaning. The architecture does not bend.

## The two categories of custom elements

### 1. D7460N standard layout elements

A finite, curated set authored as part of the D7460N standard. They exist because the layout has shapes that are not addressable by any standard semantic element AND that are not data-derived. They replace what would otherwise have been `<div>` or `<span>`.

The full set:

- `<app-container>` — grid root
- `<app-banner>` — optional notification slot (top and bottom)
- `<app-logo>` — brand mark slot
- `<app-user>` — user info slot
- `<app-legal>` — legal text slot
- `<app-version>` — version display slot

This list is closed. Adding to it is a D7460N standard change, not a per-project decision. If a project genuinely needs a new layout custom element, surface the need to the user — do not invent one.

### 2. Data-table row elements

Generated at runtime from JSON keys via `toTagName()`. Used inside `<ul>` / `<li>` for list-rendered tabular content. Examples: `<product-name>`, `<unit-price>`, `<row-id>`. See the `data-flow` skill.

These are not authored by hand. They appear in the DOM because the data shape produced them. They disappear when the data shape changes. They never appear outside data-tables.

## Why custom elements rather than divs

The D7460N standard is **div-less and span-less**. `<div>` and `<span>` are presentational sinks — they make markup styleable without making it meaningful. The architecture rejects them. Custom elements in the two permitted categories give CSS specific, semantic selectors that name what the element is for.

This is harder than reaching for `<div>`. Nothing worth doing is easy. The hardness is the point — it forces the design to express meaning at every level instead of papering over weak structure with style.

## Naming rules

The HTML spec requires custom element names to:

- Contain at least one hyphen (`-`)
- Start with a lowercase ASCII letter (`a-z`)
- Use only lowercase letters, digits, and hyphens for the rest of the name
- Not be one of the reserved names (`annotation-xml`, `color-profile`, `font-face`, `font-face-src`, `font-face-uri`, `font-face-format`, `font-face-name`, `missing-glyph`)

`<app-banner>` satisfies all rules.
`<appbanner>` is invalid (no hyphen).
`<App-Banner>` is invalid (uppercase).
`<2col-grid>` is invalid (starts with digit).

For data-row elements, the `naming` skill's `toTagName()` rule produces names that already satisfy these rules.

## No JavaScript extension

Custom elements are **not** registered with `customElements.define(...)`. They are plain unknown elements (`HTMLUnknownElement`). The browser renders them as inline-by-default; CSS gives them their actual layout.

Why no extension:

- No JS behavior is needed — CSS handles UI, JS handles data.
- Registering them adds runtime cost and a JS dependency.
- The architecture works with disabled JavaScript for the static shell.

If a future need genuinely requires extension (e.g., shadow DOM encapsulation), surface it to the user before adding.

## CSS targets them like any element

```css
@layer layout {
  app-container {
    display: grid;
  }

  app-logo,
  app-user {
    display: none;
  }

  app-logo:not(:empty),
  app-user:not(:empty) {
    display: block;
  }
}
```

## What custom elements never do

- Never appear outside the two permitted categories
- Never carry behavior of their own
- Never carry attributes like `class` or `id` (those are forbidden architecture-wide)
- Never have inline styles
- Never get registered with `customElements.define()` in the default architecture
- Never substitute for a re-engineering of weak design

## Reference

- HTML spec — custom element naming: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
- MDN `customElements`: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry
- MDN custom elements guide: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
- 
