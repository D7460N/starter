# Positional Mapping

Page-level JSON keys map to fixed semantic DOM positions. The mapping is declared once in `oninput.js` and applies to every page payload.

## The canonical mapping

| JSON key | DOM target | Notes |
|---|---|---|
| `pageTitle` | `main article h1` | The page's H1 |
| `intro` | `main article p:nth-of-type(1)` | First paragraph after H1 |
| `body` | `main article section` | The longer prose section, as plain text |
| `rows` | `main article section ul` | List-rendered data; each row is an `<li>` (see lifecycle.md) |

## Shell-level mapping

Shell payloads target regions outside `<main>`:

| JSON key | DOM target |
|---|---|
| `appLogo` | `header app-logo` |
| `appUser` | `header app-user` |
| `appLegal` | `footer app-legal` |
| `appVersion` | `footer app-version` |
| `navItems` | `nav` (each item becomes a `<label>` + radio `<input>`) |

## Why positional, not class-based

Class-based mapping requires HTML to declare which element gets which value via `class="page-title"`. Classes are forbidden in this architecture. The semantic position (`main article h1`) is unambiguous because the shell is canonical — there is exactly one `main article h1` in the page.

## When the canonical position would be ambiguous

If a future page genuinely has two equivalent slots (e.g., two `<p>` elements where order matters), use `:nth-of-type(N)`:

```
intro    → main article p:nth-of-type(1)
addendum → main article p:nth-of-type(2)
```

This still avoids classes. The selector remains semantic and stable.

## Adding a new page-level field

1. Add the key to the schema.
2. Add an entry to `PAGE_FIELD_MAP` in `oninput.js`.
3. Update the affected payloads to include the new key.

The HTML shell does not change (already has the regions). The CSS does not change (already styles the regions). Only the data layer and the renderer mapping are touched.

## What positional mapping never does

- Never reads from `class`, `id`, or `data-*` (forbidden)
- Never targets a region by inserting a new wrapper element
- Never has two keys mapping to the same target without explicit positional disambiguation

## Reference

- MDN `:nth-of-type()`: https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-of-type
- MDN selector list: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors
- W3C Selectors Level 4: https://www.w3.org/TR/selectors-4/
