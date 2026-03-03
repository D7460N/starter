# Console Decision Tree Logging Standard (Copilot Optimized)

## Objective

Implement a deterministic, zero-dependency, text-based decision tree
visualization system for browser console output.

This system must:

-   Use plain ASCII box characters only
-   Work in all major browser consoles
-   Require no external libraries
-   Match documentation structure exactly
-   Be fully data-driven
-   Clearly show:
    -   Execution path taken
    -   Branches not taken
    -   Failure location
    -   Failure details (below tree)

This is architectural validation, not decorative logging.

------------------------------------------------------------------------

# Core Rules

1.  Each box must represent a real architectural unit:
    -   Utility file
    -   Exported function
    -   Boolean decision
2.  Never render placeholder or cosmetic boxes.
3.  Never hardcode expected paths.
4.  Always reflect actual runtime state.
5.  Documentation and console output must use identical visual grammar.

------------------------------------------------------------------------

# Visual Grammar

All boxes must use consistent width (≤ 30 characters).

Standard Box:

┌──────────────────────────┐ │ functionName() │
└──────────────────────────┘

Decision Box:

┌──────────────────────────┐ │ isConditionMet()? │
└──────────────────────────┘

Execution Box with Status (right-aligned):

┌──────────────────────────┐ │ loadLocalConfig() ✓ │
└──────────────────────────┘

Failure Box:

┌──────────────────────────┐ │ fetchRemoteConfig() ✗ │ │ FAILED │
└──────────────────────────┘

------------------------------------------------------------------------

# Status Symbols

✓ = success\
✗ = failed\
SKIP = skipped\
→ = delegated\
↺ = re-entered

------------------------------------------------------------------------

# Tree Structure

Decision trees must branch horizontally.

Example structure:

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

Branches must reflect real boolean logic.

------------------------------------------------------------------------

# Rendering Modes

Full Tree Mode: - Render full decision structure - Mark active branches

Path-Only Mode: - Render only executed path

Both modes must use real runtime data.

------------------------------------------------------------------------

# Failure Reporting

Tree must show WHERE failure occurred.

Below tree, render:

FAILED AT: functionName()

DETAILS

\[functionName()\] Reason: Status: File: Line:

Top = location\
Details = cause

------------------------------------------------------------------------

# Console Styling Requirements

Use native console %c formatting only.

Constraints:

-   No external libraries
-   No ANSI color codes
-   Must work in Chrome, Firefox, Safari, Edge
-   Must degrade gracefully without styling
-   Reapply style per line

Color Semantics:

Active path\
color: #ffffff; font-weight: bold;

Inactive branches\
color: #555555;

Failure nodes\
color: #ff4d4f; font-weight: bold;

Warning (optional)\
color: #f0ad4e;

Async boundary (optional)\
color: #17a2b8;

Each line must be printed individually when styling is applied.

Example:

console.log("%c┌──────────────────────────┐", activeStyle)

------------------------------------------------------------------------

# Layout Constraints

-   Box width ≤ 30 characters
-   Avoid excessive horizontal depth
-   Output must remain readable when console is resized

------------------------------------------------------------------------

# Enforcement

This system must:

-   Represent real utility traversal
-   Reflect real branching logic
-   Remain entirely data-driven
-   Maintain documentation-to-runtime parity

Purpose:

Deterministic textual decision graph engine for runtime architecture
validation.
