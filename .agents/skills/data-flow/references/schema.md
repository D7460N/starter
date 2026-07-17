# Schema

The schema is an external `.json` file describing permitted keys, types, and rendering order for a payload. Schema lives separate from data. The schema is JSON; it does not contain HTML, CSS, or JavaScript.

## Where schema lives

`assets/json/schema/` contains one schema per payload type:

```
assets/json/schema/
  shell.json
  home.json
  about.json
  products.json
  events.json
  contact.json
```

## Schema shape

The minimal schema is an ordered list of permitted keys:

```json
[
  "id",
  "productName",
  "unitPrice",
  "lastModified"
]
```

This schema says: "a row in this payload may contain these four keys, in this preferred render order."

## Richer schema (when needed)

For schemas that need types, requirements, or constraints:

```json
{
  "fields": [
    { "name": "id", "type": "string", "required": true },
    { "name": "productName", "type": "string", "required": true },
    { "name": "unitPrice", "type": "number", "required": true, "min": 0 },
    { "name": "lastModified", "type": "string", "format": "date-time", "required": false }
  ]
}
```

The richer form is JSON Schema-compatible (https://json-schema.org/). Use it when validation matters; use the minimal form when the keys alone are enough.

## How the renderer uses the schema

`oninput.js` reads the schema for the current payload type, then iterates the schema's order when building each row:

```javascript
import { toTagName } from './toTagName.js';

export async function buildRowFromSchema(row, schemaKeys) {
  const li = document.createElement('li');
  for (const key of schemaKeys) {
    const tag = toTagName(key);
    const el = document.createElement(tag);
    const value = key in row ? row[key] : '';
    el.textContent = value == null ? '' : String(value);
    li.appendChild(el);
  }
  return li;
}
```

The schema controls render order. The data provides values. Keys present in the data but absent from the schema are ignored. Keys present in the schema but absent from the data render as empty elements (CSS hides them via `:empty`).

## Why schema is separate from data

- **Stability of UI.** The data can change shape (extra fields added by the API) without disturbing the rendered table — the schema controls what's shown.
- **Round-trip safety.** A field can be added to the API, then progressively rolled out to the UI by adding it to the schema.
- **Air-gap of concerns.** The schema is a UI-rendering decision, not an API decision.

## Schema versioning

When the schema changes incompatibly, version it:

```
assets/json/schema/products.v2.json
```

The `oninput.js` resolver picks the version it expects. Old data still rendered by the old schema if needed.

## What schema never contains

- HTML
- CSS class names
- JavaScript expressions
- Style hints
- Conditional logic (use code in `oninput.js` when truly dynamic; keep schema declarative)

## Baseline & support

_Checked against MDN as of 2026-07-16._

- No version-sensitive web-platform features are referenced here — everything used is **Baseline Widely available**.

**D7460N Architecture:** serves the external schema file format that drives render order and permitted keys. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- JSON Schema: https://json-schema.org/
- JSON.org: https://www.json.org/
