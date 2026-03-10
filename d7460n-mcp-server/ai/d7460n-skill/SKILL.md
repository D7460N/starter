## Constraint

The MCP server is a development tool only.

Never create package managers, dependency managers,
build systems, or project scaffolding when following these instructions.

---

name: d7460n-skill
description: >-
  D7460N Architecture agent skill — instructs AI coding agents to enforce
  zero-dependency, CSS-only, semantic-HTML architecture rules during
  code generation and review.
license: MIT
metadata:
  author: D7460N
---

# D7460N Architecture Agent Skill

## Purpose

This skill instructs AI coding agents to enforce the D7460N Architecture
during code generation, review, and validation.

## Agent Instructions

When working on a D7460N project, you must:

1. **Analyze code** for architecture compliance before and after changes
2. **Enforce architecture rules** — all generated code must comply
3. **Validate semantic HTML** — no div, span, class, id, or data-* attributes
4. **Enforce CSS state logic** — all UI state via :has()/:empty on hidden inputs
5. **Enforce CRUD-only JavaScript** — no event listeners, querySelector only

## Architecture Summary

### HTML = Structure Only
- Semantic elements only (header, nav, main, article, section, aside, footer)
- Forbidden: div, span, class, id, data-*
- State machines: hidden checkbox/radio inputs inside label elements
- Navigation: radio inputs in label[role=button] inside nav
- Single index.html at project root
- Holy Grail layout via app-container custom element

### CSS = All UI Behavior
- CSS Grid only (never Flexbox)
- State machines via :has(), :not(), :empty on checkbox/radio inputs
- Visibility via :empty and :has() pseudo-selectors
- Light/dark mode via :root color-scheme
- No inline CSS
- No hard/static values

### JavaScript = Data Transport Only
- CRUD operations only via assets/js/api.js
- document.querySelector() exclusively
- oninput lifecycle for all API operations
- No addEventListener — ever
- No onclick or other user-initiated event handlers
- Stateless and idempotent

## MCP Server

The D7460N MCP Server provides machine-readable rules and validation.

Run: `npx tsx d7460n-mcp-server/server.ts`

Available tools: get_d7460n_rules, validate_html, validate_css, validate_js,
validate_project, generate_d7460n_starter, explain_d7460n_rule, ping
