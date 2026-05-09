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
  [aria-hidden="true"] {
    display: none;
  }
}
```

The input is removed from the visual tree but the form state still works. `aria-hidden="true"` removes it from the accessibility tree, so screen readers announce only the label.

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

## Reference

- MDN `:has()`: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- MDN `:checked`: https://developer.mozilla.org/en-US/docs/Web/CSS/:checked
- W3C Selectors Level 4: https://www.w3.org/TR/selectors-4/
- ARIA `role="button"`: https://www.w3.org/TR/wai-aria-1.2/#button
