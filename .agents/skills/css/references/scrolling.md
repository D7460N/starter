# Scrolling

Scrollbars styled per-element via `scrollbar-color` and `scrollbar-width`. Hover-revealed scrollbars on long-form scrolling regions. `scrollbar-gutter: stable` to prevent layout shift.

## Only these scrollable elements

The architecture limits scrollable elements to:

- `<section>` — the main content scroll
- `<ul>` and `<ol>` — list-row scroll (data tables)
- `<textarea>` — native textarea
- The body itself — the document scroll

No other element receives `overflow: auto` or `overflow: scroll`.

## Scrollbar styling per-element

```css
@layer state {
  nav details section,
  main article ul[aria-hidden="true"] + ul,
  aside form fieldset {
    scrollbar-width: thin;
    scrollbar-color: var(--accent) transparent;
    transition: scrollbar-color 0.5s ease;
  }

  nav details section:not(:hover),
  main article ul[aria-hidden="true"] + ul:not(:hover),
  aside form fieldset:not(:hover) {
    scrollbar-color: transparent transparent;
  }
}
```

The scrollbar appears only when the element is hovered. The transition keeps it from popping in.

```css
@layer state {
  textarea {
    scrollbar-width: thin;
  }
}
```

## Stable scrollbar gutter on body

```css
@layer reset {
  body {
    scrollbar-gutter: stable;
  }
}
```

`scrollbar-gutter: stable` reserves the scrollbar's space in the layout regardless of whether it's currently shown. Prevents the page from shifting when content grows past the viewport.

## Prevent scroll chaining

```css
@layer state {
  .modal-content {
    overflow-y: auto;
    overscroll-behavior: contain;
  }
}
```

When the inner scroll reaches its end, scroll does not chain to the page behind. No JavaScript event prevention.

## What scrolling never does

- Never use `::-webkit-scrollbar` (non-standard, WebKit-only)
- Never apply scroll to `<div>`, `<article>`, `<header>`, etc. — only to the four permitted elements
- Never use JavaScript to react to scroll position (use `scroll-state` container queries — see containers.md)

## Reference

- MDN `scrollbar-color`: https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color
- MDN `scrollbar-width`: https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-width
- MDN `scrollbar-gutter`: https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter
- MDN `overscroll-behavior`: https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
- W3C CSS Scrollbars Module Level 1: https://www.w3.org/TR/css-scrollbars-1/
