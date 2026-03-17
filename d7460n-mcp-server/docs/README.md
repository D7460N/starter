# D7460N MCP Server

Standalone development tool providing authoritative D7460N Architecture
rules, validation, and code review assistance for AI coding agents.

The D7460N MCP Server and the D7460N Architecture are two separate entities.
This server is never used to bootstrap, scaffold, or generate D7460N projects.
It is never a dependency of any D7460N project. No D7460N project depends on
it at runtime or build time.

## Quick Start

```sh
npx tsx d7460n-mcp-server/server.ts
```

The server communicates via JSON-RPC 2.0 over stdio.

## Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "d7460n": {
      "command": "server.ts",
      "args": []
    }
  }
}
```

## Resources

| URI | Description |
|-----|-------------|
| `d7460n://rules/architecture` | Core architecture philosophy and constraints |
| `d7460n://rules/html` | HTML element and attribute constraints |
| `d7460n://rules/css` | CSS architecture rules |
| `d7460n://rules/javascript` | JavaScript restrictions |
| `d7460n://rules/project-structure` | Canonical project file layout |

## Tools

| Tool | Description |
|------|-------------|
| `get_d7460n_rules` | Return full architecture rules |
| `get_html_rules` | Return HTML restrictions |
| `get_css_rules` | Return CSS architecture rules |
| `get_js_rules` | Return JavaScript restrictions |
| `get_project_structure` | Return canonical project layout |
| `validate_html` | Validate HTML source compliance |
| `validate_css` | Validate CSS architecture compliance |
| `validate_js` | Validate JS CRUD-only compliance |
| `validate_project` | Validate repository file structure |
| `validate_workspace` | Validate multiple repositories |
| `explain_d7460n_rule` | Explain a specific rule |
| `get_mdn_reference` | Get MDN/W3C reference for a topic |
| `ping` | Health check |

## Prompts

| Prompt | Description |
|--------|-------------|
| `d7460n.validate_architecture` | Analyze repository for violations |
| `d7460n.fix_architecture` | Suggest compliant fixes |

## Rules

Rule definitions are in `rules/` as JSON files. The server watches this
directory and hot-reloads on changes, notifying connected clients via
`notifications/tools/list_changed`.

## Architecture

The D7460N MCP Server is a standalone development tool only. It is a separate
entity from the D7460N Architecture. It is never used for bootstrapping, never
used as a dependency, and never required by any D7460N project.
