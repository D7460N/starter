# D7460N Pipeline — Onboarding Cheat Sheet

## What this is

A **data → structure pipeline**.
It takes **any data** and projects it into a **pre-existing semantic HTML skeleton**, then **stops**.
CSS renders everything.

---

## What this is NOT

* Not a UI framework
* Not a component system
* Not layout logic
* Not app/business logic

If you’re looking for UI behavior, you’re in the wrong place.

---

## The One Thing You Call

**`runPipeline(url, root, options)`**

That’s it.
Everything else is internal.

---

## Required HTML (must already exist)

```html
<header></header>
<nav></nav>
<main>
  <article>
    <ol></ol> <!-- ONLY scroll region -->
  </article>
</main>
<aside></aside>
<footer></footer>
```

If this structure is missing, the pipeline will **not compensate**.

---

## Mental Model

```
Data → Meaning → Allowed Regions → Structure → CSS
```

JS **never** decides:

* layout
* visibility
* interaction
* styling

---

## File Order = Execution Order

```
01 api-on-input        → fetch
02 normalize-payload   → optional shaping
03 require-payload     → guard
04 select-schema       → meaning
05 schemas             → intent definitions
06 intent-regions      → where meaning may live
07 insertion-rules     → append/replace policy
08 diagnostics         → logging only
09 process-payload     → builds a plan
10 to-tag-name         → key → tag
11 project-record      → one row
12 project-collection  → many rows
13 insert-plan         → apply plan
14 run-pipeline        → public entry
```

Higher numbers depend on lower ones.
Never reverse this.

---

## How Data Appears in the DOM

* `<ol>` = dataset
* `<li>` = one record
* children of `<li>` = **semantic data wrappers**

Example:

```html
<li>
  <family-list-item>Smith</family-list-item>
  <no-value></no-value>
  <invalid-key></invalid-key>
</li>
```

This is intentional. CSS handles messaging via `:empty` and or HTML tag names.

---

## Custom Element Rules (enforced standards)

* Must contain **at least one dash**
* Dash **cannot be first character**
* Max ~4 words
* Deterministic
* Only `toTagName` enforces dash logic

**Never** add trailing dashes to placeholder tags.

---

## Debugging Checklist

1. Start at **`runPipeline`**
2. Watch console output from **`logBoundary`**
3. Inspect `<ol>` and `<li>` structure
4. If structure is wrong → pipeline issue
5. If structure is right but UI is wrong → CSS issue

---

## Common Mistakes (don’t do these)

* ❌ Adding UI logic to the pipeline
* ❌ Skipping missing fields
* ❌ Adding IDs/classes/data-*
* ❌ Creating layout in JS
* ❌ Adding framework dependencies

---

## Why this scales

* Works with **any data**
* Works with **any app**
* Works with **any framework**
* CSS owns UX
* JS stays deterministic
* One pipeline for thousands of apps

---

## Golden Rule

> **If you’re about to add behavior, stop.
> If you’re about to add structure, ask if it already exists.
> If you’re about to add UI logic, it does not belong here.**

---

**That’s all you need to be productive.**
