# Lifecycle (data-flow specific)

The fetch-to-DOM sequence for a list-rendered page (a data table). Other features have their own patterns.

## Sequence

```
1. Nav radio receives input event (user click or programmatic)
2. oninput.js handler reads suffix (e.g., 'products')
3. api.js fetches `${API_BASE}/products`
4. api.js parses JSON: { pageTitle, rows: [...] }
5. oninput.js writes pageTitle to <h1>
6. oninput.js clears <ul> via clearFieldset
7. for each row in rows:
   a. li = createElement('li')
   b. for each [key, value] in entries(row):
      tag = toTagName(key)
      el = createElement(tag)
      el.textContent = String(value)
      li.appendChild(el)
   c. ul.appendChild(li)
8. CSS reacts: ul:not(:empty) shows; loading spinner :has(h1:empty) clears
```

Step 6 is the only place clearing happens. Idempotency comes from "always clear before re-render" rather than diffing.

## The render function

```javascript
import { toTagName } from './toTagName.js';

const PAGE_FIELD_MAP = {
  pageTitle: 'main article h1',
  intro: 'main article p:nth-of-type(1)',
};

export function renderPage(data) {
  // page-level fields go to fixed positional slots
  for (const [key, selector] of Object.entries(PAGE_FIELD_MAP)) {
    if (key in data) {
      const el = document.querySelector(selector);
      if (el) el.textContent = String(data[key]);
    }
  }

  // list rows go to <ul>
  if (Array.isArray(data.rows)) {
    const ul = document.querySelector('main article section ul');
    if (ul) {
      ul.replaceChildren();
      for (const row of data.rows) {
        ul.appendChild(buildRow(row));
      }
    }
  }
}

function buildRow(row) {
  const li = document.createElement('li');
  for (const [key, value] of Object.entries(row)) {
    const tag = toTagName(key);
    const el = document.createElement(tag);
    el.textContent = value == null ? '' : String(value);
    li.appendChild(el);
  }
  return li;
}
```

## Why no diffing

The architecture renders the whole list every time. No virtual DOM, no diff algorithm. The browser is fast enough for the data sizes a typical SPA shows. When data sizes grow past that, the answer is server-side pagination (smaller payload), not client-side diffing.

## What this lifecycle never does

- Never builds HTML strings (`innerHTML`)
- Never reads `class`, `id`, or `data-*`
- Never mutates a row's fields after render — re-render replaces the whole row
- Never uses a framework reconciler

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `Element.replaceChildren()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren
- `:has()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has

**AutoCSS Architecture:** serves the fetch-to-DOM render sequence for a list-rendered page. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `Element.replaceChildren()`: https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren
- MDN `Element.textContent`: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
- MDN `Document.createElement()`: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
