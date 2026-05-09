# Carousel

Scroll-snap with native `::scroll-button` and `::scroll-marker` pseudo-elements. No JavaScript carousel library.

## Only this carousel pattern

```html
<ul class="carousel">
  <li>Slide 1</li>
  <li>Slide 2</li>
  <li>Slide 3</li>
</ul>
```

(In this architecture's HTML, the class would be replaced by a semantic descendant or attribute selector. The class is shown for portability.)

```css
@layer state {
  .carousel {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 100%;
    gap: 1rem;
    scroll-marker-group: after;
  }

  .carousel > * {
    scroll-snap-align: start;
  }

  .carousel::scroll-button(left) {
    content: "⬅" / "Scroll left";
  }

  .carousel::scroll-button(right) {
    content: "➡" / "Scroll right";
  }

  .carousel li::scroll-marker {
    content: "";
    inline-size: 0.625rem;
    block-size: 0.625rem;
    border-radius: 50%;
    background: color-mix(in srgb, currentColor 30%, transparent);
  }

  .carousel li::scroll-marker:checked {
    background: var(--accent);
  }
}
```

The browser provides:

- Scroll-snap to align slides
- `::scroll-button(left|right)` pseudo-elements for previous/next controls
- `::scroll-marker` pseudo-elements for the dot indicators
- Keyboard navigation
- Accessible names via the alt text in `content`

## What carousels never do

- Never use Swiper, Slick, or other JS carousel libraries
- Never compute scroll positions in JavaScript
- Never animate slides via `setInterval`
- Never replace the native `<ul>` with a `<div>` carousel container

## Reference

- MDN `scroll-snap-type`: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type
- MDN `::scroll-button`: https://developer.mozilla.org/en-US/docs/Web/CSS/::scroll-button
- MDN `::scroll-marker`: https://developer.mozilla.org/en-US/docs/Web/CSS/::scroll-marker
- MDN `scroll-marker-group`: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-marker-group
- W3C CSS Overflow Module Level 5: https://www.w3.org/TR/css-overflow-5/
