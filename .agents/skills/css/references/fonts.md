# Fonts

Variable font for the full weight range. `font-display: swap` to prevent invisible text. `@import` at the very top.

## Only this font-loading pattern

```css
@import url("https://fonts.googleapis.com/css2?family=Oxanium:wght@200..800&display=swap");

@layer fonts {
  /* font-family is declared in typography */
}
```

`@import` must be the first non-comment statement in the CSS file. The font is loaded with `display=swap` so text remains visible while the font loads.

For self-hosted variable fonts:

```css
@layer fonts {
  @font-face {
    font-family: 'Oxanium';
    /* Modern form first: format(woff2) + tech(variations). The legacy
       `format('woff2-variations')` string is kept as a fallback for engines
       that don't yet parse the format()+tech() syntax. */
    src: url('../fonts/oxanium/Oxanium.woff2') format(woff2) tech(variations),
         url('../fonts/oxanium/Oxanium.woff2') format('woff2-variations');
    font-weight: 200 800;
    font-style: normal;
    font-display: swap;
  }
}
```

One file covers the full weight range. `font-weight: 200 800` declares the variable axis. `format(woff2) tech(variations)` is the current standard spelling; `format('woff2-variations')` is the older non-normalized string, kept only as a backward-compat fallback.

## Discrete-weight fallback (when variable font is unavailable)

If the project must ship discrete weights instead of a variable font, declare each `@font-face` separately:

```css
@layer fonts {
  @font-face {
    font-family: 'Oxanium-light';
    src: url('../fonts/oxanium/Oxanium-Light.woff2') format('woff2'),
         url('../fonts/oxanium/Oxanium-Light.woff') format('woff'),
         url('../fonts/oxanium/Oxanium-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  /* repeat for each weight */
}
```

This is the inactive `fonts_.css` pattern preserved for reference. The variable-font approach above is preferred — it produces fewer HTTP requests and supports any weight in the range.

## What fonts never do

- Never load fonts without `font-display: swap` (causes flash of invisible text)
- Never load fonts inside `@layer` ordering after the consuming rules — `@import` must be at file top
- Never load multiple weight files when a variable font covers the range

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `@font-face` `src` (incl. `format()`+`tech()`) — **Baseline Widely available (2015)** — https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
- `font-display: swap` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display

**AutoCSS Architecture:** serves zero third-party (non-native-browser) dependencies; future-proofing (self-host). Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `@font-face`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face
- MDN `font-display`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- MDN variable fonts: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide
- W3C CSS Fonts Level 4: https://www.w3.org/TR/css-fonts-4/
