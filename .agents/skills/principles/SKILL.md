---
name: principles
description: The foundational engineering principles every D7460N effort obeys, one section per principle. These sit beneath the concern skills (html/css/javascript/json/…) and decide trade-offs when a task could be solved more than one way. Use when choosing an approach, justifying a design, resolving "which tool", or reviewing whether a change earns its place.
license: MIT
metadata:
  version: "1.0.0"
---

# Principles

Concern skills say *what* each layer may do. These principles say *how to decide* when there is a choice. They are foundational to any effort that leverages the D7460N Architecture. When a principle and a concern skill agree, follow them. When they appear to conflict, surface it to the user — never resolve silently.

Each principle below carries: the **rule**, the **why**, how it **shows up** in this architecture, and the **tell** (how to catch a violation).

## Least Power

- **Rule:** For any task, use the least powerful technology that expresses the intent declaratively. Ask in order — can HTML do it? If not, can CSS? Only then JS. JS is never used for the presentation layer.
- **Why:** Less powerful tools are more portable, more inspectable, harder to misuse, and outlive frameworks.
- **Shows up:** semantic HTML for structure; CSS for all UI/state/visibility; JS only for data transport on the `oninput` lifecycle.
- **Tell:** a script doing what a selector could (`:has()`, `:empty`, `:checked`) is a Least-Power violation — re-engineer to the lower tool.

## Separation of Concerns (the air-gap)

- **Rule:** Each concern is independent; a change in one produces no change in another. HTML never names a CSS class; CSS never reads JS state; JS never writes presentation; JSON never carries markup.
- **Why:** Air-gapped layers can be read, tested, and replaced in isolation, and enable a strict CSP with no `unsafe-*` (see the `security` skill).
- **Shows up:** the four-layer table in the `architecture` skill; one concern per file.
- **Tell:** the `architecture` skill's air-gap test — if an HTML change forces a CSS/JS change, the design is wrong.

## DRY — one source of truth

- **Rule:** Every fact lives in exactly one place. Do not restate a rule, value, or datum that already exists elsewhere.
- **Why:** Duplication drifts out of sync and doubles maintenance.
- **Shows up:** canonical laws in ONE file (`Autocss-com/ai` AGENTS.md); `PROGRESS.json` as the single backlog source; design tokens as custom properties set once; the `@layer` order derived from `<link>` order, not a second master list.
- **Tell:** a value or rule copied into two files — collapse to one and reference it.

## Minimum Entropy / Minimal New Code

- **Rule:** Adding code or files always increases entropy. The default is to add nothing. The best solution adjusts an existing behavior to meet the ask with no new code.
- **Why:** Every line and file is future maintenance and future risk.
- **Shows up:** new utilities/patterns/files only on explicit user instruction; prefer tuning an existing rule over writing a new one.
- **Tell:** reaching for a new file/function before proving the existing ones cannot express the intent.

## Simplicity over Complexity

- **Rule:** Prefer the simpler construction. "Simplicity is the ultimate sophistication."
- **Why:** Simple systems are readable end-to-end by any qualified person and fail in obvious ways.
- **Shows up:** flat semantic markup over nested wrappers; one obvious way to do each thing; CSS Grid instead of wrapper-and-flex stacks.
- **Tell:** if explaining the mechanism needs a diagram of layers, look for the simpler expression first.

## Universal Compatibility & Interoperability

- **Rule:** Build on web standards so the output works everywhere the platform does, and so other systems can embed it without a fight.
- **Why:** Standards are the widest, longest-lived contract.
- **Shows up:** keeping our own styles in low-priority `@layer`s so a consumer's unlayered styles win by default (see the `css` `layers` reference); zero framework lock-in.
- **Tell:** a construction that only works inside this app's assumptions, not as a portable static resource.

## Browser-Native Accessibility (baked-in)

- **Rule:** Prefer cross-browser, browser-native accessibility features and engineer the UI to depend on them — accessibility is a load-bearing part of the design, not a bolt-on.
- **Why:** Native semantics and states are free, correct, and survive refactors.
- **Shows up:** `:focus-visible`, native form control states, semantic elements, keyboard-operable state machines; honoring `prefers-reduced-motion` / forced-colors (see the `css` `a11y` reference).
- **Tell:** a control that is invisible to keyboard/AT (e.g. a focusable element hidden with `display:none`) — fix so native accessibility carries it.

## Minimum O&M

- **Rule:** Minimize the operations-and-maintenance surface: fewer moving parts, fewer dependencies to patch, fewer build steps.
- **Why:** The cheapest system to run is the one with the least to maintain.
- **Shows up:** no bundler/compiler, no runtime dependencies, static shell deployable anywhere.
- **Tell:** a convenience that adds an ongoing operational burden (a service to keep alive, a dependency to keep patched).

## Future-Proofing — zero third-party dependencies

- **Rule:** Zero third-party (non-native-browser) dependencies. Third-party = any code that cannot render natively in an evergreen browser without help.
- **Why:** The platform outlives every framework; native features do not get abandoned.
- **Shows up:** no npm runtime packages, no CDN scripts; self-host fonts and assets; use cutting-edge native CSS instead of libraries (anchor positioning instead of Popper, popover instead of a menu lib).
- **Tell:** a CDN `<link>`/`<script>` or an npm runtime import — replace with the native capability or self-host.

## Usability — for end-users AND future developers

- **Rule:** Optimize for the people who use the surface daily *and* the developers who maintain it. Both deserve clarity.
- **Why:** A system only succeeds if both audiences can work with it.
- **Shows up:** data rendered as `<ul>`/`<li>` so CSS can reshape it on the user's terms (list/card views); names that describe the concern so the next developer isn't misled (see the `naming` skill).
- **Tell:** a choice that helps the machine but confuses a person reading the code or using the app.

## Reuse before Create

- **Rule:** Review and reuse existing functions, patterns, and files before making new ones.
- **Why:** Reuse keeps entropy low and behavior consistent.
- **Shows up:** each skill catalogues the permitted utilities; check them first.
- **Tell:** writing a helper that duplicates one already in `assets/js/` or a pattern already in a skill.

## Never New Patterns

- **Rule:** All patterns here are already established and documented in a skill. If a task seems to need a new pattern, the design is wrong — re-engineer until an existing pattern fits.
- **Why:** A fixed pattern vocabulary is what makes the system readable end-to-end.
- **Shows up:** state machines, `oninput` lifecycle, data-flow rendering, `@layer` cascade — the whole vocabulary lives in the skills.
- **Tell:** inventing a mechanism not found in any skill — stop and find the established one.

## Verify and cite (standards-first)

- **Rule:** Never guess. Verify feature behavior and support against authoritative sources (MDN Web Docs + BCD, the `modern-web-guidance` reference) and cite them. Those sources are advisory and subordinate — on any conflict, the D7460N rules win, but the duty to consult and reconcile is canonical.
- **Why:** A claim of correctness is not correctness; the platform moves and only fresh checks catch drift.
- **Shows up:** the css references' dated "Baseline & support" sections; `@supports` feature-detection over assumption.
- **Tell:** an assertion about support or behavior with no source and no recent check.

## When principles conflict

Surface the conflict to the user with the trade-off named. The user is the sole arbiter. Never pick silently, and never let one principle quietly override another without saying so.

## Reference

- MDN Web Docs (authoritative platform reference): https://developer.mozilla.org/
- W3C TR index (standards): https://www.w3.org/TR/
- W3C — Rule of Least Power: https://www.w3.org/2001/tag/doc/leastPower.html
- D7460N Architecture + Response Integrity Charter (canonical): https://github.com/Autocss-com/ai/blob/main/AGENTS.md
