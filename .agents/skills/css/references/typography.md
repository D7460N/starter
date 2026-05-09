# Typography

Fluid sizing via `clamp()`. Balance for headings, pretty for body. No static font sizes.

## Only fluid sizing

```css
@layer typography {
  :root {
    --font-family: 'Oxanium', sans-serif;
    --font-size: clamp(1rem, 1.3cqi, 1.3rem);
    --line-height: 1.5;
    --letter-spacing: 0.05rem;

    font-family: var(--font-family);
    font-size: var(--font-size);
    line-height: var(--line-height);
    letter-spacing: var(--letter-spacing);
  }
}
```

`clamp(MIN, PREFERRED, MAX)` produces a fluid size that scales with the container while respecting bounds. `cqi` (container query inline-size unit) ties scaling to the container, not the viewport.

Static font sizes (`font-size: 16px`) are forbidden.

## Heading hierarchy via fluid scale

```css
@layer typography {
  :is(h1, h2, h3, h4) {
    font-family: 'Oxanium-SemiBold', sans-serif;
    color: var(--text-1);
    padding: 1rem;
    letter-spacing: 0.125rem;
    text-transform: uppercase;
    text-wrap: balance;
    font-weight: normal;
  }

  h1 { font-size: clamp(1.5rem, 4cqi, 2rem); }
  h2 { font-size: clamp(1.25rem, 3cqi, 1.6rem); }
  h3 { font-size: clamp(1.1rem, 2.5cqi, 1.4rem); }
  h4 { font-size: clamp(1rem, 2cqi, 1.2rem); }
}
```

## Balance for headings, pretty for body

```css
@layer typography {
  h1, h2, h3, h4, h5, h6 {
    text-wrap: balance;
    max-width: 40ch;
  }

  ul, ol, dl, dt, dd, p, figure, blockquote {
    text-wrap: pretty;
  }
}
```

`text-wrap: balance` evens line lengths in headings — no orphan words.
`text-wrap: pretty` smooths body text breaks — fewer awkward last lines.

## Link defaults

```css
@layer typography {
  a:not([class]) {
    text-decoration-thickness: max(0.08em, 1px);
    text-underline-offset: 0.15em;
  }
}
```

Underline thickness scales with text size. The `:not([class])` is a no-op in this architecture (no classes exist) but makes the rule portable.

## Small text

```css
@layer typography {
  small {
    font-size: 75%;
    opacity: 0.7;
    font-style: italic;
    letter-spacing: 0.04rem;
    line-height: 1.3;
    margin-inline: 1rem;
  }
}
```

Percentage `font-size` scales with the inherited size, preserving the relative relationship.

## What typography never does

- Never sets `font-size` in pixels
- Never sets `font-size` per breakpoint (use `clamp` and `cqi`)
- Never declares `font-family` per element (set once at `:root`, override only for headings)
- Never ships text without `text-wrap: balance` or `pretty`

## Reference

- MDN `clamp()`: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
- MDN container query units: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries
- MDN `text-wrap`: https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
- W3C CSS Text Module Level 4: https://www.w3.org/TR/css-text-4/
- W3C CSS Values and Units Level 4: https://www.w3.org/TR/css-values-4/
