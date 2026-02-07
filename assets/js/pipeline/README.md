Below is **formal developer documentation** for the D7460N Pipeline.
It is written for **mixed audiences**: developers who *don’t yet understand it* and developers who are *debugging or extending it*.
It prioritizes **orientation, entry/exit points, and mental models** over theory.

---

# D7460N Pipeline

### Developer Reference & Orientation Guide

---

## 1. What You Are Looking At (Read This First)

The `pipeline/` directory is **not application code**.

It is a **governed, reusable, data → structure pipeline** whose sole job is to:

> Take arbitrary data and deterministically project it into a **pre-existing semantic HTML skeleton**, then **get out of the way** so CSS can render the UI.

If you are looking for:

* UI logic → **it is not here**
* layout decisions → **it is not here**
* component systems → **it is not here**
* framework glue → **it is not here**

You are in the right place **only if** you are concerned with:

* data intake
* data meaning
* structure population
* architectural guarantees

---

## 2. High-Level Mental Model

Think of the pipeline as a **conveyor belt**:

```
API Data
  ↓
Validation
  ↓
Meaning (Schema)
  ↓
Allowed Regions
  ↓
Structural Projection
  ↓
CSS takes over
```

At no point does JavaScript:

* decide layout
* decide visibility
* decide styling
* decide interaction behavior

---

## 3. Directory Contract

```
js/
  pipeline/
    01-api-on-input.js
    02-normalize-payload.js
    03-require-payload.js
    04-select-schema.js
    05-schemas.js
    06-intent-regions.js
    07-insertion-rules.js
    08-diagnostics.js
    09-process-payload.js
    10-to-tag-name.js
    11-project-record.js
    12-project-collection.js
    13-insert-plan.js
    14-run-pipeline.js
```

**Rules:**

* Files are ordered **by execution order**
* Higher numbers must not import lower-numbered files incorrectly
* Nothing outside `pipeline/` may mutate pipeline internals
* `pipeline/` is stable, slow-moving, and reviewed

---

## 4. Entry Point (Most Important)

### **`14-run-pipeline.js`**

```js
runPipeline(url, root, options)
```

This is the **only public entry point**.

If you are asking:

> “Where does this start?”

**It starts here.**

### What it does:

1. Fetches data from an API
2. Processes it through the pipeline
3. Inserts it into the DOM structure

### What it does NOT do:

* does not know about UI
* does not know about pages
* does not know about frameworks
* does not know about features

If something breaks:

* set breakpoints here
* watch what comes out of each `.then()`

---

## 5. Exit Points (Where Data Leaves the Pipeline)

There are **two exit points**:

### Exit 1 — DOM Structure

* Data is projected into:

  * `<ol>` (collections)
  * `<li>` (rows)
  * semantic data-wrapper elements (fields)

After this:

* the pipeline is done
* CSS owns everything

### Exit 2 — Diagnostics

* Console output via `logBoundary`
* Used to understand **where the pipeline stopped**

The pipeline never throws UI errors.
It fails **structurally and observably**.

---

## 6. File-by-File Responsibility (Quick Reference)

### 01 — `api-on-input`

**Responsibility:** Transport

* Makes API call
* Returns data or `null`
* Logs success/failure only

---

### 02 — `normalize-payload`

**Responsibility:** Shape

* Optional transform
* No assumptions
* Returns payload or `null`

---

### 03 — `require-payload`

**Responsibility:** Presence guard

* Stops pipeline if data missing
* Logs why

---

### 04 — `select-schema`

**Responsibility:** Meaning selection

* Chooses which schema applies
* Schema = meaning, not UI

---

### 05 — `schemas`

**Responsibility:** Meaning definitions

* Enterprise / domain / local
* Intents like:

  * navigational
  * primary-content
  * status
  * temporal
* No rendering logic

---

### 06 — `intent-regions`

**Responsibility:** Semantic permission

* Which intents may populate which regions
* Not layout
* Not rendering

---

### 07 — `insertion-rules`

**Responsibility:** Structural policy

* append vs replace
* preserve order vs sorted
* limits

---

### 08 — `diagnostics`

**Responsibility:** Observability

* Logs pipeline boundaries
* Never changes behavior

---

### 09 — `process-payload`

**Responsibility:** Orchestration

* Produces a **plan**
* No DOM access

---

### 10 — `to-tag-name`

**Responsibility:** Key → tag normalization

* Enforces HTML custom-element rules
* Guarantees dash rules
* Only place dash logic exists

---

### 11 — `project-record`

**Responsibility:** Row projection

* One record → one `<li>`
* One field → one semantic wrapper
* Never skips fields
* Uses `<no-key>`, `<no-value>`, `<invalid-key>`

---

### 12 — `project-collection`

**Responsibility:** Dataset projection

* Iterates arrays
* Manages `<li>` lifecycle
* Calls `projectRecord`

---

### 13 — `insert-plan`

**Responsibility:** Region application

* Applies plan to allowed regions
* Bridges meaning → structure

---

## 7. HTML Assumptions (Critical)

The pipeline **does not create layout**.

The following **must already exist**:

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

If this skeleton is wrong:

* the pipeline will not compensate
* diagnostics will tell you where it stopped

---

## 8. CSS Responsibilities (Not Optional)

CSS must handle:

* layout mode (table / cards / tree)
* visibility
* empty-state messaging
* comparison views
* user preferences

The pipeline **intentionally renders empty elements** so CSS can detect:

* `:empty`
* `:has()`

This is a feature, not a bug.

---

## 9. Common Developer Questions (Answered)

### “Why no components?”

Because components mix structure, behavior, and presentation.
This architecture separates them.

### “Why custom elements?”

They provide semantic hooks without JS registration or framework coupling.

### “Why not skip missing fields?”

Because structural consistency enables CSS-driven fallbacks and accessibility.

### “Why is this so strict?”

Because this pipeline is meant to scale across:

* thousands of apps
* many teams
* many data sources

---

## 10. How to Debug

1. Start at `runPipeline`
2. Watch the Promise chain
3. Observe `logBoundary` output
4. Inspect generated `<li>` children
5. Debug CSS if structure is correct

If structure is wrong → pipeline issue
If structure is right but UI is wrong → CSS issue

---

## 11. Governance Rule (Final)

If you are about to:

* add UI logic here
* add layout decisions here
* add app-specific behavior here

**Stop.**

This directory is **governed core**.

---

### End of Developer Documentation

This document should be kept **next to the pipeline directory** and treated as the canonical guide for anyone touching it.
