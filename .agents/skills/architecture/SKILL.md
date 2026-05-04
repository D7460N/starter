---
name: architecture
description: Entry point for projects following the air-gapped, browser-native, declarative-first architecture. Defines the layer separation (html, css, javascript, json) and routes to the concern skill for any task. Use when starting any work, when in doubt which concern owns a task, or when about to mix concerns.
license: MIT
metadata:
  version: "1.0.0"
---

# Architecture

The browser is the framework and IDE. The web platform — HTML, CSS, JavaScript — is mature enough on its own to do everything frameworks do, and to do it better, because it is not burdened by the layers frameworks add. Every concern is air-gapped from every other concern. There is exactly one way to do each thing, which removes guessing, mistakes, and rework.

## Philosophy

This architecture assumes the **best** of developers, not the worst.

Frameworks pander to the lowest common denominator. They assume the developer cannot be trusted to write clean HTML, will reach for `<div>` everywhere, will mix concerns, will not study the platform. They wrap the platform in abstractions that hide it, then teach the developer the abstraction instead of the platform. The result is a wall of unknowable complexity — "mystery meat" — that produces tech debt by default and entrenches weakness while simultaneously over-engineering everything.

This architecture goes the other way. It assumes the developer is studious, diligent, and cares about craft. It trusts established standards — HTML, CSS, JavaScript — done well. It controls slop by demanding excellence, not by surrendering to it. The architecture is harder to follow than picking up a framework. That hardness is the point: it is what produces clean output, predictable behavior, and a system any qualified person can read end-to-end.

The architecture does not bend. When a design hits a dead end, the design is wrong — re-engineer until the platform's standard tools express it cleanly. Custom elements, classes, IDs, data-attributes, framework escape hatches: none of these are tools for papering over weak design. The fix is the design.

A few practical consequences:

- HTML is **div-less and span-less.** If a semantic element does not fit the intent's main meaning, the design is flawed — go to the parent and re-engineer. (See the `html` skill.)
- CSS is **the UI runtime**, not styling. It owns layout, state, transitions, themes, visibility, loading. Anything that can be expressed in CSS is expressed in CSS. (See the `css` skill.)
- JavaScript is **data transport only**, on a single `oninput` lifecycle. No event listeners, no UI logic, no DOM manipulation for presentation. (See the `javascript` skill.)
- JSON is **data only.** No markup, no styling, no flags. Data presence drives UI; absence hides it. (See the `json` skill.)

## End-user customization is a feature, not an edge case

Users — especially those who work with the same surface every day — earn the right to see their data their way. The architecture treats this as a primary design goal:

- Data tables are rendered as `<ul>` / `<li>` (see the `data-flow` skill) so CSS can present them as list view, card view, or other views without rebuilding the DOM.
- A consistent **zen-mode (full-screen)** affordance is planned across the architecture so users can promote the section they're working in to a full viewport, not a modal overlay.
- Theme follows system preference by default, with optional user override (see `css/references/themes.md`).
- All UI state is in the DOM, which means the user's choices persist naturally with storage utilities, not with framework state managers.

This is the inverse of the framework approach. Frameworks ship one rendering and harden it. The D7460N architecture ships the data and lets CSS reshape it on the user's terms.

## Air-gap principle

Each concern is independent. A change in one concern produces no change in any other.

| Concern | Owns | Knows nothing about |
|---|---|---|
| html | Structure, semantics | Style, behavior, data shape |
| css | All UI: layout, state, themes, visibility, transitions, loading | JavaScript, network, data shape |
| javascript | Data transport, oninput lifecycle, storage | UI, layout, presentation, state |
| json | Data shape and types | HTML, CSS, JavaScript, presentation |

Air-gap is enforced two ways:
- **No cross-references.** HTML never names a CSS class. CSS never reads JavaScript state. JavaScript never writes presentation. JSON never contains markup.
- **Each layer reads only its own concern.** CSS reads the DOM tree (semantic elements, native attributes, `:empty`, `:has()`). JavaScript reads JSON. HTML is static.

## Routing

Pick the concern skill for the task before doing anything else. If a task touches more than one concern, do each part inside its own skill.

| Task | Skill |
|---|---|
| Page structure, regions, custom elements | `html` |
| Layout, theme, state visualization, transitions, any UI behavior | `css` |
| API call, oninput lifecycle, storage, startup | `javascript` |
| Data shape, schema, content payload | `json` |
| JSON-to-element rendering for data tables | `data-flow` |
| Naming files, tags, skills | `naming` |
| Headers, CSP, hosting | `security` |

If the task is "make X visible when data arrives" → `css` (uses `:empty` / `:has()`), not `javascript`.
If the task is "fetch data when nav changes" → `javascript` (uses `oninput.js`), not `html`.

## Project shell

The single SPA entry point is `index.html` at project root. Layout regions:

```
app-container
├── header (app-logo, app-user)
├── nav    (radio inputs inside labels)
├── main   (article > h1 + section)
├── aside
└── footer (app-legal, app-version)
```

One `<script type="module">` before `</body>`, outside `app-container`.

## Standards alignment

This skill set follows the Agent Skills open standard at agentskills.io. Each skill is independently loadable, each follows the YAML frontmatter spec, each uses progressive disclosure (frontmatter ~100 tokens always loaded; SKILL.md body loaded on activation; references/ loaded only when the agent reads them).

## When in conflict

Conflicts in declared rules are surfaced to the user. The agent never resolves a contradiction silently. The user is the sole arbiter of what is correct.

## Air-gap test

Before any change ships, the change must pass:

1. Does this HTML change require any CSS or JS change? If yes, the air-gap is broken — fix the design.
2. Does this CSS rule require any JS, any specific data, or any class/id? If yes, fix the design.
3. Does this JS function touch the DOM for presentation? If yes, fix the design.
4. Does this JSON contain HTML or styling? If yes, fix the design.

The architecture exists to make these answers always "no."
```
├── aside
└── footer (app-legal, app-version)
```

One `<script type="module">` before `</body>`, outside `app-container`.

## Standards alignment

This skill set follows the Agent Skills open standard at agentskills.io. Each skill is independently loadable, each follows the YAML frontmatter spec, each uses progressive disclosure (frontmatter ~100 tokens always loaded; SKILL.md body loaded on activation; references/ loaded only when the agent reads them).

## When in conflict

Conflicts in declared rules are surfaced to the user. The agent never resolves a contradiction silently. The user is the sole arbiter of what is correct.

## Air-gap test

Before any change ships, the change must pass:

1. Does this HTML change require any CSS or JS change? If yes, the air-gap is broken — fix the design.
2. Does this CSS rule require any JS, any specific data, or any class/id? If yes, fix the design.
3. Does this JS function touch the DOM for presentation? If yes, fix the design.
4. Does this JSON contain HTML or styling? If yes, fix the design.

The architecture exists to make these answers always "no."
