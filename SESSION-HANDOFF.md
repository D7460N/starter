# Session Handoff — D7460N (2026-03-03)

## Purpose
Carry forward the exact decisions and non-negotiables from the last implementation session.

## Constraint Lock (must re-assert at start of next session)
- API CRUD calls must flow through the shared `oninput` lifecycle.
- Initial load must enter lifecycle via programmatic nav radio `.click()`.
- API base URL is declared once; only endpoint suffix varies.
- Shell content (`header`, `nav`, `footer`, `meta`) is fetched/injected once per runtime session.
- No event listeners (`addEventListener`) and no `onclick` usage.
- JS remains transport/injection + approved storage/startup wiring; CSS controls UI state.
- Do exactly requested scope (no more, no less). Never guess.

## Architecture State (current)
- Entry module: `assets/js/app.js`
- Lifecycle module: `assets/js/oninput.js`
- API transport module: `assets/js/api.js`
- Storage module: `assets/js/storage.js`
- Tour scaffold module: `assets/js/tour.js`
- HTML entry script in `index.html` points to `assets/js/app.js`

## Endpoint Model (split)
- Base: `https://6987f917780e8375a6874dcf.mockapi.io`
- Suffixes:
  - `shell`
  - `home`
  - `about`
  - `products`
  - `events`
  - `contact`
- Nav radio index maps to page suffix in `oninput.js`.

## Logging Policy (implemented)
- `console.clear()` on app startup and on each lifecycle run.
- Minimal timestamped success reports.
- Verbose timestamped failure reports with stage details and stack (when available).

## Data/Directory Notes
- Runtime data comes from API endpoints (not local JSON files).
- `assets/data` was removed as backup-only content.

## AI Instruction Files Updated
- `.github/instructions/d7460n-architecture.instructions.md`
- `.github/copilot-instructions.md`
- `CLAUDE.md`
- `skill.md`
- `.cursorrules`

These files were synchronized to include:
- modular JS runtime exception,
- shared `oninput` lifecycle rule,
- updated file responsibilities,
- JS runtime conventions section.

## Known Gotchas (already fixed)
- Startup bug from setting `radio.checked=true` before `.click()` (removed).
- Shell re-fetch per nav change due to wrong hydration keying (fixed with session hydration flag).

## Next Priority Options
1. Add shell freshness/version strategy (optional) to decide when shell rehydrate is required.
2. Activate tour endpoint logic in `tour.js` (currently scaffold/no-op).
3. Add explicit contract validation for shell/page payload shapes before injection.

## Start-of-Session Prompt Snippet
Use this at the top of the next session:

"Read and obey `.github/instructions/d7460n-architecture.instructions.md` and `SESSION-HANDOFF.md` first. Enforce constraint lock. No guessing. No scope creep. Preserve `oninput` lifecycle invariants."
