---
name: html
description: HTML rules for projects following the air-gapped, semantic-only architecture. Defines the only allowed elements, the only allowed attributes, the only allowed patterns for interactive elements, and the canonical layout shell. Use whenever writing or reviewing markup, defining custom elements, or shaping the DOM.
license: MIT
metadata:
  version: "1.0.0"
---

# HTML

HTML is structure only. Semantic. Static. Pre-defined.

## Only these elements are allowed

53 elements. Anything not on this list is forbidden.

**Document:** `html`, `head`, `body`, `title`, `meta`, `link`, `script`, `noscript`, `template`, `slot`

**Layout regions:** `header`, `nav`, `main`, `aside`, `footer`, `article`, `section`, `hgroup`, `address`, `search`

**Headings and text:** `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`

**Lists:** `ul`, `ol`, `li`, `dl`, `dt`, `dd`

**Tables:** `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `caption`, `colgroup`, `col`

**Forms:** `form`, `fieldset`, `legend`, `label`, `input`, `select`, `option`, `optgroup`, `textarea`, `output`

**Media:** `figure`, `figcaption`, `picture`, `source`, `img`, `video`, `audio`, `track`

**Interactive:** `details`, `summary`, `dialog`, `menu`, `a`

**Inline semantic:** `time`, `mark`, `abbr`, `cite`, `code`, `pre`, `blockquote`, `q`, `strong`, `em`, `small`, `sub`, `sup`, `br`, `hr`, `wbr`

**Custom elements:** Any name containing a hyphen (e.g., `app-container`, `app-logo`, `app-user`, `app-legal`, `app-version`, `app-banner`).

## `div` and `span` are forbidden

Always. Use the semantic element that names the intent. If no semantic element fits, use a custom element with a hyphen in its name.

## Only these attributes are permitted on markup elements

- The native attributes defined for that element by the HTML specification (`href`, `src`, `type`, `name`, `value`, `for`, `action`, `method`, `alt`, `lang`, etc.)
- ARIA attributes (`role`, `aria-*`)
- Native state attributes (`open`, `hidden`, `disabled`, `required`, `checked`, `selected`)

**Forbidden attributes:** `class`, `id`, `data-*`, every `on*=` event handler attribute (including `onclick`, `oninput`, `onchange`, `onsubmit`, `onkeydown`, `onkeyup`, `onmousedown`, `onmouseup`, `onmouseover`).

There is no JavaScript in HTML markup. Ever. The `oninput` event used for the CRUD lifecycle is wired in `assets/js/oninput.js`, not in markup.

`style` attributes are forbidden. `<style>` tags are forbidden. CSS lives in `.css` files only.

## The interactive-element pattern

Interactive elements that are not intrinsically interactive (like `<button>`) use a hidden input inside a `<label>`. CSS reads the input's checked state via `:has()` and `:checked`.

**Form actions** use checkboxes:

```html
<label role="button" aria-label="Save">
  Save
  <input type="checkbox" aria-hidden="true" />
</label>
```

**Navigation** uses radios inside `<nav>`:

```html
<nav>
  <label>
    <input type="radio" name="nav" aria-hidden="true" />
  </label>
</nav>
```

The `aria-hidden="true"` keeps the input out of the accessibility tree; the label carries the accessible name and role. CSS hides the input visually via `[aria-hidden="true"] { display: none; }`. See `references/state-machines.md`.

`<button>` may be used where its native semantics fit. Never substitute a button for the label/input pattern.

## The canonical shell

A single `index.html` at project root. The shell is the same on every page; only the data inside changes.

```html
<app-container>
  <app-banner></app-banner>
  <header>
    <app-logo></app-logo>
    <app-user></app-user>
  </header>
  <nav>
    <label><input type="radio" name="nav" aria-hidden="true"></label>
  </nav>
  <main>
    <article>
      <h1></h1>
      <section></section>
    </article>
  </main>
  <aside></aside>
  <footer>
    <app-legal></app-legal>
    <app-version></app-version>
  </footer>
  <app-banner></app-banner>
</app-container>
<script type="module" src="assets/js/app.js"></script>
```

`<script type="module">` is one tag, outside `<app-container>`, immediately before `</body>`.

No layout wrappers. CSS Grid handles every region — see the `css` skill.

## Forms

Forms wrap fields in `<fieldset>` with a `<legend>`. Schema and rules come from JSON, not from HTML. See the `data-flow` skill.

## Card pattern

Cards exist only in plural as `ul` / `li`. Cards are not identity-bearing on their own. Use `<article>` only when a card has independent identity (a standalone post, a single product detail page) — not for repeated rows.

## Scrollable containers

Only `<section>`, `<ul>`, and `<ol>` are scrollable containers. No other element receives `overflow: auto` or `overflow: scroll`.

## Custom elements

Custom elements must contain a hyphen (HTML spec requirement). They carry no behavior on their own — they are semantic anchors for layout regions and content slots. JavaScript does not extend them. CSS targets them like any other element.

Generated custom elements (from JSON content) follow the naming rule in the `naming` skill: `toTagName()` produces a valid hyphenated tag from a JSON key.

## What HTML never does

- No JavaScript anywhere in markup
- No styling decisions
- No state storage outside native attributes (`checked`, `open`, `selected`)
- No layout via wrapper elements
- No content that should come from JSON

## References

- `references/state-machines.md` — checkbox and radio patterns inside labels
- `references/shell-layout.md` — full Holy Grail markup with regions
- `references/forms.md` — fieldset, legend, label patterns
- `references/custom-elements.md` — naming, semantics, no-behavior rule
- HTML element index: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
- ARIA roles: https://www.w3.org/TR/wai-aria-1.2/
- Custom elements: https://html.spec.whatwg.org/multipage/custom-elements.html
