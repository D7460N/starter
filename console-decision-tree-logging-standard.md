# Console Decision Tree Logging Standard

## Purpose

Establish a deterministic, dependency-free, text-based decision tree
visualization format for browser console output.

This format must:

-   Work in all major browser consoles
-   Require zero external dependencies
-   Use plain ASCII box drawing characters
-   Match architectural documentation exactly
-   Visually confirm that runtime behavior matches intended decision
    flow
-   Clearly show:
    -   WHERE execution went
    -   WHICH branches were chosen
    -   WHERE execution failed
    -   WHY it failed (in a separate details section)

This is not decorative logging. This is architectural integrity
validation.

------------------------------------------------------------------------

# Core Principles

1.  Every box must represent a real architectural unit:
    -   A utility file
    -   An exported function
    -   A real conditional decision
2.  No cosmetic or placeholder boxes.
3.  Runtime output must be data-driven.
4.  Documentation and console output must use identical visual grammar.
5.  Console output must reflect actual execution path --- never assumed
    structure.
6.  Only actual runtime branches may be marked as active.

------------------------------------------------------------------------

# Visual Grammar

All visual output must use consistent-width ASCII box characters.

## Standard Box

┌──────────────────────────┐ │ functionName() │
└──────────────────────────┘

Width must remain consistent across the entire tree (recommended ≤ 30
characters).

------------------------------------------------------------------------

## Decision Box

┌──────────────────────────┐ │ isConditionMet()? │
└──────────────────────────┘

Decision boxes must represent real boolean logic.

------------------------------------------------------------------------

## Execution Box with Status

┌──────────────────────────┐ │ loadLocalConfig() ✓ │
└──────────────────────────┘

Status markers (right-aligned):

-   ✓ = success
-   ✗ = failed
-   SKIP = skipped
-   → = delegated
-   ↺ = re-entered

------------------------------------------------------------------------

## Failure Box

┌──────────────────────────┐ │ fetchRemoteConfig() ✗ │ │ FAILED │
└──────────────────────────┘

Failure must be visually obvious inside the box.

------------------------------------------------------------------------

# Decision Tree Structure

Decision trees must branch horizontally.

Example:

                      ┌──────────────────────────┐
                      │        pageLoad()        │
                      └──────────────────────────┘
                                   │
                                   ▼
                      ┌──────────────────────────┐
                      │     isFirstVisit()?      │
                      └──────────────────────────┘
                           │               │
                         YES             NO
                           │               │
                           ▼               ▼
        ┌──────────────────────────┐   ┌──────────────────────────┐
        │     showOnboarding()     │   │     isLocalFile()?       │
        └──────────────────────────┘   └──────────────────────────┘

Branches must reflect real conditional logic.

------------------------------------------------------------------------

# Runtime Execution Rendering Modes

## 1. Full Tree Mode

Render the complete decision structure and mark chosen branches.

## 2. Path-Only Mode

Render only the path actually taken during execution.

Both modes must reflect real runtime state.

------------------------------------------------------------------------

# Failure Reporting Standard

The tree must show WHERE failure occurred.

Below the tree, render a structured details section.

Example:

FAILED AT: fetchRemoteConfig()

DETAILS

\[fetchRemoteConfig()\] Reason: Network unreachable Status: 503 File:
fetchRemoteConfig.js Line: 42

Top section answers: - Where did it fail? Details section answers: - Why
did it fail?

------------------------------------------------------------------------

# Console Color Styling Requirements

Browser console styling must use native %c formatting only.

## Constraints

-   No external libraries
-   No ANSI color codes
-   No console extensions
-   Must work in Chrome, Firefox, Safari, and Edge
-   Must degrade gracefully if styling is ignored
-   Must reapply styles per line (styling does not persist)

## Required Color Semantics

Color must reinforce architectural meaning:

-   Active execution path\
    color: #ffffff; font-weight: bold;

-   Inactive branches (not taken)\
    color: #555555;

-   Failure nodes\
    color: #ff4d4f; font-weight: bold;

-   Warnings (optional)\
    color: #f0ad4e;

-   Async boundary (optional)\
    color: #17a2b8;

Each printed line must apply %c explicitly.

Example:

console.log("%c┌──────────────────────────┐", activeStyle)

Multi-line ASCII blocks must be printed line-by-line to preserve
per-line styling.

------------------------------------------------------------------------

# Layout Constraints

-   Recommended box width ≤ 30 characters
-   Avoid deep horizontal branching that exceeds console width
-   Output must remain readable if console window is resized

------------------------------------------------------------------------

# Architectural Alignment Requirement

This logging system must:

-   Represent real utility file traversal
-   Reflect real branching logic
-   Never hardcode expected paths
-   Never assume execution order
-   Be entirely data-driven

Console output must confirm:

Runtime behavior matches documented decision architecture.

------------------------------------------------------------------------

# Intent

This system serves as:

-   Runtime decision validator
-   Debugging aid
-   Architecture verification tool
-   Deterministic execution tracer
-   Documentation-to-runtime alignment mechanism

It is not cosmetic logging. It is a deterministic textual decision graph
engine.
