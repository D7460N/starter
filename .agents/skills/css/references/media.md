# Media

Block-level reset for replaced elements. `object-fit` for cropped responsive images. No background-image hacks for content images.

## Only this media reset

```css
@layer media {
  :where(img, picture, video, canvas, svg) {
    display: block;
    max-inline-size: 100%;
  }
}
```

`display: block` removes the inline gap below replaced elements. `max-inline-size: 100%` keeps them inside their container.

## Responsive cropped images

```css
@layer media {
  img[data-cropped],
  picture > img {
    object-fit: cover;
    object-position: center;
    width: 100%;
    aspect-ratio: 16 / 9;
  }
}
```

`object-fit: cover` crops to fill while preserving aspect ratio. `aspect-ratio` sets the box without padding hacks.

(Note: `data-cropped` is forbidden in this architecture's HTML; the example uses it generically. In practice, use a semantic descendant combinator such as `picture > img` or scope by the parent custom element.)

## Aspect ratio without padding hack

```css
@layer media {
  .video-wrapper {
    aspect-ratio: 16 / 9;
  }
}
```

`aspect-ratio` declares the intrinsic ratio in one property. No `padding-top: 56.25%` and absolute-positioning workaround.

## Mobile viewport height

```css
@layer media {
  .hero {
    block-size: 100dvh;
  }
}
```

`100dvh` (dynamic viewport height) accounts for mobile address bars. `100vh` is forbidden — it overflows on mobile.

## What media never does

- Never use `<div>` with `background-image` for content images (use `<img>` with `alt`)
- Never use `100vh` (use `100dvh`)
- Never set fixed `height` and `width` for responsive images — use `aspect-ratio` and `object-fit`
- Never use the padding-hack for aspect ratios

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `object-fit` — **Baseline Widely available (Jan 2020)** — https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
- `object-position` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/object-position
- `aspect-ratio` — **Baseline Widely available (Sep 2021)** — https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
- `max-inline-size` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/max-inline-size
- `dvh` dynamic viewport unit — **Widely available (2022)** — https://developer.mozilla.org/en-US/docs/Web/CSS/length#dvh

**AutoCSS Architecture:** serves intrinsic sizing (`aspect-ratio`, `object-fit`); no wrapper nesting; `100dvh` not `100vh`. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN `object-fit`: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
- MDN `aspect-ratio`: https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
- MDN dynamic viewport units: https://developer.mozilla.org/en-US/docs/Web/CSS/length#dvh
- W3C CSS Images Module Level 3: https://www.w3.org/TR/css-images-3/
