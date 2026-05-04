---
name: data-flow
description: The JSON-to-custom-element rendering pipeline used for data tables and list-rendered content. Defines toTagName key conversion, the lifecycle from fetch to DOM, and the strict scope (data tables only — other features have their own patterns). Use when rendering tabular or list data from JSON, never for layout, never for static content.
license: MIT
metadata:
  version: "1.0.0"
---

# Data Flow

The pipeline that turns a JSON object into a populated set of DOM elements. Used for **data tables and list-rendered content only**. Other features have their own patterns and do not use this pipeline.

## Scope

This pipeline applies to:

- Data tables rendered as `<ul>` / `<li>` rows
- Form fieldsets populated from an API response
- Any structurally repeating content driven by an API

This pipeline does not apply to:

- Static layout regions (HTML provides them, CSS styles them)
- Theme tokens (CSS owns)
- Navigation behavior (CSS state machines own)
- Any feature with its own pattern documented in its own skill

If a feature has its own pattern in its own skill, that pattern wins.

## Why `<ul>` / `<li>` for data tables, not `<table>`

Data tables are a primary surface in this architecture — government work especially, where users interact with tabular data daily and have strong preferences about how they see it. The choice of `<ul>` / `<li>` over `<table>` is deliberate and produces several wins at once.

**Accessibility for keyboard and screen readers.** `<ul>` / `<li>` markup is intrinsically navigable by keyboard and read clearly by screen readers without needing role overrides, ARIA scaffolding, or accessibility plugins. `<table>` markup, by contrast, often loses screen-reader accessibility once styling, sticky headers, virtualization, or interactive cells are added — recovering it requires layered ARIA and JS.

**Semantically meaningful parent/child relationships.** A list of rows is, semantically, a list. The data is a collection of items; each item is a record. `<ul>` / `<li>` says exactly that. `<table>` implies a two-dimensional layout — rows × columns as a presentational grid — which couples the data shape to a single rendering. Using a list keeps the data's nature separate from how it's currently displayed.

**Multiple view modes from the same markup.** Because the markup is a list of items, CSS can render it in different shapes without changing the DOM:

- **List view** — one row per visible line, columns aligned via subgrid
- **Card view** — each `<li>` displayed as a card, columns laid out per-card
- **Other views** as needed (gallery, compact, dense, expanded)

The user picks the view; CSS reacts. No DOM rebuild, no JS template swap. `<table>` markup cannot do this without restructuring the DOM.

**End-user customization is a first-class design priority.** Users have spent careers looking at their data. They have preferences. They earn the right to see it the way they want. The architecture treats this as a feature, not an edge case — which means the markup needs to support it intrinsically. `<ul>` / `<li>` does. `<table>` does not.

**CSS subgrid for column alignment.** Now cross-browser baseline, `subgrid` lets each `<li>` inherit its parent `<ul>`'s column tracks so values align across rows the way table columns do — without using `<table>`. The list keeps its semantic and accessibility advantages; the columns line up exactly. (Pattern in `references/lifecycle.md`; full-column subgrid example to be added once the surface is researched and validated.)

**Future zen-mode (full-screen) view.** A planned, consistent feature across the architecture: any section the user is working in can be expanded to full-screen — not as a modal overlay but as a true zen view of that section. `<ul>` / `<li>` data tables are amenable to this without restructuring; they expand and reflow naturally inside the new viewport. (When implemented, lives under `css/references/`.)

## The pipeline

```
1. fetch JSON          (api.js)
2. parse to object     (api.js)
3. for each row:       (oninput.js)
   a. for each key in row:
      - tag = toTagName(key)
      - element = document.createElement(tag)
      - element.textContent = row[key]
      - row container appends element
4. row container appends to <ul>
5. CSS reacts via :empty / :has() / :not(:empty)
```

Step 3 is the only DOM mutation. It is idempotent: the row container is cleared via `clearFieldset` before re-render.

## `toTagName(key)` — the key-to-tag rule

A JSON key becomes a custom element tag name via `toTagName()`. The function:

1. Splits the key on camelCase boundaries (`productName` → `product`, `Name`).
2. Lowercases each part.
3. Joins with hyphens (`product-name`).
4. Prepends a namespace if none exists, to satisfy the custom-element hyphen requirement (`row-product-name` if the key is a single word).
5. Returns the tag name.

Examples:

| JSON key | Tag |
|---|---|
| `productName` | `<product-name>` |
| `unitPrice` | `<unit-price>` |
| `id` | `<row-id>` (single-word keys get a `row-` prefix) |
| `lastModified` | `<last-modified>` |

Custom element tag names always contain a hyphen — this is an HTML spec requirement, not a stylistic choice.

The function is named `toTagName`, not `toKebab`. The name describes the concern (producing a valid tag name), not the implementation (kebab-case).

## Schema-driven visibility and ordering

The order of keys in JSON does not determine the DOM render order. The order comes from a schema (external `.json` file) that lists the permitted keys for a payload type along with their preferred order.

```
schema example
[
  "id",
  "productName",
  "unitPrice",
  "lastModified"
]
```

Visibility is not a flag in the schema. Visibility is the data presence — an empty value renders an empty element which CSS hides via `:empty`.

## Positional mapping for page-level fields

Page-level fields map to canonical semantic positions, not to custom elements:

| JSON key | DOM target |
|---|---|
| `pageTitle` | `main article h1` |
| `intro` | `main article p:nth-of-type(1)` |
| `body` | `main article section` |

This mapping is fixed by the architecture and lives in `oninput.js`. New page-level fields require updating both the schema and the mapping.

## Card pattern reminder

Cards exist only in plural as `ul` / `li`. Each card row is a `<li>` whose children are `toTagName`-generated custom elements carrying the per-row data. A single, identity-bearing item uses `<article>` instead.

## What `data-flow` never does

- Never injects HTML strings (`innerHTML = '...'`)
- Never reads `class`, `id`, or `data-*` (those don't exist)
- Never writes inline styles
- Never sets visibility via JS (CSS does that)
- Never re-renders the shell (shell fetched once per session)

## References

- `references/totagname.md` — the function specification with edge cases (single words, all-caps, numerals)
- `references/lifecycle.md` — fetch → parse → render sequence in detail
- `references/schema.md` — schema file format and where it lives
- `references/positional-mapping.md` — page-level field-to-element table
- Custom elements spec: https://html.spec.whatwg.org/multipage/custom-elements.html
- 
