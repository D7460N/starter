---
name: json
description: JSON rules for projects following the air-gapped, declarative-first architecture. JSON carries data only — no HTML, no CSS, no styling, no presentation hints. The JSON shape drives the UI because CSS reacts to data presence and absence in the DOM. Use whenever shaping API payloads, schemas, or any content data.
license: MIT
metadata:
  version: "1.0.0"
---

# JSON

JSON is the data layer. CSS reacts to data being there or not there. JavaScript carries the data from the network into the DOM. JSON itself contains nothing but the data.

## Only these contents are permitted in JSON

- **Strings** — content text, identifiers, ISO timestamps, URIs
- **Numbers** — measurements, counts, scores
- **Booleans** — flags
- **`null`** — explicit absence
- **Arrays** — ordered collections of the above (or of objects)
- **Objects** — keyed collections of the above

## Only these shapes are permitted

- **Object at root.** A page payload is an object whose keys map to semantic regions.
- **Arrays for list-rendered data** — only where the destination is a `<ul>` / `<ol>` / table.
- **Flat-as-possible.** Nesting is allowed only when the data has genuine hierarchy (a section that contains its own list of items). No nesting for organizational decoration.

## Forbidden in JSON

- **No HTML.** Not as strings, not as escaped markup, not as fragments. Every UI shape is HTML in the project; data is data.
- **No CSS.** No style strings, no class names (classes don't exist anyway), no inline style hints.
- **No JavaScript.** No function references, no expressions, no template strings.
- **No presentation hints.** No `"display": "block"`, no `"hidden": true` (use absence or empty value), no `"theme": "dark"` (theme is CSS, not data).
- **No layout instructions.** Layout is in CSS. JSON does not specify columns, rows, ordering of regions, or spacing.

## How CSS sees JSON

CSS does not see JSON. CSS sees the DOM that JavaScript built from the JSON. The chain is:

```
JSON  →  api.js  →  oninput.js  →  DOM elements with content  →  CSS reacts via :empty / :has() / :not(:empty)
```

This means:

- An empty JSON value produces an empty DOM element. CSS then hides or shows it via `:empty` / `:not(:empty)`.
- A missing key produces no element. CSS does not render what does not exist.
- A non-empty value produces a populated element. CSS shows it.

There is no toggle, no flag, no `"visible": true`. The data itself is the toggle.

## Naming keys

Keys map to semantic HTML or to custom element tag names via `toTagName()`. See the `naming` skill.

- Page-level keys may map positionally to canonical semantic elements: `pageTitle` → `h1`, `intro` → `p:nth-of-type(1)`, `body` → `section`.
- List-row keys become custom element tag names via `toTagName()`. A key `productName` becomes a `<product-name>` element inside a row.
- Keys never imply CSS classes (classes don't exist).

## Single source of truth

A field appears in exactly one place in the JSON. The DOM element rendered from it is the single source of truth for that field's display state. Form-state utilities like `hasUnsavedChanges()` read the DOM, not a parallel JS object.

## Shell vs. page payloads

Shell content (`header`, `nav`, `footer`, `meta`) is fetched once per runtime session from the `shell` endpoint. Page content (`home`, `about`, `products`, `events`, `contact`) is fetched per nav change. The JSON shape of each is independent — shell payloads do not contain page data and vice versa.

## Schema

A schema is an external description of permitted keys, types, and constraints for a payload. Schemas live in `.json` files alongside the data they describe. Schemas do not contain HTML, CSS, or JavaScript.

## References

- `references/shape.md` — minimal page payload, shell payload, list payload examples
- `references/forbidden.md` — examples of JSON that violate the rules and why
- `references/css-reactivity.md` — how `:empty` and `:has()` map to JSON value presence
- JSON specification: https://www.json.org/
- JSON Schema (when stricter validation is needed): https://json-schema.org/
