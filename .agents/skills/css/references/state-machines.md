# State Machines

CSS reads native input state via `:has()` and `:checked`. No JavaScript. The pattern works for every interactive element that is not intrinsically interactive.

## The form-action pattern

A button-like control:

```html
<label role="button" aria-label="Save">
  Save
  <input type="checkbox" aria-hidden="true" />
</label>
```

CSS reacts:

```css
@layer state {
  label[role="button"]:has(input:checked) {
    /* the active visual state */
  }
}
```

The hidden checkbox holds the state. The label provides the accessible name and role. CSS reads the state via `:has()`.

## The navigation pattern

Mutually-exclusive radio inputs inside `<nav>`:

```html
<nav>
  <label>
    <input type="radio" name="nav" aria-hidden="true" />
  </label>
  <label>
    <input type="radio" name="nav" aria-hidden="true" />
  </label>
</nav>
```

CSS reacts:

```css
@layer state {
  nav label:has(input:checked) {
    /* the active nav item */
    opacity: 1;
  }

  nav label {
    opacity: 0.6;
  }
}
```

The radio name (`name="nav"`) groups the inputs so only one is checked at a time. The browser handles exclusivity.

## Hide the input visually, keep the state

```css
@layer state {
  /* Visually hide the input but keep it in the layout and the tab order, so the
     control stays keyboard-operable (Tab to reach it, Space / arrow keys to
     toggle). This is the accepted a11y technique — see the a11y skill's
     `.visually-hidden` pattern. */
  input[aria-hidden="true"] {
    position: absolute;
    inline-size: 0.0625rem;
    block-size: 0.0625rem;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}
```

The input is hidden visually but **remains focusable** — the label provides the visible control while the real radio/checkbox still receives keyboard focus and holds `:checked`. Do **not** use `display: none` here: it removes the input from the tab order, so a keyboard or AT user can no longer toggle the state.

> **Open a11y nuance to resolve:** `aria-hidden="true"` on a *focusable* input is itself an ARIA anti-pattern (a focusable element should not be hidden from the accessibility tree). The label carries `role="button"` + `aria-label`. Whether the input should keep `aria-hidden`, or the accessible name/role should move entirely to the label with the input exposed, is a pattern-level decision worth confirming — flagged, not silently changed.

## Why this pattern instead of a button

- The state is in the DOM (`:checked`), not in JavaScript.
- CSS reads it directly via `:has()` — no event listener needed.
- The browser handles keyboard accessibility (Tab, Space, Enter) intrinsically.
- The pattern survives JavaScript being disabled.

## Multiple-state elements

Use multiple checkboxes inside the same label for multi-state controls. Or radios with more than two options.

```html
<label role="button">
  <input type="radio" name="mode" value="view" aria-hidden="true" checked />
  <input type="radio" name="mode" value="edit" aria-hidden="true" />
  <input type="radio" name="mode" value="delete" aria-hidden="true" />
  Mode
</label>
```

CSS reads each via `:has(input[value="..."]:checked)`.

## The mobile-nav menu (compact form)

When the container is narrow, nav items collapse behind a checkbox toggle:

```css
@layer state {
  @container nav (max-width: 25rem) {
    nav > label:has(> input[type="checkbox"]) {
      /* the menu button */
    }

    nav:has(> label:last-of-type > input[type="checkbox"]:checked) > label:not(:last-of-type) {
      /* the open-menu state — show the items */
    }
  }
}
```

The `:has()` selector at the parent level reads the checked state of a descendant input.

## What state machines never do

- Never use `<button>` with a JS click handler for non-intrinsic interactivity
- Never store state in `data-*` (forbidden) or in JS variables
- Never use `addEventListener` to track the state
- Never animate state via JS — see the `transitions` reference

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `:has()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- `:checked` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/:checked
- `:not()` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/:not
- `:empty` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
- `@container` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/@container

**AutoCSS Architecture:** serves CSS-replaces-JS UI behavior; state machines (radio/checkbox in label + :has()); browser-native accessibility. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `:has()`: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- MDN `:checked`: https://developer.mozilla.org/en-US/docs/Web/CSS/:checked
- W3C Selectors Level 4: https://www.w3.org/TR/selectors-4/
- ARIA `role="button"`: https://www.w3.org/TR/wai-aria-1.2/#button
