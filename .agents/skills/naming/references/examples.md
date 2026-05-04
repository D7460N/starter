# Naming Examples

Concrete good and bad names for each kind of named thing in the architecture.

## Files

| Good | Bad | Why bad |
|---|---|---|
| `layout.css` | `holy-grail.css` | Implementation detail in the name |
| `layout.css` | `grid-layout.css` | Implementation detail |
| `themes.css` | `dark-mode.css` | Half the concern |
| `themes.css` | `oklch-themes.css` | Color model in the name |
| `transitions.css` | `animations.css` | Different concept; transitions are state-driven |
| `inputs.css` | `forms.css` | Forms include layout and validation; inputs is the field-control concern |
| `state-machines.css` | `checkboxes.css` | Implementation in the name |
| `api.js` | `fetch-utils.js` | Implementation; the concern is "API transport" |
| `oninput.js` | `event-handlers.js` | The architecture has one event lifecycle; the file name names it directly |
| `storage.js` | `local-storage.js` | The concern survives a switch between localStorage and another mechanism |
| `app.js` | `main.js` | "Main" is generic; "app" matches the project's role |

## Active vs. inactive marker

| Active | Inactive (one underscore) | Older inactive (more underscores) |
|---|---|---|
| `typography.css` | `typography_.css` | `typography__.css` |
| `fonts.css` | `fonts_.css` | — |

Underscores are appended at the end of the basename, before the extension.

## Custom element tags

| Good | Bad | Why bad |
|---|---|---|
| `<app-container>` | `<app-wrapper>` | "Wrapper" describes implementation, not concern |
| `<app-logo>` | `<brand-mark>` | Inconsistent prefix (the architecture uses `app-` for layout slots) |
| `<app-banner>` | `<notification-bar>` | Inconsistent prefix |
| `<product-name>` | `<productName>` | Invalid (no hyphen, mixed case) |
| `<row-id>` | `<id>` | Invalid (no hyphen for custom element) |

## Skills

| Good | Bad | Why bad |
|---|---|---|
| `html` | `semantic-html` | Adjective stack |
| `css` | `modern-css` | Adjective in the name (the implementation evolves; "css" survives) |
| `state-machines` | `radio-checkbox-pattern` | Implementation in the name |
| `naming` | `naming-conventions` | "Conventions" is filler |
| `security` | `secure-by-default` | Filler |

## Functions

| Good | Bad | Why bad |
|---|---|---|
| `toTagName(key)` | `toKebab(key)` | Implementation (kebab-case) in the name |
| `fetchPage(suffix)` | `getStuff()` | Vague |
| `clearFieldset(el)` | `reset(el)` | Too generic — "reset" what? |
| `removeInlineStyles(el)` | `cleanup(el)` | Too generic |

## CSS custom properties

| Good | Bad | Why bad |
|---|---|---|
| `--surface-1` | `--bg-blue-100` | Color value in the name; if brand changes, name lies |
| `--accent` | `--primary-blue` | Color in the name; "primary" is also vague |
| `--text-1`, `--text-2` | `--gray-700`, `--gray-900` | Color values |
| `--inner-radius` | `--radius-sm` | Size designation `sm` is implementation; the concern is "the inner radius" |
| `--transition-duration` | `--fast-time` | Vague |

## Cross-file references

| Good | Bad |
|---|---|
| `See references/state-machines.md` (text reference) | `references/state-machines.md` as a symlink to `../html/references/state-machines.md` |

Text references are visible, portable, and survive copy/paste. Symlinks introduce invisible context and break portability.

## When two skills cover the same concept

When a topic legitimately spans two concerns (e.g., state-machines have an HTML side and a CSS side), each skill keeps its own reference file with its perspective:

- `html/references/state-machines.md` — the markup side
- `css/references/state-machines.md` — the styling side

They reference each other in their "Reference" sections by text path, never as a single file linked in two places.
