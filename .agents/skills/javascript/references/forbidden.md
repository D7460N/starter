# Forbidden Patterns

Every pattern listed here is prohibited. The reasoning attaches each prohibition to a concern owned by another layer — CSS owns UI, HTML owns structure, JSON owns data shape.

## Event handling

| Forbidden | Why |
|---|---|
| `element.addEventListener(...)` | Stacks handlers, requires explicit cleanup. The `oninput` property assignment is idempotent and matches the architecture's single-event lifecycle. |
| `element.onclick = ...` | UI behavior. Belongs to CSS (state machines via `:has()` and `:checked`). |
| `element.onchange = ...` | Same as `onclick`. |
| `element.onsubmit = ...` | Form submission goes through the `oninput` lifecycle, not a separate event. |
| `on*=` HTML attributes (in markup) | No JavaScript in markup ever. |

## DOM access

| Forbidden | Use instead |
|---|---|
| `document.getElementById('...')` | `document.querySelector('...')` |
| `document.getElementsByClassName('...')` | `document.querySelector('...')` (and there are no classes anyway) |
| `document.getElementsByTagName('...')` | `document.querySelector('...')` |
| jQuery, `$()`, any third-party DOM library | Native DOM API |

## DOM mutation

| Forbidden | Why |
|---|---|
| `element.innerHTML = '<div>...'` | Injects HTML strings. Use `createElement` + `textContent`. |
| `element.outerHTML = ...` | Same problem. |
| `element.style.X = ...` | Inline styles are CSS-in-JS. CSS owns styling. |
| `element.classList.add('...')` | Classes don't exist in this architecture. State lives in native attributes. |
| `element.setAttribute('class', '...')` | Same. |
| `element.setAttribute('data-X', '...')` | `data-*` doesn't exist in this architecture. |

The two permitted utilities — `removeInlineStyles` and `clearFieldset` — exist for unavoidable browser default cleanup. No others.

## State

| Forbidden | Use instead |
|---|---|
| Module-level mutable state (`let foo = 0` at top level) | Stateless pure functions |
| `window.foo = ...` | Don't store global state |
| Mutable singletons | Pass values explicitly |

## Code generation

| Forbidden | Why |
|---|---|
| `eval(...)` | Code injection vector. CSP forbids it. |
| `new Function(...)` | Same. |
| Dynamic `import()` of user-supplied URLs | Same. |
| Template literals that build code strings | Same. |

## Timing

| Forbidden | Use instead |
|---|---|
| `setInterval` for animation | CSS `@keyframes` |
| `setTimeout` to delay a class addition | CSS `@starting-style` and `transition-behavior: allow-discrete` |
| `requestAnimationFrame` for UI animation | CSS animation |

`setTimeout` is permitted for genuine timing needs unrelated to UI (e.g., debouncing an API request) but is rare in practice.

## Side effects

| Forbidden | Why |
|---|---|
| Functions that read AND write the same global variable | Not stateless |
| Functions that mutate their input arguments | Not idempotent |
| Functions whose behavior changes based on call count | Not idempotent |

## Reference

- The full reasoning chain for each prohibition lives in the relevant skill (html, css, javascript)
- The Agent Skills standard's `allowed-tools` field can be used to enforce some of these in tooling: https://agentskills.io/specification#allowed-tools
