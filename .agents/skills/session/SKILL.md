---
name: session
description: Cross-session continuity and backlog/process rules — how project state, outstanding work, and documentation survive between sessions. Covers the session handoff, PROGRESS.json as the single backlog source, the GitHub Issues/Projects mirror, documentation maintenance, and the next-phase prompt. Use at the start and end of every session, and whenever tracking or handing off work.
license: MIT
metadata:
  version: "1.0.0"
---

# Session

Work spans many sessions and many AI vendors. Continuity is a discipline, not an accident. State lives in files, not in memory; the backlog has one source of truth; the mirror is one-way.

## Start of every session

1. Read `.agents/SESSION-HANDOFF.md` **before making any implementation decision**.
2. Re-assert the handoff's **Constraint Lock** before coding.
3. If the handoff conflicts with a skill, the `architecture` skill, or the canonical laws, **stop and ask** — never resolve silently (conflict priority: `Autocss-com/ai` AGENTS.md > repo AGENTS.md > `SESSION-HANDOFF.md`).

Skipping handoff review "to save time" is prohibited — it is the single largest cause of lost context and repeated mistakes.

## Single source of truth for outstanding work

`PROGRESS.json` (its `meta.future_goals` + `cursor.open_q`) is the **one** authoritative list of outstanding work. Keep structured state as data in `PROGRESS.json`; keep principles/rationale as concise prose in the skills/docs (JSON usually costs more tokens for prose).

Nothing competes with `PROGRESS.json`. Chat memory, scratch notes, and the issue tracker are all downstream of it.

## The GitHub mirror is one-way

GitHub **Issues** + the **Projects board** are a human-visible **mirror** of the backlog, never a competing tracker:

- Open an Issue for each new backlog / open-question item; **close** it when done.
- Title mirrors the item; body carries detail + a pointer to the `PROGRESS.json` / prompt entry; apply the `backlog` label.
- **Board columns are label-driven and status labels are mutually exclusive — never stack them.** Backlog column = `backlog` label only; In Progress = `in-progress` only (you must remove `backlog` when moving to In Progress); Done = the Issue **closed** (no status label). To move a card, **swap** the status label, never add a second. Grouping tags (e.g. `demo`) are orthogonal — keep them.
- Issues are effectively append-only (GitHub closes, never deletes) — create deliberately, avoid duplicates.
- If the board/toolset is unavailable in a session, **skip silently** — `PROGRESS.json` stays authoritative and the mirror catches up later.

## End of every session (the ritual)

Commit → update `PROGRESS.json` → append a session shard → update `SESSION-HANDOFF.md` → reconcile the GitHub mirror. Then write the **next-phase prompt**: a super-detailed brief for what the next session must do, holding all three contexts (immediate task, overall project intent, next-phase needs) so no context is dropped.

## Documentation maintenance (periodic, cost-driven)

Periodically optimize the docs **for AI accessibility/usability, not human reading**, to cut token cost — without dropping any detail, intention, plan, or context. Reduce redundancy; restate more concisely; prefer a short whitelist ("only X permitted; all else forbidden") over long blacklists when clearer for AI processing. Never duplicate a rule already stated — strengthen the existing wording instead (see the DRY principle).

## Standards consultation

Consult the standing references — `modern-web-guidance` and MDN Web Docs (search / doc / compat) — and periodically reconcile them against the app's current features. Their content is **advisory and subordinate**: on any conflict, the D7460N rules win. But the requirement to consult, to reconcile, and to *suggest* improvements is canonical. Identify ≠ apply — never silently change anything; confirm with the user first.

## What session-handling never does

- Never starts implementing before reading `SESSION-HANDOFF.md`
- Never treats chat memory or the issue tracker as the backlog source — `PROGRESS.json` is
- Never stacks `backlog` + `in-progress` labels, or invents new status labels
- Never resolves a documented-rule conflict silently — surface it to the user
- Never ends a working session without updating state + writing the next-phase prompt

## Reference

- D7460N Architecture + Response Integrity Charter (canonical): https://github.com/Autocss-com/ai/blob/main/AGENTS.md
- Agent Skills open standard: https://agentskills.io
- GitHub Projects (board automation): https://docs.github.com/issues/planning-and-tracking-with-projects
