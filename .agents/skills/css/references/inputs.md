# Inputs

Form-control reset to inherit typography. Validation display via `:user-invalid` and `:user-valid`. No JavaScript-driven validation classes.

## Only this inputs reset

```css
@layer inputs {
  :where(button, input, select, textarea) {
    font-family: inherit;
    font-size: inherit;
    letter-spacing: inherit;
    word-spacing: inherit;
    color: currentColor;
  }
}
```

`:where()` has zero specificity — consumer styles always win without `!important`. The reset stops form controls from looking different from surrounding text.

## Validation display

```css
@layer inputs {
  input:user-invalid {
    border-color: oklch(60% 0.2 25);
  }

  input:user-valid {
    border-color: oklch(60% 0.2 145);
  }
}
```

`:user-invalid` and `:user-valid` activate only after the user has interacted with the field. `:invalid` activates immediately on page load — forbidden because it shows errors on empty required fields before the user has typed.

## Auto-growing textarea

```css
@layer inputs {
  textarea {
    field-sizing: content;
    min-height: 3lh;
  }
}
```

`field-sizing: content` makes the textarea size to its content. `min-height: 3lh` (line-height units) sets a minimum of three lines.

## Customizable selects

```css
@layer inputs {
  select,
  select::picker(select) {
    appearance: base-select;
  }

  select option:checked {
    background: var(--accent);
  }
}
```

`appearance: base-select` unlocks full CSS control of the native `<select>` without replacing it with a JS library.

## Native control color

```css
@layer inputs {
  :root {
    accent-color: var(--accent);
  }
}
```

`accent-color` styles checkboxes, radios, range sliders, and progress bars to match the brand. No control replacement needed. (Already declared in themes.)

## What inputs never do

- Never use `:invalid` directly (use `:user-invalid` instead)
- Never replace native form controls with JS libraries
- Never rely on `.touched` or `.dirty` classes (classes don't exist; CSS reads native validity)
- Never declare `font-*` per input — inherit from `:root`

## Reference

- MDN `:user-invalid`: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid
- MDN `:user-valid`: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid
- MDN `field-sizing`: https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing
- MDN `appearance: base-select`: https://developer.mozilla.org/en-US/docs/Web/CSS/appearance
- W3C CSS Basic User Interface Module Level 4: https://www.w3.org/TR/css-ui-4/
