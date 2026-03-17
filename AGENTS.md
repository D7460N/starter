## 🧠 D7460N Org AGENT Defaults — Mandatory

Apply to *all* repos unless explicitly overridden. All AGENTS must follow these defaults.

---

### **Accuracy & Clarification**

* Use declarative methods.
* Do exactly what is asked — no more, no less.
* Accuracy > speed.
* On ambiguity, **stop and ask** before proceeding.
* Never guess.
* Use memory/context across sessions.
* Read entire file; ignore file caps/limits.

---

### **Stack & Core Constraints**

* Solutions must use **HTML + CSS only**.
* Combine modern HTML/CSS features as needed.
* JavaScript and all other languages (other than modern HTML and CSS) are forbidden unless explicitly stated.
* Ignore cross-browser concerns.
* JS allowed **only** for CRUD transport in `assets/js/api.js`.
* HTML = structure (semantic only; no `<div>`, `<span>`, `class`, `id`, `data-*`).
* CSS = ALL UI behavior (state, visibility, themes, loading, navigation, forms).
* No third-party dependencies.
* Single SPA (`index.html`) with PWA architecture.
* Layout = **CSS Grid only** (never Flexbox), full-bleed Holy Grail via `<app-container>`.

---

### **Standards & Accessibility**

* Use modern W3C/WCAG-compliant HTML/CSS with ARIA.
* Treat W3C & MDN as canonical references.

---

### **JavaScript Rules**

* JS must be minimal and scoped — exactly what is asked.
* No UI or interaction state in JS.
* Only `assets/js/api.js` for CRUD.
* Do not add/remove DOM unless instructed.
* Use `document.querySelector()` only.
* Trigger CRUD via `oninput`; no event listeners.
* Reuse existing JS functions and or utilities.
* JS must be stateless and idempotent.

---

### **HTML Rules**

* No HTML in JSON ever
* Use state machines interactive elements. for all `<label>` for interactive elements; no JS-driven `<button>`.
* Semantic, minimal structure.
* No extra layout wrappers; use Grid.
* Forms inside `<fieldset>` with schema/rules.

---

### **CSS Rules**

* Reuse existing CSS functions and or utilities
* Replace JS with modern CSS for everything except CRUD API data transfer.
* Control visibility with `:empty`, `:has()`, etc.
* Use modern queries and relative units; no static values.
* Manage light/dark via `:root`.
* Use a11y-aware selectors.
* *STATE MACHINES* use checkboxes/radios inside `<label role="button">`.

```
<label role="button">
  Save
  <input type="checkbox" aria-hidden="true" />
</label>
```

---

### **Navigation & State**

* SPA with no routing.
* Global nav = `<nav>` + radio `<label role="button">`.
* UI actions = hidden checkbox state machines; no JS handlers.

```
<nav>
  <label role="button">
    Nav item
    <input type="radio" name="nav" aria-hidden="true" />
  </label>
</nav>

```

---

### **Project Structure**

Single `index.html` at root:

```
<app-container>
  <header><app-logo></app-logo><app-user></app-user></header>
  <nav><label role="button"><input type="radio" name="nav" aria-hidden="true"></label></nav>
  <main><article><h1></h1><section></section></article></main>
  <aside></aside>
  <footer><app-legal></app-legal><app-version></app-version></footer>
</app-container>
```

One `<script type="module">` before `</body>`.

---

### **Files**

* `index.html` — full DOM
* `assets/css/layout.css` — layout + UI
* `assets/js/api.js` — CRUD only
* `assets/images/` — static assets
* Ignore other JS/CSS/data except PWA files

---

### **When Modifying**

* UI state, forms, nav, loading = CSS + HTML state machines.
* Use `aria-disabled`.
* Reuse existing patterns.
* Add code/files only when instructed.
* Follow instructions exactly.

---

### **Preferred Languages**

Default to modern **HTML and CSS** unless specified 
