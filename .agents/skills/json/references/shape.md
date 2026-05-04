# Shape

Canonical payload shapes for shell, page, and list-rendered data. No HTML. No styling. No presentation hints.

## Shell payload

Fetched once per session. Populates the layout regions outside `<main>`.

```json
{
  "appLogo": "Project Name",
  "appUser": "username@example.org",
  "appLegal": "© 2026 Project",
  "appVersion": "v1.0.0",
  "navItems": [
    { "label": "Home", "suffix": "home" },
    { "label": "About", "suffix": "about" },
    { "label": "Products", "suffix": "products" },
    { "label": "Events", "suffix": "events" },
    { "label": "Contact", "suffix": "contact" }
  ]
}
```

Top-level keys map to layout regions positionally. The architecture's positional mapping (in the `data-flow` skill) defines which key goes to which DOM element.

## Page payload — single content

Fetched on each nav change for content-only pages.

```json
{
  "pageTitle": "About",
  "intro": "A brief paragraph introducing the page.",
  "body": "The longer-form prose that fills the section."
}
```

`pageTitle` → `main article h1`
`intro` → `main article p:nth-of-type(1)`
`body` → `main article section`

## Page payload — list-rendered

For pages whose primary content is a list of rows (a data table).

```json
{
  "pageTitle": "Products",
  "rows": [
    {
      "id": "p-001",
      "productName": "Widget",
      "unitPrice": 9.99,
      "lastModified": "2026-01-15T08:00:00Z"
    },
    {
      "id": "p-002",
      "productName": "Gadget",
      "unitPrice": 14.50,
      "lastModified": "2026-02-03T11:30:00Z"
    }
  ]
}
```

The list keys (`id`, `productName`, `unitPrice`, `lastModified`) become custom element tag names via `toTagName()` — see the `data-flow` skill.

## Empty values

Empty strings, `null`, missing keys, and absent rows are all valid. CSS reacts:

```css
@layer state {
  app-user:empty {
    display: none;
  }

  ul:empty {
    /* possibly show a "no data" pseudo-element */
  }
}
```

## What payloads never contain

- HTML strings
- Style hints (`"display": "block"`, `"theme": "dark"`)
- Layout instructions (`"columns": 3`)
- Class names
- IDs (page-element identifiers — natural keys like `id` are fine for data identity)
- JavaScript expressions
- Functions
- DOM references

## Reference

- JSON.org spec: https://www.json.org/
- ECMA-404: https://www.ecma-international.org/publications-and-standards/standards/ecma-404/
