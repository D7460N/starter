# CSS CODE REFERENCE

**CANONICAL CSS CODE REFERNECE for all @agents and developers to reference.**

- This file is the Single Source of Truth (SST) for all CSS in this project, to include, but not limited by the following:
  - code patterns
  - techniques
  - strategies
  - approaches
- This file is to be updated on every code change push to ensure accuracy.
- This file is to be checked and updated on each code push.
- This file is to be referenced and code examples are to be referenced in all other documentation via the link.
- This file was originally inspired by: [https://modern-css.com/](https://modern-css.com/)
- Each CSS rule, technique, and approach, has an associated minimal code example and the date it was last updated.
- Each CSS code example displays current browser support. (coming soon)
- Each CSS code example displays a reference to the MDN resource from which it was taken. (coming soon)  
  [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS).

> “Simplicity is the ultimate sophistication.”  
> _Leonardo da Vinci_

## [Simplicity is the by design](#simplicity-by-design)

By design and by default, all code (except where noted) is minimal and consistent as possible. Code patters and techniques, once established, are repeated the same way with the same intent and results across the board.

This allows for writing effiecient CSS utilities - similar to JS utility functions, code consolidation - for a smaller codebase, and reduces complexity and cognative load for everyone. Learn it once, rince, and repeat.

## [GRID not FLEX](#grid-not-flex)

```css
.parent {
	display: grid;
	place-items: center;
}
```

**Preventing layout shift from scrollbar appearance**  
When content grows tall enough to scroll, the scrollbar appears and narrows the layout, causing a visible jump. The old fixes were `overflow-y: scroll` (always shows the bar) or `padding-right` matching the scrollbar width. `scrollbar-gutter: stable` reserves the space upfront.

```css
body {
	scrollbar-gutter: stable;
}
```

**Scrollbar styling without -webkit- pseudo-elements**  
Styling scrollbars required `::-webkit-scrollbar`, `::-webkit-scrollbar-track`, and `::-webkit-scrollbar-thumb`, non-standard WebKit-only pseudo-elements that Firefox never supported. `scrollbar-color` and `scrollbar-width` are the standard two-property replacement.

```css
* {
	scrollbar-width: thin;
	scrollbar-color: #888 transparent;
}
```

**Dark mode colors without duplicating values**  
You defined every variable in `:root` and again inside `@media (prefers-color-scheme: dark)`. `light-dark()` holds both values in one place so you do not repeat yourself.

```css
:root {
	color-scheme: light dark;
	color: light-dark(#111, #eee);
}
```

**Scaling elements without transform hacks**  
`transform: scale()` shrinks an element visually, but keeps its original layout space, requiring negative margins to collapse the gap. `zoom` scales the element and its layout footprint together, no hacks needed.

```css
.thumbnail {
	zoom: 0.5;
}
```

Custom easing curves without cubic-bezier guessing  
Creating non-standard easing like bounce or spring required either a cubic-bezier approximation (which can only produce curves, not bounces) or a JavaScript animation library. linear() defines an easing function by interpolating between a list of keyframe values.

```css
.el {
	transition: transform 0.6s linear(0, 1.2 60%, 0.9, 1.05, 1);
}
```

Form validation styles without JavaScript  
:invalid fires as soon as the page loads, marking empty required fields as errors before anyone types. The workaround was JS adding a .touched class after blur. :user-invalid only activates after the user has interacted with the field.

```css
input:user-invalid {
	border-color: red;
}
input:user-valid {
	border-color: green;
}
/* no JS, no .touched class */
```

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Smooth height auto animations without JavaScript
Animating to height: auto required JS to measure scrollHeight, set a fixed pixel height, then snap back to auto. interpolate-size: allow-keywords lets CSS transition directly to and from intrinsic sizes. _/
:root { interpolate-size: allow-keywords; }
.accordion {
height: 0;
overflow: hidden;
transition: height .3s ease;
}
.accordion.open { height: auto; }

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Vivid colors beyond sRGB
The old way was hex, rgb(), or hsl(), all stuck in sRGB. On P3 or other wide-gamut screens, those colors look flat. oklch and color(display-p3 ...) unlock the extra range. _/
.hero {
color: oklch(0.7 0.25 29);
}
/_ Or: color(display-p3 1 0.2 0.1) for P3. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Color variants without Sass functions
The old way used Sass functions like lighten(), darken(), and saturate() at compile time. Relative color syntax derives variants from a variable at runtime with oklch(from var(--x) ...). _/
.btn {
background: oklch(from var(--brand) calc(l + 0.2) c h);
}
/_ Runtime. Updates when --brand changes. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Lazy rendering without IntersectionObserver
The old way used JavaScript's IntersectionObserver to detect when elements entered the viewport, then loaded or rendered them. Now CSS handles it with content-visibility: auto. _/
.section {
content-visibility: auto;
contain-intrinsic-size: auto 500px;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Scoped styles without BEM naming
To avoid leaks you used BEM, CSS Modules, or styled-components. @scope limits selectors to a root and optional boundary so you can use short names safely._/
@scope (.card) {
.title {
font-size: 1.25rem;
margin-bottom: 0.5rem;
}
.body { color: #444; }
}
/_ HTML: class="card", class="title" _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Typed custom properties without JavaScript
Custom properties were strings. You couldn't animate them or get browser validation. @property gives you a type, so the browser can interpolate and validate. _/
@property --hue {
syntax: "<angle>";
inherits: false;
initial-value: 0deg;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Entry animations without JavaScript timing
Transitions only ran when a value changed. To animate in, you added a class in JS after paint. @starting-style defines the before state so CSS can transition from it. _/
.card {
transition: opacity .3s, transform .3s;
@starting-style {
opacity: 0;
transform: translateY(10px);
}
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Balanced headlines without manual line breaks
You used to add br tags by hand or pull in Balance-Text.js. Now one property evens out lines so headlines don't end with a single word. _/
h1, h2 {
text-wrap: balance;
max-width: 40ch;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Dropdown menus without JavaScript toggles
The old way used JS for toggle, click-outside, and ESC, plus manual aria. The popover attribute and popovertarget give you a built-in dismissible popover with no toggle code. _/
/_ <button popovertarget="menu"> ... <div popover> _/
#menu[popover] {
position: absolute;
margin: 0.25rem 0;
}
/_ Toggle, light dismiss, ESC: built in. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Aligning nested grids without duplicating tracks
Inner grids used to repeat the parent's column definitions to align. That was fragile and got out of sync. Subgrid inherits the parent's tracks so everything lines up.,_/
.parent {
display: grid;
grid-template-columns: 1fr 1fr 1fr;
}

.child-grid {
display: grid;
grid-template-columns: subgrid;
}
/_ Stays in sync with parent _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Nesting selectors without Sass or Less
Selector nesting was the #1 reason people reached for Sass. It's now built into CSS. Same & syntax, zero build tools. _/
/_ nav.css, plain CSS, no compiler _/
.nav {
display: flex;
gap: 8px;

& a {
color: #888;
text-decoration: none;

    &:hover {
      color: white;
    }

}
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Mixing colors without a preprocessor
Blending two colors used to require Sass, Less, or a JS utility. color-mix() does it in plain CSS, and it supports perceptually uniform color spaces like oklch. _/
.card {
background: color-mix(
in oklch, #3b82f6 60%, #ec4899
);
}
/_ Dynamic. No build step. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Selecting parent elements without JavaScript
Selecting a parent based on its children used to require JavaScript. :has() handles it in pure CSS, no event listeners needed. _/
.form-group:has(input:invalid) {
border-color: red;
background: #fff0f0;
}
/_ Pure CSS. Zero JavaScript. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Path shapes without SVG clip paths
Creating non-rectangular clip paths used to mean SVG <clipPath> elements or path() with fixed pixel coordinates that break as soon as the element resizes. shape() brings path-style drawing to CSS using percentage units and responsive coordinates. _/
.hero {
clip-path: shape(
from 0% 0%,
line to 100% 0%,
line to 100% 80%,
curve to 0% 80% via 50% 105%,
close
);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Readable text without manual contrast checks
Picking readable text used to mean hardcoding color: white or color: black for each background. contrast-color() does the math automatically, returning whichever meets WCAG AA contrast against the given color. _/
.badge {
background: var(--bg);
color: contrast-color(var(--bg));
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Reduced motion without JavaScript detection
Respecting a user's reduced motion preference required JavaScript to check window.matchMedia and conditionally skip animations. The prefers-reduced-motion media query lets CSS respond directly to the OS accessibility setting. _/
@media (prefers-reduced-motion: reduce) {
_, _::before, \*::after {
animation-duration: 0.01ms !important;
animation-iteration-count: 1 !important;
transition-duration: 0.01ms !important;
}
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Perceptually uniform colors with oklch
HSL looks like it should be perceptually uniform, but it isn't. Yellow at hsl(60 100% 50%) appears far brighter than blue at hsl(240 100% 50%) at the same lightness. oklch uses a model where L actually means the same perceived brightness across all hues. _/
/_ oklch: L is perceptually uniform across hues _/
:root {
--brand: oklch(0.55 0.2 264);
--brand-light: oklch(0.75 0.2 264);
--brand-dark: oklch(0.35 0.2 264);
/_ only L changes _/
}
/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_CSS feature detection without JavaScript
Detecting CSS feature support required JavaScript — either Modernizr, inline CSS.supports() checks, or testing computed styles. @supports lets CSS apply styles conditionally based on whether the browser supports a given property and value. _/
@supports (display: grid) {
.layout { display: grid; }
}

@supports not (display: grid) {
.layout { float: left; width: 50%; }
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Frosted glass effect without opacity hacks
Frosted glass used to require a blurred copy of the background behind the element: a pseudo-element with the same background image, a filter: blur, and z-index stacking. backdrop-filter applies effects directly to whatever is rendered behind the element. _/
.glass {
backdrop-filter: blur(12px) saturate(1.5);
background: rgba(255, 255, 255, 0.1);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Exclusive accordions without JavaScript
Making only one accordion panel open at a time required JavaScript to listen for toggle events and close all other open details elements. The name attribute on details elements creates a mutually exclusive group — the browser handles closing others automatically. _/

<details name="faq">
  <summary>Question 1</summary>
  Answer 1
</details>
<details name="faq">
  <summary>Question 2</summary>
  Answer 2
</details>

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_;Custom easing curves without cubic-bezier guessing
Creating non-standard easing like bounce or spring required either a cubic-bezier approximation (which can only produce curves, not bounces) or a JavaScript animation library. linear() defines an easing function by interpolating between a list of keyframe values. _/
.el {
transition: transform 0.6s linear(0, 1.2 60%, 0.9, 1.05, 1);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_Media query ranges without min-width and max-width
Defining a range of viewport widths required two separate media features: min-width and max-width. Media Queries Level 4 introduces range syntax using standard comparison operators, making ranges possible in a single expression. _/
@media (600px <= width <= 1200px) {
.card { grid-template-columns: 1fr 1fr; }
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Preventing scroll chaining without JavaScript
When a scrollable element inside a modal reached its end, scroll would chain to the page behind it. The fix was a JS wheel event listener calling e.preventDefault(). overscroll-behavior: contain stops that natively. _/
.modal-content {
overflow-y: auto;
overscroll-behavior: contain;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Responsive images without the background-image hack
Cropped responsive images were done with background-image and background-size: cover on a div. No semantic img element, no alt text, and no native lazy loading. object-fit brings the same cropping behavior to real img elements. _/
img {
object-fit: cover;
object-position: center;
width: 100%;
height: 200px;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Mobile viewport height without the 100vh hack
100vh on mobile includes the browser address bar and navigation controls even when they are visible, causing full-height elements to overflow. Dynamic viewport units (dvh, svh, lvh) adapt to the actual visible area. _/
.hero {
height: 100dvh;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Auto-growing textarea without JavaScript
Making a textarea grow as the user types required a JS event listener that reset height to auto then set it to scrollHeight on every keystroke. field-sizing: content makes the field size itself to its content. _/
textarea {
field-sizing: content;
min-height: 3lh;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Range style queries without multiple blocks
Testing custom property ranges used to require multiple @container style() blocks or JavaScript comparisons. Range style queries let you write numeric comparisons directly: style(--progress > 50%). _/
.progress-container {
container-type: style;
}

@container style(--progress > 75%) {
.bar { background: var(--green); }
}

@container style(--progress > 25%) and style(--progress <= 75%) {
.bar { background: var(--yellow); }
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Sticky & snapped element styling without JavaScript
Styling elements differently when they become stuck (sticky) or snapped used to require JavaScript scroll event listeners. scroll-state() container queries let CSS respond to scroll-related states directly. _/
.header-wrap {
container-type: scroll-state;
}

@container scroll-state(stuck: top) {
.header {
box-shadow: 0 2px 8px rgba(0,0,0,.1);
backdrop-filter: blur(12px);
}
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Typed attribute values without JavaScript
Reading data attributes for styling used to require JavaScript to parse dataset values and set inline styles or custom properties. Advanced attr() lets CSS read HTML attributes directly as typed values — numbers, colors, lengths, and more. _/
.bar {
width: attr(data-pct type(<percentage>));
}
/_ HTML: <div class="bar" data-pct="75%"> _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Inline conditional styles without JavaScript
Conditional styling used to require JavaScript to toggle classes based on state. CSS if() lets you write inline conditions that respond to custom property values, media features, and container queries. _/
.btn {
background: if(
style(--variant: primary): blue;
else: gray
);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Reusable CSS logic without Sass mixins
Reusable calculations and logic in stylesheets used to require Sass or other preprocessors. Native CSS @function lets you define custom functions that return computed values, right in your stylesheet. _/
@function --fluid(--min, --max) {
@return clamp(
var(--min),
50vi,
var(--max)
);
}

h1 {
font-size: --fluid(1.5rem, 3rem);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Corner shapes beyond rounded borders
Non-circular corner shapes like squircles, scoops, and notches used to require clip-path polygon hacks or SVG masks. Now corner-shape provides named corner styles natively. _/
.card {
border-radius: 2em;
corner-shape: squircle;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Responsive clip paths without SVG
Complex clip paths used to require SVG path() definitions with fixed coordinates that don't scale responsively. The CSS shape() function uses responsive units like percentages and viewport units for truly flexible shapes. _/

.shape {
clip-path: shape(
from 0% 100%,
line to 50% 0%,
line to 100% 100%
);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Scroll spy without IntersectionObserver
Highlighting navigation links based on scroll position used to require JavaScript IntersectionObserver or scroll event listeners. Now CSS can track which section is in view with scroll-target-group and the :target-current pseudo-class. _/
.scroller {
overflow-y: auto;
}

nav a:target-current {
color: var(--accent);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Filling available space without calc workarounds
Making an element fill its container while keeping margins meant calc(100% - left - right) or risking overflow with width: 100%. The stretch keyword fills available space while respecting margins automatically. _/
.full {
width: stretch;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Staggered animations without nth-child hacks
Staggered list animations used to require manually setting --index on each :nth-child or counting in JavaScript. The sibling-index() function gives every element automatic awareness of its position. _/
li {
transition: opacity .25s ease, translate .25s ease;
transition-delay:
calc(0.1s \* (sibling-index() - 1));
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Carousel navigation without a JavaScript library
Carousels used to need libraries like Swiper.js or Slick for navigation buttons and dot indicators. CSS scroll-button and scroll-marker pseudo-elements give you native, accessible carousel UI. _/
.carousel::scroll-button(left) {
content: "⬅" / "Scroll left";
}
.carousel::scroll-button(right) {
content: "➡" / "Scroll right";
}
.carousel { scroll-marker-group: after; }
.carousel li::scroll-marker {
content: '';
width: 10px; height: 10px;
border-radius: 50%;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Vertical text centering without padding hacks
Text always looked optically off-center because font metrics include extra space for ascenders and descenders. The text-box property trims that invisible space for true visual centering. _/
.btn {
padding: 10px 20px;
text-box: trim-both cap alphabetic;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Hover tooltips without JavaScript events
Tooltips required JavaScript mouseenter/mouseleave listeners, focus handling, and manual positioning. Now popover=hint with the interestfor attribute gives you declarative, accessible hover UI. _/
<button interestfor="tip">
Hover me
</button>

<div id="tip" popover=hint>
  Tooltip content
</div>

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Modal controls without onclick handlers
Opening a dialog modally required onclick handlers calling showModal(). Invoker Commands let buttons perform actions on other elements declaratively with commandfor and command attributes. _/
<button commandfor="dlg" command="show-modal">
Open Dialog
</button>

<dialog id="dlg">...</dialog>

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Dialog light dismiss without click-outside listeners
Closing a dialog when the user clicks outside required a JavaScript click listener on the backdrop. The closedby attribute gives dialogs popover-style light dismiss behavior natively. _/

<dialog closedby="any">
  Click outside or press ESC to close
</dialog>

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Customizable selects without a JavaScript library
Styling selects used to require JavaScript libraries like Select2 or Choices.js that replace the native element entirely. Now appearance: base-select unlocks full CSS customization of the native select. _/
select,
select ::picker(select) {
appearance: base-select;
}

select option:checked {
background: var(--accent);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Vivid colors beyond sRGB
The old way was hex, rgb(), or hsl(), all stuck in sRGB. On P3 or other wide-gamut screens, those colors look flat. oklch and color(display-p3 ...) unlock the extra range. _/
.hero {
color: oklch(0.7 0.25 29);
}
/_ Or: color(display-p3 1 0.2 0.1) for P3. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Multiline text truncation without JavaScript
The old way was JS that counted characters or words and appended "...", or the -webkit-line-clamp plus -webkit-box-orient combo. line-clamp is now in the spec and gives you clean multiline truncation. _/
.card-title {
display: -webkit-box;
-webkit-line-clamp: 3;
line-clamp: 3;
overflow: hidden;
}
/_ Standard; -webkit- prefix still needed. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Drop caps without float hacks
The old way used float, a large font-size, and manual line-height and margin, and it broke across browsers. initial-letter gives you a real drop cap in one property. _/
.drop-cap::first-letter {
-webkit-initial-letter: 3;
initial-letter: 3;
}
/_ Standard; -webkit- prefix needed for Safari. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Positioning shorthand without four properties
The old way was to set top, right, bottom, and left one by one for full-bleed or overlay layouts. inset gives you one property that sets all four. _/
.overlay {
position: absolute;
inset: 0;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Tooltip positioning without JavaScript
The old way relied on JS libraries like Popper.js or Floating UI to compute tooltip position. CSS anchor positioning ties the tooltip to its trigger with anchor-name and position-anchor. _/
.trigger { anchor-name: --tip; }
.tooltip { position-anchor: --tip; top: anchor(bottom); }

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Independent transforms without the shorthand
transform was one shorthand. To change only rotation you had to repeat translate and scale. Now translate, rotate, and scale are separate properties you can animate on their own. _/
.icon {
translate: 10px 0;
rotate: 45deg;
scale: 1.2;
}
.icon:hover {
rotate: 90deg;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Page transitions without a framework
Page transitions used to need s transition library or React Transition Group. The View Transitions API gives you cross-fades and shared-element motion with one JS call and CSS. _/
// JS: wrap DOM update
document.startViewTransition(() => {
document.body.innerHTML = newContent;
});

.hero { view-transition-name: hero; }
/_ Optional: ::view-transition-old/new(hero) _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Scroll snapping without a carousel library
Carousels used to mean Slick, Swiper, or custom scroll math. CSS scroll snap gives you card-by-card or full-width snapping with a few properties. _/
.carousel {
scroll-snap-type: x mandatory;
overflow-x: auto;
display: flex;
gap: 1rem;
}
.carousel > \* { scroll-snap-align: start; }

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Balanced headlines without manual line breaks
You used to add br tags by hand or pull in Balance-Text.js. Now one property evens out lines so headlines don't end with a single word. _/
h1, h2 {
text-wrap: balance;
max-width: 40ch;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Font loading without invisible text
Custom fonts used to cause a flash of invisible text (FOIT) while they downloaded. font-display: swap shows the fallback right away, then swaps when the font is ready. _/
@font-face {
font-family: "MyFont";
src: url("MyFont.woff2");
font-display: swap;
}
/_ Fallback visible immediately, then swap _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Multiple font weights without multiple files
You loaded a separate font file for each weight (400, 500, 600, 700), so 4 or more HTTP requests. One variable font file covers the full range with font-weight: 100 900. _/
@font-face {
font-family: "MyVar";
src: url("MyVar.woff2");
font-weight: 100 900;
}
/_ One file, any weight _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Dark mode defaults without extra CSS
You used to restyle every form control, scrollbar, and background for dark mode. color-scheme tells the browser to use its built-in light or dark styling for those parts. _/
:root {
color-scheme: light dark;
}
/_ Browser handles form controls, scrollbars, canvas _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Dark mode colors without duplicating values
You defined every variable in :root and again inside @media (prefers-color-scheme: dark). light-dark() holds both values in one place so you do not repeat yourself. _/
:root {
color-scheme: light dark;
color: light-dark(#111, #eee);
}
/_ One place per property _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Low-specificity resets without complicated selectors
Resets used verbose low-specificity tricks, or you fought them later with higher specificity. :where() has zero specificity so it never wins over your component styles. _/
:where(ul, ol) {
margin: 0;
padding-inline-start: 1.5rem;
}
/_ Specificity 0. .list { padding: 0 } wins. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Direction-aware layouts without left and right
You used margin-left, padding-right, border-left, then overrode everything for RTL with [dir="rtl"]. Logical properties are direction-aware so one set of rules works for both. _/
.box {
margin-inline-start: 1rem;
padding-inline-end: 1rem;
border-block-start: 1px solid;
}
/_ RTL: no extra rules _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Naming grid areas without line numbers
The old way was floats with clearfix and margin math, or grid with line numbers. Template areas let you name regions like header, sidebar, main, and drop them in place. _/
.layout {
display: grid;
grid-template-areas:
"header header"
"sidebar main"
"footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Aligning nested grids without duplicating tracks
Inner grids used to repeat the parent's column definitions to align. That was fragile and got out of sync. Subgrid inherits the parent's tracks so everything lines up. _/
.parent {
display: grid;
grid-template-columns: 1fr 1fr 1fr;
}

.child-grid {
display: grid;
grid-template-columns: subgrid;
}
/_ Stays in sync with parent _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Modal dialogs without a JavaScript library
The old way was a custom overlay plus JavaScript for open/close, ESC key, click-outside, focus trap, and z-index. The dialog element and showModal() handle all of that. _/
dialog {
padding: 1rem;
}

dialog::backdrop {
background: rgb(0 0 0 / .5);
}
/_ JS: dialog.showModal(); dialog.close(); _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Styling form controls without rebuilding them
The old way was appearance: none plus dozens of lines to rebuild the control. accent-color changes the native control color in one property. _/
input[type="checkbox"],
input[type="radio"] {
accent-color: #7c3aed;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Grouping selectors without repetition
Repeating .card h1, .card h2, .card h3 is verbose. :is(h1, h2, h3, h4) under .card does the same in one rule. _/
.card :is(h1, h2, h3, h4) {
margin-bottom: 0.5em;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Focus styles without annoying mouse users
:focus shows an outline on every click, which looks wrong for mouse users. :focus-visible shows it only when the browser expects keyboard focus. _/
button:focus-visible {
outline: 2px solid var(--focus-color);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Controlling specificity without !important
The old way was stacking more specific selectors or throwing !important. @layer lets you decide order without fighting specificity. _/
@layer base, components, utilities;

@layer utilities {
.mt-4 { margin-top: 1rem; }
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Theme variables without a preprocessor
Sass and LESS variables compile to static values. Custom properties live in the browser and can change at runtime._/
:root {
--primary: #7c3aed;
--spacing: 16px;
}
.btn { background: var(--primary); }

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_,Fluid typography without media queries
The old way used several media queries with different font-sizes. clamp() scales smoothly between a min and max. _/
h1 {
font-size: clamp(1rem, 2.5vw, 2rem);
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Spacing elements without margin hacks
The old way used margins on children and negative margin on the container, or :last-child to cancel the last margin. Gap handles it on the parent. _/
.grid {
display: flex;
gap: 16px;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Aspect ratios without the padding hack
The old trick used padding-top: 56.25% and nested absolute positioning. aspect-ratio does it in one declaration. _/
.video-wrapper {
aspect-ratio: 16 / 9;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Sticky headers without JavaScript scroll listeners
The old way used JavaScript scroll events and getBoundingClientRect to toggle a class. Sticky positioning does it in one property. _/
.header {
position: sticky;
top: 0;
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Scroll-linked animations without a library
Fade-in-on-scroll used to mean IntersectionObserver, GSAP, or AOS.js. CSS can now trigger animations based on scroll position, zero JavaScript, smooth 60fps. _/
@keyframes reveal {
from { opacity: 0; translate: 0 40px; }
to { opacity: 1; translate: 0 0; }
}

.reveal {
animation: reveal linear both;
animation-timeline: view();
animation-range: entry 0% entry 100%;
}
/_ No JS. GPU-accelerated. _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Nesting selectors without Sass or Less
Selector nesting was the #1 reason people reached for Sass. It's now built into CSS. Same & syntax, zero build tools. _/
/_ nav.css, plain CSS, no compiler _/
.nav {
display: flex;
gap: 8px;

& a {
color: #888;
text-decoration: none;

    &:hover {
      color: white;
    }

}
}

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ Responsive components without media queries
Media queries respond to the viewport. Components live in containers: sidebars, modals, grids. @container lets them respond to their actual available space. _/
.wrapper {
container-type: inline-size;
}

.card { grid-template-columns: 1fr; }

@container (width > 400px) {
.card {
grid-template-columns: auto 1fr;
}
}
/_ Adapts to its container, not viewport _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/

/_ - - - - - - - - - - - - - - - - - - - - - - - - - - _/
