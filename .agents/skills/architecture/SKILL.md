---
name: architecture
description: Entry point for projects following the air-gapped, browser-native, declarative-first architecture. Defines the layer separation (html, css, javascript, json) and routes to the concern skill for any task. Use when starting any work, when in doubt which concern owns a task, or when about to mix concerns.
license: MIT
metadata:
  version: "1.0.0"
---

# Architecture

The browser is the framework and IDE. This architecture is not anti-framework; it is simplicity-first and framework-compatible. Every concern is air-gapped from every other concern. There is exactly one way to do each thing, which removes guessing, mistakes, and rework.

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
