# MEMORY.md — D7460N Architecture Persistent Memory

## 1. PURPOSE

This file stores **persistent, high-value knowledge** about the D7460N Architecture and this repository.

It exists because AI agents are stateless across sessions.  
This file preserves critical context so the agent does not repeat mistakes or lose architectural alignment. :contentReference[oaicite:0]{index=0}

This file is:

- always consulted before execution (when relevant)
- updated when new patterns or constraints are discovered
- concise, factual, and non-redundant

---

## 2. MEMORY RULES

Only store information that is:

- non-obvious
- repeatedly relevant
- architecturally significant
- unlikely to be inferred from code alone

DO NOT store:

- temporary notes
- task-specific details
- duplicate information already in AGENTS.md

Memory must remain:

- minimal
- structured
- high-signal

---

## 3. CORE ARCHITECTURAL MEMORY

### 3.1 Separation of Concerns (Absolute)

HTML → structure only
CSS → UI logic + state
JS → data only

This rule is immutable.

---

### 3.2 CSS is the Runtime

CSS is not styling.  
CSS is the **UI execution layer**.

All UI behavior must be expressed using:

- `:has()`
- `:empty`
- `:not(:empty)`
- `:checked`
- native attributes (`open`, `hidden`, `aria-*`)

---

### 3.3 JavaScript Constraints

JavaScript is strictly limited to:

- data retrieval
- data transformation
- data delivery

JavaScript must never:

- control UI state
- manipulate DOM for presentation
- generate HTML

---

### 3.4 HTML Constraints

- semantic elements only
- no classes
- no IDs
- no data-* attributes
- no unnecessary wrappers

HTML is static and pre-defined.

---

### 3.5 Data Model

- JSON contains **data only**
- no HTML in JSON
- all UI is derived from runtime data
- no hardcoded values in markup

---

### 3.6 SPA Constraint

- single `index.html`
- no multi-page routing
- navigation via radios + labels
- `oninput` triggers data loading

---

## 4. KNOWN PATTERNS

### 4.1 Conditional Rendering

Use CSS presence-based logic:

- `:empty` → no data
- `:has()` → data present
- attribute state → interaction

---

### 4.2 UI State Storage

UI state must be stored in:

- native inputs (radio, checkbox)
- native attributes

Never in JavaScript.

---

### 4.3 Rendering Model

- HTML exists first
- data fills structure
- CSS reveals/hides based on state

---

## 5. ANTI-PATTERNS (NEVER ALLOWED)

- JS-driven UI updates
- DOM manipulation for layout
- framework introduction (React, Vue, etc.)
- CSS frameworks or utility libraries
- dynamic HTML injection
- duplication of UI logic across layers

---

## 6. DECISIONS (PERSISTED)

### Decision: CSS-first architecture

Reason:

- reduces JavaScript attack surface
- improves performance
- increases determinism

---

### Decision: No classes/IDs

Reason:

- eliminates selector dependency complexity
- enforces semantic structure
- ensures portability

---

### Decision: Agent-driven enforcement

Agent must:

- enforce architecture strictly
- stop on violations
- request clarification when conflicts occur

---

## 7. LEARNED CONSTRAINTS

(Updated over time)

- Agents tend to default to JS → must be actively prevented
- Agents introduce classes by habit → must be blocked
- Agents assume dynamic rendering → must be corrected

---

## 8. MEMORY UPDATE RULE

When new information is discovered, only store if:

- it affects architecture
- it prevents repeated mistakes
- it improves consistency

```
## Insight: <short title>

<fact-based statement>

```

---

## 9. PRIORITY

When conflicts occur:

1. AGENTS.md
2. SOUL.md
3. MEMORY.md

MEMORY.md supports — never overrides — architecture.

---

## 10. INTENT

This file ensures the agent:

- remembers architectural constraints
- avoids repeated violations
- improves consistency over time

It is the **long-term continuity layer** for the D7460N system.
