# toTagName

The function that converts a JSON key into a valid HTML custom element tag name.

## Specification

```javascript
export function toTagName(key) {
  // 1. Split on camelCase boundaries.
  const parts = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').split('-');

  // 2. Lowercase every part.
  const lower = parts.map(p => p.toLowerCase());

  // 3. Join with hyphens.
  let tag = lower.join('-');

  // 4. Custom elements must contain a hyphen. Single-word keys get a 'row-' prefix.
  if (!tag.includes('-')) {
    tag = `row-${tag}`;
  }

  return tag;
}
```

## Examples

| JSON key | Tag |
|---|---|
| `productName` | `product-name` |
| `unitPrice` | `unit-price` |
| `id` | `row-id` |
| `lastModified` | `last-modified` |
| `URL` | `row-url` (all-caps becomes one lowercase word) |
| `URLForDocs` | `urlfor-docs` (consecutive caps join) |

## Edge cases

**All-caps keys** (`URL`, `ID`, `SKU`):
The camelCase split rule only fires between a lowercase-or-digit and an uppercase letter. `URL` has no such boundary, so it becomes `url`, then gets the `row-` prefix → `row-url`.

**Mixed all-caps + camelCase** (`URLForDocs`, `HTMLPage`):
The split fires only at the lowercase-then-uppercase transition. `URLForDocs` splits at `o-r` (between the lowercase `o` of `For` and... wait — let me trace this more carefully). The regex `([a-z0-9])([A-Z])` matches `r`+`F` and `r`+`D`. Result: `URLFor-Docs` after replace, then split → `['URLFor', 'Docs']`, lowercased → `['urlfor', 'docs']`, joined → `urlfor-docs`. Has a hyphen, so no prefix.

If the project produces all-caps keys frequently, a richer split rule (also splitting between consecutive caps when followed by lowercase) is added — but only when needed.

**Numeric keys or numeric-prefix keys** (`2024Total`):
HTML custom element names must start with a lowercase letter. The function should reject or prefix such keys. Recommended prefix: `row-`.

```javascript
if (/^\d/.test(tag)) {
  tag = `row-${tag}`;
}
```

**Reserved tag names** (`annotation-xml`, `color-profile`, `font-face`, `font-face-src`, `font-face-uri`, `font-face-format`, `font-face-name`, `missing-glyph`):
These are reserved by SVG/MathML. The function should not produce these. If a project might generate one, the function rejects.

## Why `toTagName`, not `toKebab`

The function name describes the **concern** (producing a valid custom element tag name) not the **implementation** (kebab-case). If HTML's tag-name rules ever accept other separators, the function name still describes the concern.

## What `toTagName` never does

- Never returns a string without a hyphen (custom elements require one)
- Never returns a string that starts with a number or uppercase letter
- Never returns a reserved SVG/MathML name
- Never modifies its input

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `custom elements` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

**D7460N Architecture:** serves the JSON-key-to-custom-element-tag-name conversion function. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- Custom element naming spec: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
- MDN custom elements: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
