---
name: naming
description: Naming rules for files, custom element tags, skills, functions, and CSS custom properties. Names describe the concern, not the implementation, so they survive refactors. Use whenever creating any new named thing or renaming an existing one.
license: MIT
metadata:
  version: "1.0.0"
---

# Naming

Names describe the **concern**, not the **current implementation**. A name should survive any internal change to how the thing works.

Good: `layout`, `transitions`, `state-machines`, `themes`
Bad: `holy-grail-layout`, `oklch-themes`, `radio-checkbox-state-machines`

If the implementation changes from oklch to OkLab, the name `themes` still describes the concern. The name `oklch-themes` would lie.

## Files

### Active vs. inactive

- **Active files** have no trailing underscore: `layout.css`, `themes.css`, `app.js`.
- **Inactive files** (preserved for reference but not loaded by the runtime) have one or more trailing underscores: `typography_.css`, `typography__.css`, `fonts_.css`. Multiple underscores indicate older inactive versions.

The trailing-underscore convention is a build-tool-free way to mark a file as not part of the active runtime while keeping it visible in the directory.

### File-name describes concern

| Concern | File |
|---|---|
| Reset rules | `reset.css` |
| Layout | `layout.css` |
| Typography | `typography.css` |
| Themes | `themes.css` |
| API transport | `api.js` |
| `oninput` lifecycle | `oninput.js` |
| Storage | `storage.js` |

Not:

| Bad | Why |
|---|---|
| `holy-grail.css` | Implementation, not concern |
| `dark-mode.css` | Half the concern (themes covers light + dark) |
| `fetch-utils.js` | Implementation; `api.js` is the concern |

## Custom element tags

Custom elements must contain a hyphen (HTML spec). Tag names describe the role:

- `app-container` — the layout root
- `app-logo` — the brand mark slot
- `app-user` — the user-info slot
- `app-legal` — the legal-text slot
- `app-version` — the version-display slot
- `app-banner` — optional notification slot

For data-rendered elements, see the `data-flow` skill — `toTagName(key)` produces the tag from a JSON key.

## `toTagName`, not `toKebab`

The function is named for what it does (produces a valid HTML tag name), not for the case style it happens to use. If the spec ever permitted other separators, the function name still describes the concern.

## Skills

Skills follow the same rule. Skill names describe the concern:

- `html` (concern: structural markup), not `semantic-html` (concerns and adjectives stack)
- `css` (concern: UI runtime), not `modern-css`
- `state-machines` (concern: how interactivity is encoded), not `checkbox-radio-pattern`

Standard requires lowercase letters, numbers, and hyphens only. No underscores in skill names. The skill directory name must match the `name` field in the YAML frontmatter.

## Functions

Function names describe what the function does, in verb form:

- `fetchJSON(url)` — fetches and returns JSON
- `toTagName(key)` — converts a key to a tag name
- `clearFieldset(el)` — clears a fieldset

Not:

- `helper()`, `process()`, `handle()` — vague
- `oklchHelper()` — implementation in the name

## CSS custom properties

CSS custom property names use double-hyphen prefix (CSS spec), then describe the concern:

- `--surface-1`, `--surface-2`, `--surface-3` — semantic surface levels
- `--text-1`, `--text-2` — semantic text levels
- `--accent` — the brand accent
- `--transition-duration`, `--transition-property`, `--transition-timing-function`

Not:

- `--blue-500`, `--red-700` — color name in the variable; if the brand changes, the name lies
- `--my-special-color` — vague

## Cross-file references

Cross-file references in documentation are **text references**, not symlinks. Always:

```markdown
See `references/state-machines.md` for the canonical pattern.
```

Never:

```
references/state-machines.md → ../html/references/state-machines.md   (symlink)
```

Reasoning: text references are visible in any file viewer, survive copy/paste, and produce no surprise file system behavior. Symlinks are invisible context that breaks portability.

## What naming never does

- Never names by implementation detail
- Never names by adjective stack (`modern-`, `semantic-`, `accessible-`)
- Never embeds a value in a name (`--color-blue` is bad; the value is `oklch(...)`, the concern is "brand")
- Never uses ambiguous names (`utils.js`, `helper()`, `data`)
- Never relies on symlinks for cross-file references

## References

- `references/examples.md` — concrete good and bad examples for each named-thing kind
- HTML custom elements naming rules: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
- CSS custom properties spec: https://www.w3.org/TR/css-variables-1/
- Agent Skills naming spec: https://agentskills.io/specification#name-field
