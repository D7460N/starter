# TOOLS.md — D7460N Tooling Contract

## 1. PURPOSE

This file defines the **tools, capabilities, and allowed execution surface** available to the agent.

It acts as the **agent’s toolbelt**.

All tool usage must:

- respect D7460N Architecture
- maintain separation of concerns
- avoid introducing UI logic into JavaScript

---

## 2. TOOL MODEL

Tools are external capabilities the agent can invoke.

In modern agent systems, tools are typically exposed via:

- Model Context Protocol (MCP)
- CLI commands
- APIs
- local scripts

MCP is an open standard that allows AI agents to connect to tools, data, and systems in a consistent way.

---

## 3. CORE TOOL CATEGORIES

### 3.1 DATA TOOLS (PRIMARY)

Allowed:

- API requests (REST, GraphQL)
- JSON retrieval
- data transformation
- schema normalization

Purpose:

- supply runtime data to the UI
- never define UI behavior

---

### 3.2 FILE SYSTEM TOOLS

Allowed:

- read files
- write files
- update memory files
- create structured outputs

Restrictions:

- do not generate unnecessary files
- do not duplicate logic across files

---

### 3.3 MCP TOOLS (EXTENDED CAPABILITIES)

MCP servers allow integration with:

- databases
- browsers (Playwright)
- external APIs
- documentation systems

These tools enable:

- real-time data access
- automation workflows
- external system interaction :contentReference[oaicite:1]{index=1}

---

### 3.4 DOCUMENTATION TOOLS

Allowed:

- MDN (primary reference)
- W3C specifications
- WCAG guidelines

Purpose:

- validate standards compliance
- ensure correct usage of native browser features

---

## 4. TOOL USAGE RULES

All tools must follow:

### 4.1 Architecture Compliance

Tools must NOT:

- introduce UI logic
- modify presentation behavior
- inject HTML structure

---

### 4.2 Data-Only Constraint

All tool outputs must be:

- pure data
- structured (JSON preferred)
- free of markup

---

### 4.3 Deterministic Behavior

Tool usage must be:

- predictable
- repeatable
- side-effect controlled

---

### 4.4 Minimalism

Use the **least number of tools required**.

Do not:

- chain unnecessary tools
- introduce complexity
- over-engineer solutions

---

## 5. TOOL PRIORITY

When solving tasks:

1. Native browser capability
2. Existing project data
3. External tools (MCP, APIs)

Tools are a last resort — not the default.

---

## 6. TOOL DEFINITIONS (LOGICAL)

### fetchData

Purpose:
Retrieve data from external or internal APIs

Output:
JSON only

---

### transformData

Purpose:
Normalize and prepare data for rendering

Output:
JSON only

---

### persistMemory

Purpose:
Update `.agents/MEMORY.md`

Usage:

- store architectural insights
- record constraints
- persist decisions

---

### readContext

Purpose:
Load relevant files:

- AGENTS.md
- SOUL.md
- MEMORY.md
- TOOLS.md

---

## 7. PROHIBITED TOOL USAGE

The following are strictly forbidden:

- tools that manipulate DOM for presentation
- tools that generate HTML dynamically
- tools that manage UI state
- tools that introduce frameworks or dependencies

---

## 8. SECURITY POSTURE

Tool usage must:

- minimize attack surface
- avoid exposing secrets
- avoid unnecessary external calls

Note:

MCP tools may execute commands or access systems, so misuse or incorrect configuration can introduce risk if not controlled properly :contentReference[oaicite:2]{index=2}

---

## 9. FAILURE MODE

If a tool:

- violates architecture
- produces UI logic
- introduces ambiguity

You MUST:

1. STOP immediately
2. IDENTIFY the issue
3. ASK for clarification

---

## 10. INTENT

Tools exist to:

- supply data
- extend capability
- automate workflows

They do NOT exist to:

- replace architecture
- introduce abstraction
- bypass constraints

---

## 11. FINAL RULE

Tools are servants of the architecture.

They must never redefine it.
