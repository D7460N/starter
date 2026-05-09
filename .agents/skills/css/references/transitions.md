# Transitions

Universal transitions driven by custom properties. View transitions for cross-document navigation. `prefers-reduced-motion` honored.

## Only this universal transition setup

```css
@layer transitions {
  :root {
    --transition-property: display, color, opacity, visibility, background, background-color, border-color;
    --transition-timing-function: ease-in;
    --transition-duration: 250ms;

    interpolate-size: allow-keywords;
  }

  * {
    transition-property: var(--transition-property);
    transition-timing-function: var(--transition-timing-function);
    transition-duration: var(--transition-duration);
    transition-behavior: allow-discrete;
  }
}
```

The universal `*` selector applies the same transition to everything. Per-element overrides come later in the cascade if needed.

`transition-behavior: allow-discrete` enables transitions on properties like `display: none → display: block`.
`interpolate-size: allow-keywords` enables transitions to/from `auto`, `min-content`, etc.

## Reduced motion is honored

```css
@layer transitions {
  @media (prefers-reduced-motion) {
    * {
      transition-duration: 0ms;
    }
  }
}
```

When the user has enabled reduced motion in their OS, transitions become instant.

## View transitions

Native cross-document fade-and-morph:

```css
@layer transitions {
  @media (prefers-reduced-motion: no-preference) {
    @view-transition {
      navigation: auto;
    }
  }

  :root {
    view-transition-name: none;
  }

  ::view-transition {
    pointer-events: none;
  }
}
```

`navigation: auto` enables view transitions on all same-origin navigations. `view-transition-name: none` on `:root` allows pointer interaction during the animation.

## Initial-load fade

```css
@starting-style {
  * {
    visibility: hidden;
    opacity: 0;
  }
}
```

`@starting-style` defines the "before" state. The browser transitions from this to the actual computed value on first paint.

## Custom easing without cubic-bezier

```css
.bouncing {
  transition: transform 0.6s linear(0, 1.2 60%, 0.9, 1.05, 1);
}
```

`linear()` interpolates between keyframe values. Produces curves that `cubic-bezier()` cannot.

## What transitions never do

- Never animate via JavaScript when CSS can do it
- Never use `setInterval` or `requestAnimationFrame` for UI animation
- Never use `transition: all` (over-broad — list properties explicitly)
- Never use timing values that magic-number out of `:root` custom properties

## Reference

- MDN `transition`: https://developer.mozilla.org/en-US/docs/Web/CSS/transition
- MDN `@starting-style`: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- MDN view transitions: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- MDN `linear()` easing: https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear
- W3C View Transitions Level 1: https://www.w3.org/TR/css-view-transitions-1/
