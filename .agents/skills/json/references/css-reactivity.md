# CSS Reactivity to JSON

How CSS reacts to data presence and absence in the DOM. The chain: empty JSON value → empty DOM element → `:empty` matches → CSS hides. Non-empty JSON value → populated DOM element → `:not(:empty)` matches → CSS shows.

## The reaction map

| JSON value | DOM result | CSS state |
|---|---|---|
| `"some text"` | element with text content | `:not(:empty)` matches |
| `""` | element with no text | `:empty` matches |
| `null` | element with no text (`textContent` of `null` becomes empty string) | `:empty` matches |
| missing key | no element rendered | the element selector doesn't match anything |
| `[]` (empty array) | container element with no `<li>` children | `:empty` matches the container |
| `[item, item]` | container with `<li>` children | `:has(> li)` matches |

## Concrete CSS

```css
@layer state {
  /* hide regions that have no content yet */
  app-logo,
  app-user,
  app-legal,
  app-version {
    display: none;
  }

  app-logo:not(:empty),
  app-user:not(:empty),
  app-legal:not(:empty),
  app-version:not(:empty) {
    display: block;
  }

  /* hide the H1 until the page title arrives */
  main article h1 {
    visibility: hidden;
  }

  main article h1:not(:empty) {
    visibility: visible;
  }

  /* loading spinner while H1 is empty */
  :root:has(main article h1:empty)::before {
    /* spinner styles */
  }

  /* empty-state for the data table */
  main article section ul:empty::before {
    content: "No data";
    /* style as needed */
  }
}
```

The spinner appears automatically when the H1 is empty (data not yet arrived). It disappears automatically when JS injects the page title. No JS toggle.

## `:has()` for parent reaction to child state

```css
@layer state {
  /* make the article expand only when there's a populated section in it */
  main article:has(section:not(:empty)) {
    grid-template-rows: auto 1fr;
  }
}
```

The parent reacts to child content. Useful when the layout depends on whether content arrived.

## Why this pattern beats JavaScript-driven visibility

- **No flag in the data.** No `"visible": true` field that can drift out of sync with the actual content.
- **No JS toggle.** No `element.style.display = "none"` that becomes a maintenance burden.
- **Naturally responsive.** As content streams in (different keys arriving at different times), each region appears as soon as its data lands.
- **Declarative.** The visibility rule is colocated with the rest of the styling, in a CSS file.

## Patterns to avoid

```css
/* WRONG — relies on a class that this architecture doesn't have */
.is-loaded { display: block; }
```

```css
/* WRONG — relies on a data attribute that this architecture forbids */
[data-state="loaded"] { display: block; }
```

```css
/* RIGHT — reads the actual presence of data */
:not(:empty) { display: block; }
```

## Reference

- MDN `:empty`: https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
- MDN `:not()`: https://developer.mozilla.org/en-US/docs/Web/CSS/:not
- MDN `:has()`: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- W3C Selectors Level 4: https://www.w3.org/TR/selectors-4/
