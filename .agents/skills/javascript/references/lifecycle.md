# Lifecycle

The single `oninput` lifecycle that drives all CRUD operations.

## The full chain

```
user clicks nav radio (or programmatic .click() on initial load)
  ↓
input event fires on the radio
  ↓
oninput.js handler reads the radio's index/value
  ↓
api.js fetches the matching endpoint suffix
  ↓
api.js parses JSON
  ↓
oninput.js routes the data to the page region
  ↓
oninput.js mutates DOM via createElement + textContent
  ↓
CSS reacts via :empty / :has() / :not(:empty)
  ↓
content visible
```

## Initial load

```javascript
// app.js
import { initLifecycle } from './oninput.js';

console.clear();
initLifecycle();

// initLifecycle then programmatically clicks the nav radio that maps to the current page,
// entering the same lifecycle path as a user-initiated nav change.
```

There is one entry point, not two. The boot path and the user-action path are identical.

## Binding `oninput` (no `addEventListener`)

```javascript
// oninput.js
import { fetchPage } from './api.js';

export function initLifecycle() {
  const radios = document.querySelectorAll('nav input[type="radio"]');
  radios.forEach(radio => {
    radio.oninput = handleNavChange;
  });

  // enter lifecycle via programmatic click
  const initial = document.querySelector('nav input[type="radio"]:checked')
    ?? document.querySelector('nav input[type="radio"]');
  initial?.click();
}

async function handleNavChange(event) {
  console.clear();
  const radio = event.target;
  const suffix = resolveSuffix(radio);
  try {
    const data = await fetchPage(suffix);
    inject(data);
    console.log(`[${new Date().toISOString()}] OK ${suffix}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] FAIL ${suffix}`, err);
  }
}
```

`radio.oninput = handleNavChange` is property assignment, not `addEventListener`. Idempotent — assigning a second time replaces the first, doesn't stack.

## Shell vs. page

```javascript
// fetched once per session
const shell = await fetchShell();
injectShell(shell);

// fetched on every nav change
const page = await fetchPage(suffix);
injectPage(page);
```

The shell handler is called from `initLifecycle` once. The page handler is called on every nav change.

## Idempotency

A second call to `initLifecycle()` produces no change in observable behavior. A second call to a page handler with the same data produces no observable change. Functions are pure; mutations target the same DOM nodes consistently.

## What the lifecycle never does

- Never registers more than one event handler per input
- Never calls `addEventListener`
- Never tracks state in module-level variables (besides constants)
- Never uses `setTimeout`, `setInterval`, or `requestAnimationFrame` for lifecycle progression
- Never branches on click vs. programmatic-click — both enter through the `input` event

## Reference

- MDN `input` event: https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event
- MDN `HTMLElement.click()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
- MDN event handler properties: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events#using_onevent_properties
