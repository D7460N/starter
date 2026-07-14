# AGENTS.md — D7460N/starter (project-specific ONLY)

**The canonical laws are NOT here.** They live in ONE file, once, for every project and
every AI vendor: **`Autocss-com/ai` → `AGENTS.md`** (Response Integrity Charter `C0`–`C8`
+ D7460N Architecture `1`–`15`). Never copy or restate them here.

**How they reach you:** clone the ai repo once and import it from your user-level memory —
then every repo on the machine gets them automatically, no per-repo file:

```bash
git clone https://github.com/Autocss-com/ai ~/.claude/ai
# ~/.claude/CLAUDE.md  ->  @~/.claude/ai/AGENTS.md
git -C ~/.claude/ai pull      # refresh the laws for ALL projects at once
```

**Conflict priority:** `Autocss-com/ai` AGENTS.md > this file > `.agents/SESSION-HANDOFF.md`.
On conflict, surface it to the user. **Never resolve silently.**

This file declares only what is TRUE OF THIS REPO and nothing else.

## 9. Project Structure

```html
<app-container>
  <app-banner></app-banner>
  <header><app-logo></app-logo><app-user></app-user></header>
  <nav><label><input type="radio" name="nav"></label></nav>
  <main><article><h1></h1><section></section></article></main>
  <aside></aside>
  <footer><app-legal></app-legal><app-version></app-version></footer>
  <app-banner></app-banner>
</app-container>
<script type="module" src="assets/js/app.js"></script>
```

## 10. Files

- `index.html` — full DOM
- `assets/css/*.css` — active files (no trailing underscores); one concern per file
- `assets/js/{app,oninput,api,storage,tour}.js` — data-layer modules
- `assets/images/app/` — project-functional assets
- `assets/images/brand/` — brand assets (logos, marks, color-bound imagery)
- `manifest.webmanifest` — PWA manifest
- `.agents/skills/*/SKILL.md` — concern-specific rules
- `.agents/skills/*/references/*.md` — deep references and citations
- `.agents/SESSION-HANDOFF.md` — current session state

Inactive: files with trailing underscores. `docs/` and `d7460n-mcp-server/` are not part of the front-end runtime.

## 13. Session Continuity

- At the start of every session, read [`.agents/SESSION-HANDOFF.md`](./.agents/SESSION-HANDOFF.md) before making implementation decisions.
- Re-assert the handoff Constraint Lock before coding changes.
- If `SESSION-HANDOFF.md` conflicts with this file or any skill, STOP and ask.

## 14. Routing — Which Skill Owns This Task

| Task | Skill |
|---|---|
| Page structure, regions, custom elements | [`html`](./.agents/skills/html/SKILL.md) |
| Layout, theme, state, transitions, any UI behavior | [`css`](./.agents/skills/css/SKILL.md) |
| API call, `oninput` lifecycle, storage, startup | [`javascript`](./.agents/skills/javascript/SKILL.md) |
| Data shape, schema, content payload | [`json`](./.agents/skills/json/SKILL.md) |
| JSON-to-element rendering for data tables | [`data-flow`](./.agents/skills/data-flow/SKILL.md) |
| Naming files, tags, skills | [`naming`](./.agents/skills/naming/SKILL.md) |
| Headers, CSP, hosting | [`security`](./.agents/skills/security/SKILL.md) |
| Manifest, service worker, install behavior | [`pwa`](./.agents/skills/pwa/SKILL.md) |

If a task touches more than one concern, do each part inside its own skill.

