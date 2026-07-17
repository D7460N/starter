---
name: testing
description: How to verify D7460N work before it ships, in a zero-dependency architecture. Covers the air-gap test, driving the real app in a browser to observe behavior, verifying CSS-only state/visibility, and the accessibility passes. Test tooling is dev-only and never enters the shipped static shell. Use before committing any nontrivial change, or when asked to confirm something works.
license: MIT
metadata:
  version: "1.0.0"
---

# Testing

Verify by observing real behavior, not by asserting it. "It should work" is not a result. The Charter requires testing the solution before proposing it; this skill says how, without adding any runtime dependency.

## The prime rule: tests never ship

Test tooling (a browser driver, a script) is a **development** aid. It lives outside the deployed artifact — never in `index.html`, never in `assets/css/*.css`, never in the runtime `assets/js/*.js`. The shipped shell stays a zero-dependency static resource. Testing adds no third-party runtime dependency (see the `principles` skill).

## 1. The air-gap test (always, first)

Before anything else, run the four checks from the `architecture` skill:

1. Does this HTML change force any CSS/JS change? If yes, the air-gap is broken.
2. Does this CSS rule need any JS, specific data, or a class/id? If yes, fix the design.
3. Does this JS function touch the DOM for presentation? If yes, fix the design.
4. Does this JSON contain HTML or styling? If yes, fix the design.

A change that fails the air-gap test is wrong regardless of whether it "works" in the browser.

## 2. Drive the real app and observe

For any change with a runtime surface, exercise the actual flow and read the result — do not stop at "the file changed." A headless browser (e.g. Playwright, used **only** as a dev tool) is the standard way:

- Load `index.html`, trigger the flow (select a nav radio, inject data, resize the container).
- Read **computed** values (`getComputedStyle`) and DOM state, not source values.
- Confirm the observed behavior matches the intent, at the boundaries that matter.

This is how a CSS claim gets proven — e.g. "heading padding is 2rem when the container is wide" is verified by measuring `paddingTop` at a wide and a narrow viewport, not by reading the rule.

## 3. Verify the CSS-only behaviors on their own terms

The UI runtime is CSS, so test it as state, not as scripts:

- **Visibility from data:** with the target empty, the region is hidden (`:empty`); after injecting content, it shows (`:not(:empty)` / `:has()`).
- **State machines:** setting a radio/checkbox `:checked` produces the active visual state via `:has()` — no event handler involved.
- **Container response:** at a container width above/below the query threshold, the queried rule flips (measure a real declared property).
- **Cascade / layers:** when two rules could apply, confirm the intended one wins by layer/order — a later `@layer` beats an earlier one regardless of specificity.

## 4. Accessibility passes (native-first)

Because accessibility is load-bearing (see `principles` and the `css` `a11y` reference), verify the native behaviors:

- **Keyboard:** every interactive control is reachable by Tab and operable by keyboard. A focusable control hidden with `display:none` fails this — use the visually-hidden-but-focusable technique.
- **`prefers-reduced-motion`:** animations reduce or stop; motion-based affordances have a static equivalent (e.g. the loading spinner becomes static "Loading …" text).
- **Focus visibility:** `:focus-visible` outlines appear for keyboard users.
- **Forced colors / contrast:** check that state isn't conveyed by color alone.

## 5. Feature support is verified, not assumed

The architecture uses cutting-edge CSS. Before relying on a feature, confirm its support against MDN Web Docs + BCD and prefer `@supports` for graceful degradation. Record the check with a date (see the css references' "Baseline & support" sections). Experimental / Chromium-only features (scroll-state queries, `::scroll-button`/`::scroll-marker`, `corner-shape`) must degrade cleanly where unsupported.

## What testing never does

- Never ships a test framework, assertion library, or driver inside the deployed shell
- Never adds a runtime dependency to make something testable
- Never asserts success from source code alone — observe real, computed behavior
- Never treats a green unit check as proof a user-facing flow works — drive the flow
- Never skips the air-gap test under time pressure

## Baseline & support

_Checked against MDN as of 2026-07-16._

- `@supports` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@supports
- `getComputedStyle` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
- `prefers-reduced-motion` — **Baseline Widely available** — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- scroll-state container queries — **Limited availability** — https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries

**D7460N Architecture:** serves how to verify a change before it ships. Canonical rules: https://github.com/Autocss-com/ai/blob/main/AGENTS.md

## Reference

- MDN Testing (learn): https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing
- MDN `getComputedStyle`: https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
- MDN `@supports`: https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- Playwright (dev-only driver): https://playwright.dev/
- D7460N Architecture (canonical rules): https://github.com/Autocss-com/ai/blob/main/AGENTS.md
