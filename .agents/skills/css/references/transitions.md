# Transitions

Project file: `assets/css/transitions.css` (one skill ↔ one file).

**Two mechanisms live here.** Same-document changes — SPA tab-content swaps, `<aside>`/form reveals, `:empty` → `:not(:empty)` flips — fade via a **universal `*` transition** with `transition-behavior: allow-discrete`. Genuine **cross-document navigations** fade via `@view-transition`. First paint fades via `@starting-style`. `prefers-reduced-motion` is honored throughout. No JavaScript animates anything; JS only injects data, and CSS reacts.

## Universal transition — this is what fades same-document (tab) content

```css
:root {
  --transition-duration: 500ms;
  --transition-property: visibility, opacity, display, transform,
    background, background-color, border-color, color, min-width;
  --transition-timing-function: ease-in;

  scroll-behavior: smooth;
  interpolate-size: allow-keywords;
}

* {
  transition-property: var(--transition-property);
  transition-duration: var(--transition-duration);
  transition-timing-function: var(--transition-timing-function);
  transition-behavior: allow-discrete;
}
```

One `*` rule applies the same transition to every element; a per-element rule later in the cascade overrides it only where genuinely needed. Timing lives in `:root` custom properties — never magic-numbered inline.

**`transition-behavior: allow-discrete` is the load-bearing part.** By default the *discrete* properties `display` and `visibility` snap; `allow-discrete` lets them transition. When tab content is injected into the **same document** — an element flips `display: none` → a visible value, or goes `:empty` → `:not(:empty)` — the browser holds the visible value across the whole duration and animates `opacity`, so the incoming tab **fades in** instead of popping. (Per MDN: when animating `display` from `none` to a visible value, the value flips at `0%` of the duration so the content shows throughout. `transition-behavior` is **Baseline 2024**.)

`interpolate-size: allow-keywords` lets sizes animate to/from intrinsic keywords such as `auto` and `min-content`. `scroll-behavior: smooth` animates programmatic and anchored scrolls.

## Reduced motion is honored

```css
@media (prefers-reduced-motion) {
  * {
    transition-duration: 0ms;
  }
}
```

`prefers-reduced-motion` with no value means `reduce`. When the OS requests reduced motion, every transition becomes instant.

## Cross-document view transitions — navigations only, NOT SPA tab swaps

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition {
    navigation: auto;
  }
}

@layer view-transitions {
  /* Don't capture the root, so the page stays interactive while elements animate. */
  @layer no-root {
    :root {
      view-transition-name: none;
    }

    ::view-transition {
      pointer-events: none;
    }
  }
}
```

`@view-transition { navigation: auto }` opts both the current and destination documents into a fade — **only on same-origin cross-document navigations** (a `navigationType` of `traverse`, `push`, or `replace`). It does **not** fire when content changes inside the same document, so it is **not** what animates this SPA's tab swaps — the universal `*` transition above is. It is guarded by `prefers-reduced-motion: no-preference`. `view-transition-name: none` on `:root` (root not captured) plus `pointer-events: none` on `::view-transition` keep the page interactive while the animation runs.

**Boundary to know:** same-document view transitions *do* exist, but they require the **JavaScript** `document.startViewTransition()` API — forbidden in this architecture. So same-document fades use the universal `*` transition; `@view-transition` is reserved for real navigations. (`@view-transition` is **"Limited availability," not Baseline** — MDN.)

## Initial-load fade

```css
@starting-style {
  * {
    visibility: hidden;
    opacity: 0;
  }
}
```

`@starting-style` supplies the "before" state for an element's first style resolution. On first paint the universal `*` transition animates from hidden/transparent to each element's real computed value, fading the page in. Without it, first paint would not transition — browsers do not transition an element's initial styles, nor a `display` change from `none`, unless a starting style is given.

## What transitions never do

- Never animate via JavaScript when CSS can — no `setInterval` / `requestAnimationFrame` for UI motion, and no `document.startViewTransition()` (same-document view transitions are JS; this architecture uses the universal `*` transition instead).
- Never `transition: all` — the animated properties are listed explicitly in `--transition-property`.
- Never magic-number a timing value outside the `:root` custom properties.
- Never a `class` / `id` / `data-*` selector — those attributes do not exist in this HTML.

## Reference

- MDN `transition-behavior` (Baseline 2024): https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
- MDN `@starting-style`: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- MDN `@view-transition` (cross-document): https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition
- MDN View Transition API (same-document `document.startViewTransition()`): https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- MDN `interpolate-size`: https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- W3C CSS View Transitions Level 2: https://drafts.csswg.org/css-view-transitions-2/
- WebKit — two lines of cross-document view transitions: https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/
- Bram.us — view transitions & page interactivity: https://www.bram.us/2025/01/29/view-transitions-page-interactivity/
