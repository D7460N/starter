# Console Decision Tree Logging Standard (Copilot -- ASCII Version)

## Objective

Implement a deterministic, zero-dependency, text-based decision tree
visualization system for browser console output using ASCII characters
only:

-   -   | 

This system must:

-   Work in all major browser consoles
-   Require zero external dependencies
-   Be fully data-driven
-   Match documentation exactly
-   Never exceed defined maximum widths
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
2.  Never render cosmetic boxes.
3.  Never hardcode expected paths.
4.  Always reflect actual runtime state.
5.  Documentation and console output must use identical visual grammar.
6.  All layout must respect MAX_TREE_WIDTH.

------------------------------------------------------------------------

# Visual Grammar (ASCII Only)

All boxes must use consistent width and only:

-   -   | 

Standard Box:

+-----------------------------+
|        functionName()       |
+-----------------------------+

Decision Split Example:

           +-----------------------------+
           |        isFirstVisit()?      |
           +--------------+--------------+
                          |
                +---------+---------+
                |                   |
         YES -> |                   | <- NO

------------------------------------------------------------------------

# Width Constraints

Define:

-   MAX_TREE_WIDTH (total allowable width)
-   BOX_WIDTH (internal box width)

Rules:

-   No single box may exceed BOX_WIDTH.
-   Side-by-side sibling boxes must not exceed MAX_TREE_WIDTH.
-   If siblings exceed width, fallback to vertical layout.
-   All content must wrap safely within CONTENT_WIDTH.
-   No overflow allowed.

------------------------------------------------------------------------

# Wrapping Rules

-   Text must wrap to CONTENT_WIDTH.
-   No line may exceed BOX_WIDTH.
-   Words longer than CONTENT_WIDTH must truncate with ellipsis.
-   Wrapped boxes must pad vertically so sibling boxes align in height.

------------------------------------------------------------------------

# Status Markers

Append status inside box:

+-----------------------------+
|     loadLocalConfig() ✓     |
+-----------------------------+

Symbols:

✓ = success\
✗ = failed\
SKIP = skipped\
→ = delegated\
↺ = re-entered

------------------------------------------------------------------------

# Failure Example

  -----------------------------
  fetchRemoteConfig() ✗ FAILED

  -----------------------------

Below tree:

FAILED AT: fetchRemoteConfig()

DETAILS

\[fetchRemoteConfig()\] Reason: Status: File: Line:

Top = location\
Details = cause

------------------------------------------------------------------------

# Console Styling Requirements

Use native console %c only.

Constraints:

-   No external libraries
-   No ANSI codes
-   Must work in Chrome, Firefox, Safari, Edge
-   Reapply style per line

Color Semantics:

Active path: color: #ffffff; font-weight: bold;

Inactive branches: color: #555555;

Failure: color: #ff4d4f; font-weight: bold;

------------------------------------------------------------------------

# Layout Engine Requirements

When rendering sibling boxes:

-   Compute available width
-   Divide width evenly
-   Wrap each box to allocated width
-   Pad vertically to equal height
-   Render row-by-row
-   If overflow risk → fallback to vertical

------------------------------------------------------------------------

# Purpose

Deterministic ASCII decision tree engine for runtime architecture
validation and documentation parity.
