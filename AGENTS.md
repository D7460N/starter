# AGENTS.md — D7460N/starter (project-specific ONLY)

**The canonical laws are NOT here.** They live in ONE file, once, for every project and
every AI vendor: **`D7460N-ai/D7460N.ai` → `AGENTS.md`** (Response Integrity Charter `C0`–`C8`
+ D7460N Architecture `1`–`15`). Never copy or restate them here.

**How they reach you:** clone the D7460N.ai repo once and import it from your user-level memory —
then every repo on the machine gets them automatically, no per-repo file:

```bash
git clone https://github.com/D7460N-ai/D7460N.ai ~/D7460N.ai
# ~/.claude/CLAUDE.md  ->  @~/D7460N.ai/AGENTS.md
git -C ~/D7460N.ai pull      # refresh the laws for ALL projects at once
```

**Conflict priority:** `D7460N-ai/D7460N.ai` AGENTS.md > this file > `.agents/SESSION-HANDOFF.md`.
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
- `.agents/skills/*/SKILL.md` — concern-specific rules: in `D7460N-ai/D7460N.ai` (see §14)
- `.agents/skills/*/references/*.md` — deep references and citations: in `D7460N-ai/D7460N.ai`
- `.agents/SESSION-HANDOFF.md` — current session state

Inactive: files with trailing underscores. `docs/` and `d7460n-mcp-server/` are not part of the front-end runtime.

## 13. Session Continuity

- At the start of every session, read [`.agents/SESSION-HANDOFF.md`](./.agents/SESSION-HANDOFF.md) before making implementation decisions.
- Re-assert the handoff Constraint Lock before coding changes.
- If `SESSION-HANDOFF.md` conflicts with this file or any skill, STOP and ask.

## 14. Routing — Which Skill Owns This Task

| Task | Skill |
|---|---|
| Page structure, regions, custom elements | [`html`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/html/SKILL.md) |
| Layout, theme, state, transitions, any UI behavior | [`css`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/css/SKILL.md) |
| API call, `oninput` lifecycle, storage, startup | [`javascript`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/javascript/SKILL.md) |
| Data shape, schema, content payload | [`json`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/json/SKILL.md) |
| JSON-to-element rendering for data tables | [`data-flow`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/data-flow/SKILL.md) |
| Naming files, tags, skills | [`naming`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/naming/SKILL.md) |
| Headers, CSP, hosting | [`security`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/security/SKILL.md) |
| Manifest, service worker, install behavior | [`pwa`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/pwa/SKILL.md) |
| SPA shell, radio-nav routing, view lifecycle, view transitions | [`spa`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/spa/SKILL.md) |
| Choosing an approach, trade-offs, "which tool / why this design" | [`principles`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/principles/SKILL.md) |
| Verifying a change before it ships | [`testing`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/testing/SKILL.md) |
| Session start/end, handoff, backlog, board, docs | [`session`](https://github.com/D7460N-ai/D7460N.ai/blob/main/.agents/skills/session/SKILL.md) |

If a task touches more than one concern, do each part inside its own skill.

