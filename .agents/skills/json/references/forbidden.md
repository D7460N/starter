# Forbidden in JSON

Each example shows what the architecture rejects and why. The replacement column shows the architecture's correct path.

## HTML in JSON — rejected

```json
{
  "intro": "<p>Welcome to our <strong>amazing</strong> site!</p>"
}
```

**Why rejected:** HTML in data couples the data layer to the markup layer. CSS owns presentation; data is data.

**Replacement:**
```json
{
  "intro": "Welcome to our amazing site!"
}
```
The `<strong>` formatting, if needed, comes from a CSS rule on the surrounding semantic element. If the project has genuinely-rich body content, store it as Markdown, not HTML, and process to text when injecting (or use `<details>` and other semantic elements that don't require HTML in the data).

## Style hints in JSON — rejected

```json
{
  "headerColor": "blue",
  "isDarkMode": true
}
```

**Why rejected:** Theme decisions belong in CSS. JSON data does not name colors.

**Replacement:** Themes live in `themes.css` via `oklch` and `light-dark()`. If a per-record visual variation is genuinely data-driven (e.g., a status that maps to a color), store the *status*, not the color:

```json
{
  "status": "active"
}
```

Then CSS maps the status to a color:

```css
@layer state {
  [data-status="active"] { /* forbidden — data-* is banned */ }

  /* instead, use a semantic element or attribute that already exists */
  output:valid { color: oklch(70% 0.18 145); }
}
```

In this architecture, status that affects styling typically maps to a custom element name or to native validity state.

## Visibility flags — rejected

```json
{
  "showHeader": true,
  "hidden": false
}
```

**Why rejected:** Visibility is data presence in this architecture. Empty values produce empty elements which CSS hides via `:empty`. A flag is redundant and a second source of truth.

**Replacement:** Omit the key entirely (no element rendered) or use an empty value:
```json
{
  "header": ""
}
```

CSS:
```css
@layer state {
  app-header:empty { display: none; }
}
```

## Layout instructions — rejected

```json
{
  "columns": 3,
  "rowHeight": "200px"
}
```

**Why rejected:** Layout is in CSS. Data does not specify columns or sizes.

**Replacement:** CSS Grid auto-grid pattern:
```css
@layer layout {
  ul {
    grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
  }
}
```

The number of columns adapts to container width automatically.

## Class names — rejected

```json
{
  "className": "btn-primary"
}
```

**Why rejected:** Classes don't exist in this architecture's HTML.

**Replacement:** Use the semantic element and a state attribute that the CSS reads via `:has()`:
```html
<label role="button">
  Save
  <input type="checkbox" aria-hidden="true" />
</label>
```

## JavaScript expressions — rejected

```json
{
  "onClick": "() => alert('hi')",
  "computed": "function() { return Date.now() }"
}
```

**Why rejected:** JSON is data, not code. Functions cannot be serialized to JSON.

**Replacement:** Store the *intent*, not the code. If the data needs to trigger an action, the action is wired in `oninput.js` as part of the lifecycle.

## DOM references — rejected

```json
{
  "target": "#header"
}
```

**Why rejected:** IDs don't exist in this architecture's HTML, and the data layer should not know which DOM element receives which value. The positional mapping in `data-flow` (`pageTitle` → `main article h1`) lives in `oninput.js`, not in the data.

## What JSON looks like instead

```json
{
  "pageTitle": "Products",
  "intro": "Browse our catalog.",
  "rows": [
    {
      "id": "p-001",
      "productName": "Widget",
      "unitPrice": 9.99,
      "lastModified": "2026-01-15T08:00:00Z"
    }
  ]
}
```

Pure data. The shape is the contract. The architecture's other layers know how to render it.

## Reference

- JSON.org: https://www.json.org/
- ECMA-404 The JSON Data Interchange Standard: https://www.ecma-international.org/publications-and-standards/standards/ecma-404/
