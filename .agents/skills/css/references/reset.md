# Reset

The minimal universal reset.

## Only this reset is used

```css
@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}
```

That is the entire reset. No further normalization. The browser's intrinsic defaults for semantic elements (`<h1>`–`<h6>`, `<p>`, `<ul>`, `<ol>`, `<button>`, etc.) are preserved.

## Why this is the only reset

- `box-sizing: border-box` makes width and height include padding and border, eliminating math errors in layout calculations.
- `margin: 0` and `padding: 0` remove inherited browser defaults that vary across user agents.
- Wrapping in `@layer reset` (the lowest layer) means consumer rules win without `!important`.

## Why nothing else is reset

Modern browsers agree on most defaults. Heavy resets (Eric Meyer reset, Normalize.css) were responses to inconsistencies that no longer exist. Stripping `<h1>` to `font-size: 1em` and rebuilding it costs more than it saves and breaks intrinsic accessibility cues.

## What this reset never does

- Never declares `font-family` (themes / typography concern)
- Never declares `color` (themes concern)
- Never declares `background` (themes concern)
- Never resets `font-size` on headings (typography concern)
- Never sets `line-height` (typography concern)
- Never modifies `<button>`, `<input>`, `<select>` defaults (inputs concern)

Each of those concerns has its own feature reference.

## Reference

- MDN box-sizing: https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing
- MDN @layer: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
