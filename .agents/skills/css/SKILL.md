---
name: css
description: CSS rules for projects following the air-gapped, declarative-first architecture. CSS is the UI runtime — it owns layout, state, themes, transitions, visibility, loading, and every other UI behavior. Each CSS feature lives in its own reference file, independently usable. Use whenever writing or reviewing styles, or whenever the task is "make X visible / behave / transition / theme."
license: MIT
metadata:
  version: "1.0.0"
---

# CSS

CSS is the UI runtime, not styling. CSS replaces all front-end JavaScript except data delivery.

## CSS owns

Every visible UI behavior. Layout, theme, color-scheme, visibility, transitions, loading indicators, navigation appearance, form validation display, scrollbar styling, animations, focus indication.

JavaScript is forbidden for any of these. If a behavior can be expressed in CSS, CSS expresses it. The single permitted JavaScript responsibility is data transport — see the `javascript` skill.

## Universal CSS rules

The following apply across every CSS file in the project:

- **Layers.** All CSS belongs to a `@layer`. The cascade order is declared once at the project root: `@layer reset, fonts, layout, typography, themes, transitions, inputs, media, state, loading;`. Skill features are layered into the appropriate name. Specificity wars are won by layer order, not by `!important` or selector escalation.
- **No `!important`.** Ever. If a style needs to win, fix the layer order or the selector specificity by design, not by escalation.
- **No magic numbers.** Every measurement is a named custom property, a `clamp()` expression, a container query unit, a logical property, or derived via `calc()` from another value. Sizing uses intrinsic and relative units only — `min-content`, `max-content`, `fit-content`, `auto`, `1fr`, `clamp()`, viewport units, container query units.
- **No size-based `@media`.** Responsive design uses `@container` (preferred) or media query range syntax (`@media (600px <= width <= 1200px)`) only. Static breakpoints with `min-width` / `max-width` are forbidden — they hardcode viewport assumptions.
- **No Flexbox.** CSS Grid only. Justification: Grid is two-dimensional, declarative, and intrinsic-sizing-aware; Flexbox encourages wrapper nesting that violates the HTML "no layout wrappers" rule.
- **`color-scheme: light dark`** is declared once at `:root`. Themes use `light-dark()` for paired values, not duplicated `@media (prefers-color-scheme: dark)` blocks.
- **`oklch`** is the color model for any color the project defines. `hsl`, `hex`, and `rgb` are forbidden for project colors. (Browser-default values like `Canvas` and `currentColor` are fine.)
- **Logical properties.** `margin-inline`, `padding-block`, `inset-block-start` etc. — no `left`/`right`/`top`/`bottom` for layout in the document flow.
- **`:where()` for resets.** Specificity-zero selectors so consumer rules always win.

## Required modern features

The architecture mandates these specific modern CSS features for these specific tasks. Each rule is categorical (the rule plus its failure mode):

1. **CSS uses native accessibility-aware selectors** (`:focus-visible`, `:user-invalid`, `:user-valid`, `:disabled`, `[aria-*]` matchers, etc.) to bake accessibility into styling rather than relying on classes or scripted state.
2. **Initial-load page content fades in via `@starting-style`.** JavaScript does not orchestrate entry animations.
3. **Tab/page content transitions use `@view-transition`.** JavaScript does not animate tab changes.
4. **Hover and popover content uses CSS anchor positioning** (`anchor-name` / `position-anchor`) to keep content on-screen. Hand-rolled positioning math via JS or magic numbers is forbidden.
5. **Cutting-edge experimental CSS is used without regard for browser support.** Cross-browser compatibility is not a concern.
6. **Component-relative styling uses `@container` queries.** Components respond to their actual available space, not to viewport breakpoints.
7. **Inline conditional values use `if()`** against custom properties / media features / container queries instead of toggling classes from JS.
8. **Custom properties that need typing or animation are declared via `@property`** so the browser interpolates and validates them.
9. **Reusable CSS calculations use `@function`.** Sass/Less mixins are not used.
10. **Feature detection uses `@supports`.** JS-based feature detection (Modernizr, computed-style probing) is not used.
11. **Lazy rendering / size containment uses `content-visibility` + `contain-intrinsic-size`.** JS-based IntersectionObserver visibility is not used.

## CSS reads only the DOM and data attributes

CSS reads:

- The DOM tree shape
- Native attributes (`open`, `hidden`, `aria-*`, `checked`, `selected`)
- Data presence via `:empty`, `:not(:empty)`
- Relationships via `:has()`, `:not()`
- Custom properties on elements
- Container size and scroll-state via `@container`

CSS does not read:

- `class` (forbidden in HTML)
- `id` (forbidden in HTML)
- `data-*` (forbidden in HTML)

CSS targets elements by their semantic name and their native state.

## Air-gap inside CSS

Each CSS feature is independent and copy-pastable. The `transitions` reference does not depend on `themes`. The `state-machines` reference does not depend on `layout`. Each feature stands alone and can be dropped into any project.

This rule is enforced by:
- One feature per reference file
- No cross-imports between feature references
- Custom properties used in a reference are declared inside that reference's example
- Each reference shows the feature in isolation, not in the context of the larger project

## Feature references

Each feature has its own reference. Read only the reference for the feature you are working on. Do not load others.

| Feature | Reference |
|---|---|
| Reset | `references/reset.md` |
| Layers and cascade | `references/layers.md` |
| Layout (Holy Grail, auto-grid) | `references/layout.md` |
| Fonts (loading, variable fonts) | `references/fonts.md` |
| Typography (fluid sizing, balance, pretty) | `references/typography.md` |
| Inputs (form-field reset, validation display) | `references/inputs.md` |
| Media (img, picture, video reset) | `references/media.md` |
| State machines (label + checkbox/radio) | `references/state-machines.md` |
| Themes (color-scheme, oklch, light-dark) | `references/themes.md` |
| Transitions and view transitions | `references/transitions.md` |
| Loading indicator (CSS-only spinner) | `references/loading.md` |
| Containers (size and scroll-state queries) | `references/containers.md` |
| Radii (outer/inner radius math) | `references/radii.md` |
| Accessibility (focus-visible, accent-color, marker, selection) | `references/a11y.md` |
| Carousel (scroll-button, scroll-marker) | `references/carousel.md` |
| Menu (popover, popovertarget) | `references/menu.md` |
| Feature detection (@supports, @supports at-rule) | `references/feature-detection.md` |
| Starting style (@starting-style) | `references/starting-style.md` |
| Anchor positioning (anchor-name, position-anchor) | `references/anchor-positioning.md` |
| Scrollbars (scrollbar-color, scrollbar-width) | `references/scrolling.md` |
| Scroll affordances (scroll-state shadows) | `references/scroll-affordances.md` |
| Reactivity (data presence drives visibility) | `references/reactivity.md` |

## Authoritative external references

- MDN CSS reference: https://developer.mozilla.org/en-US/docs/Web/CSS
- W3C CSS specifications: https://www.w3.org/Style/CSS/specs.en.html
- Modern CSS feature catalog: https://modern-css.com/

## What CSS never does

- Never `!important`
- Never Flexbox (`display: flex`, `display: inline-flex`, `flex-direction`, `flex-wrap`, `flex-flow`)
- Never size-based `@media (min-width)` / `(max-width)`
- Never magic numbers
- Never `class`, `id`, or `data-*` selectors (those attributes don't exist in this architecture's HTML)
- Never inline `<style>` or `style=` attributes
