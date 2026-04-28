# Console Decision Tree Logging Standard

## Purpose

Establish a deterministic, dependency-free, text-based decision tree visualization format for browser console output.

This format must:

- Work in **all browser consoles**
- Require **zero dependencies**
- Use **plain text only**
- Match architectural documentation exactly
- Visually confirm that runtime behavior matches intended decision flow
- Clearly show:
  - WHERE execution went
  - WHICH branches were chosen
  - WHERE execution failed
  - WHY it failed (in a separate details section)

This is not decorative logging.  
This is architectural integrity validation.

---

# Core Principles

1. Every box must represent a real architectural unit:
   - A utility file
   - An exported function
   - A real conditional decision
2. No fake or cosmetic boxes.
3. Runtime output must be data-driven.
4. Documentation and console output must use identical visual grammar.
5. Console output must reflect actual execution path — never assumed structure.

---

# Visual Grammar

All visual output must use ASCII-compatible box characters.

## Standard Box

```
┌─────────────┐
│ functionName()                      │
└─────────────┘

```
Width should remain consistent across the entire tree.

---

## Decision Box

```
┌─────────────┐
│ isConditionMet()?                  │
└─────────────┘

```
A decision box must represent a real boolean branch.

---

## Execution Box with Status

```

┌─────────────┐
│ loadLocalConfig() ✓              │
└─────────────┘

```

Status markers (right-aligned):

- ✓  = success
- ✗  = failed
- SKIP = skipped
- →  = delegated
- ↺  = re-entered

---

## Failure Box

```
┌─────────────┐
│ fetchRemoteConfig() ✗         │
│ FAILED                                   │
└─────────────┘

```

Failure must be visually obvious inside the box.

---

# Decision Tree Structure

Decision trees must branch horizontally.

Example:

```
                          ┌─────────────┐
                          │        pageLoad()                     │
                          └─────────────┘
                                                    │
                                                    ▼
                          ┌─────────────┐
                          │     isFirstVisit()?                      │
						  └─────────────┘
                                             │               │
                                            YES             NO
                                             │               │
                                             ▼               ▼
┌─────────────┐   ┌─────────────┐
│     showOnboarding()            │   │     isLocalFile()?                       │
└─────────────┘   └─────────────┘
	
	```

Branches must reflect real conditional logic.

---

# Runtime Execution Path Rendering

When running code, render only the actual path taken OR render full tree with chosen branches marked.

Example (chosen path only):

```
┌─────────────┐
│ isFirstVisit()? ✗                       │
└─────────────┘
                         │
                         ▼
┌─────────────┐
│ isLocalFile()? ✓                      │
└─────────────┘
                         │
                         ▼
┌─────────────┐
│ loadLocalConfig() ✓              │
└─────────────┘

```

---

# Failure Reporting Standard

The tree must show WHERE failure occurred.

Detailed explanation must appear below the tree.

Example:

```

FAILED AT: fetchRemoteConfig()

```
