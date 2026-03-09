#!/usr/bin/env node

// D7460N MCP Server — single-file Model Context Protocol server
// Implements JSON-RPC 2.0 over stdio transport
// Run: server.ts

import { readFileSync, readdirSync, watch } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const RULES_DIR = join(__dirname, "rules");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: number | string | null;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: number | string | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

interface ValidationViolation {
  rule: string;
  message: string;
  location?: string;
  severity: "error" | "warning";
}

interface ValidationResult {
  compliant: boolean;
  violations: ValidationViolation[];
}

interface FileEntry {
  path: string;
  type: "file" | "directory";
}

interface ToolLog {
  tool: string;
  arguments: unknown;
  result_summary: string;
  execution_ms: number;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Rule Engine
// ---------------------------------------------------------------------------

const ruleCache = new Map<string, Record<string, unknown>>();

function loadAllRules(): void {
  ruleCache.clear();
  try {
    for (const file of readdirSync(RULES_DIR).filter(f => f.endsWith(".json"))) {
      const name = file.replace(/\.json$/, "");
      ruleCache.set(name, JSON.parse(readFileSync(join(RULES_DIR, file), "utf-8")));
    }
  } catch (err) {
    process.stderr.write(`Rules directory not found or not accessible: ${RULES_DIR}\n`);
  }
}

function getRule(name: string): Record<string, unknown> | undefined {
  return ruleCache.get(name);
}

function getAllRules(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of ruleCache) out[k] = v;
  return out;
}

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

function validateHtml(source: string): ValidationResult {
  const violations: ValidationViolation[] = [];
  const rules = getRule("html");
  if (!rules) return { compliant: false, violations: [{ rule: "rules-loaded", message: "HTML rules not loaded", severity: "error" }] };

  const forbidden = (rules.forbidden_elements as string[]) || [];
  const forbiddenAttrs = (rules.forbidden_attributes as string[]) || [];
  const lines = source.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const num = i + 1;
    for (const el of forbidden) {
      if (new RegExp(`<${el}[\\s>/]`, "gi").test(line)) {
        violations.push({ rule: "forbidden-element", message: `Forbidden element <${el}> detected`, location: `line ${num}`, severity: "error" });
      }
    }
    for (const attr of forbiddenAttrs) {
      if (attr === "data-*") {
        if (/\bdata-[\w-]+\s*=/gi.test(line)) {
          violations.push({ rule: "forbidden-attribute", message: "Forbidden data-* attribute detected", location: `line ${num}`, severity: "error" });
        }
      } else {
        if (new RegExp(`\\b${attr}\\s*=`, "gi").test(line)) {
          violations.push({ rule: "forbidden-attribute", message: `Forbidden attribute '${attr}' detected`, location: `line ${num}`, severity: "error" });
        }
      }
    }
  }
  return { compliant: violations.length === 0, violations };
}

function validateCss(source: string): ValidationResult {
  const violations: ValidationViolation[] = [];
  const rules = getRule("css");
  if (!rules) return { compliant: false, violations: [{ rule: "rules-loaded", message: "CSS rules not loaded", severity: "error" }] };

  const forbiddenPatterns = (rules.forbidden_patterns as string[]) || [];
  const lines = source.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const num = i + 1;
    const trimmed = line.trim();
    if (trimmed.startsWith("/*") || trimmed.startsWith("*") || trimmed.startsWith("//")) continue;
    for (const pattern of forbiddenPatterns) {
      const regex = new RegExp(pattern, "i");
      if (regex.test(line)) {
        violations.push({ rule: "forbidden-css-pattern", message: `Forbidden CSS pattern detected: ${pattern}`, location: `line ${num}`, severity: "error" });
      }
    }
  }
  return { compliant: violations.length === 0, violations };
}

function validateJs(source: string): ValidationResult {
  const violations: ValidationViolation[] = [];
  const rules = getRule("javascript");
  if (!rules) return { compliant: false, violations: [{ rule: "rules-loaded", message: "JS rules not loaded", severity: "error" }] };

  const eventHandling = rules.event_handling as Record<string, unknown> | undefined;
  const domAccess = rules.dom_access as Record<string, unknown> | undefined;
  const forbiddenEvents = (eventHandling?.forbidden as string[]) || [];
  const forbiddenDom = (domAccess?.forbidden_methods as string[]) || [];

  const lines = source.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const num = i + 1;
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) continue;
    for (const ev of forbiddenEvents) {
      const regex = new RegExp(ev, "i");
      if (regex.test(line)) {
        violations.push({ rule: "forbidden-event", message: `Forbidden event handler detected: ${ev}`, location: `line ${num}`, severity: "error" });
      }
    }
    for (const method of forbiddenDom) {
      const base = method.replace(/\(\)$/, "");
      const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped + "\\s*\\(", "i");
      if (regex.test(line)) {
        violations.push({ rule: "forbidden-dom-method", message: `Forbidden DOM method detected: ${method}`, location: `line ${num}`, severity: "error" });
      }
    }
  }
  return { compliant: violations.length === 0, violations };
}

function validateProject(files: FileEntry[]): ValidationResult {
  const violations: ValidationViolation[] = [];
  const rules = getRule("project-structure");
  if (!rules) return { compliant: false, violations: [{ rule: "rules-loaded", message: "Project-structure rules not loaded", severity: "error" }] };

  const filePaths = new Set(files.filter(f => f.type === "file").map(f => f.path));
  const dirPaths = new Set(files.filter(f => f.type === "directory").map(f => f.path));
  for (const fp of filePaths) {
    const parts = fp.split("/");
    for (let j = 1; j < parts.length; j++) dirPaths.add(parts.slice(0, j).join("/"));
  }

  for (const req of (rules.required_files as string[]) || []) {
    if (!filePaths.has(req)) violations.push({ rule: "required-file", message: `Required file '${req}' is missing`, severity: "error" });
  }
  for (const req of (rules.required_directories as string[]) || []) {
    if (!dirPaths.has(req)) violations.push({ rule: "required-directory", message: `Required directory '${req}' is missing`, severity: "error" });
  }
  return { compliant: violations.length === 0, violations };
}

function validateWorkspace(projects: { name: string; files: FileEntry[] }[]): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};
  for (const p of projects) results[p.name] = validateProject(p.files);
  return results;
}

// ---------------------------------------------------------------------------
// MDN Gateway
// ---------------------------------------------------------------------------

interface MdnReference {
  topic: string;
  summary: string;
  spec_link: string;
  mdn_link: string;
  example?: string;
}

const MDN_REFS: Record<string, MdnReference> = {
  "css-grid": {
    topic: "CSS Grid Layout",
    summary: "Two-dimensional layout system for the web. Lay content out in rows and columns.",
    spec_link: "https://www.w3.org/TR/css-grid-2/",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout",
    example: "display: grid; grid-template-columns: auto 1fr auto; grid-template-rows: auto 1fr auto;"
  },
  "has-selector": {
    topic: "CSS :has() pseudo-class",
    summary: "Represents an element if any of the relative selectors match when anchored against it.",
    spec_link: "https://www.w3.org/TR/selectors-4/#relational",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Web/CSS/:has",
    example: "label:has(input:checked) { background: var(--active-color); }"
  },
  "empty-selector": {
    topic: "CSS :empty pseudo-class",
    summary: "Represents any element that has no children, including text nodes.",
    spec_link: "https://www.w3.org/TR/selectors-4/#the-empty-pseudo",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Web/CSS/:empty",
    example: "section:empty { display: none; }"
  },
  "custom-elements": {
    topic: "Custom Elements",
    summary: "Define new types of HTML elements with custom tag names (must contain a hyphen).",
    spec_link: "https://html.spec.whatwg.org/multipage/custom-elements.html",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements",
    example: "<app-container>, <app-logo>, <app-user>"
  },
  "semantic-html": {
    topic: "Semantic HTML",
    summary: "Using HTML elements according to their intended purpose for accessibility, SEO, and maintainability.",
    spec_link: "https://html.spec.whatwg.org/multipage/",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html",
    example: "<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>"
  },
  "color-scheme": {
    topic: "CSS color-scheme",
    summary: "Indicates which color schemes an element can be rendered in.",
    spec_link: "https://www.w3.org/TR/css-color-adjust-1/#color-scheme-prop",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme",
    example: ":root { color-scheme: light dark; }"
  },
  "label-element": {
    topic: "HTML label element",
    summary: "Represents a caption for an item in a user interface, associating interactive controls with their labels.",
    spec_link: "https://html.spec.whatwg.org/multipage/forms.html#the-label-element",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label",
    example: "<label role=\"button\">Save<input type=\"checkbox\" aria-hidden=\"true\"></label>"
  },
  "progressive-web-app": {
    topic: "Progressive Web Apps",
    summary: "Web applications using emerging APIs to deliver native-like user experience.",
    spec_link: "https://www.w3.org/TR/appmanifest/",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps",
    example: "<link rel=\"manifest\" href=\"manifest.webmanifest\">"
  },
  "container-queries": {
    topic: "CSS Container Queries",
    summary: "Apply styles based on the size of an element's container rather than the viewport.",
    spec_link: "https://www.w3.org/TR/css-contain-3/",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
    example: "@container (min-width: 700px) { article { grid-template-columns: 2fr 1fr; } }"
  },
  "style-queries": {
    topic: "CSS Style Queries",
    summary: "Test computed values of custom properties of a container element via @container.",
    spec_link: "https://www.w3.org/TR/css-contain-3/#style-container",
    mdn_link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_style_queries",
    example: "@container style(--theme: dark) { body { background: #000; } }"
  }
};

function getMdnReference(topic: string): MdnReference | undefined {
  if (MDN_REFS[topic]) return MDN_REFS[topic];
  const lower = topic.toLowerCase();
  for (const [key, ref] of Object.entries(MDN_REFS)) {
    if (key.toLowerCase() === lower || ref.topic.toLowerCase().includes(lower)) return ref;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Starter Generator
// ---------------------------------------------------------------------------

interface GeneratedFile { path: string; content: string }

function generateStarter(): GeneratedFile[] {
  return [
    {
      path: "index.html",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>D7460N</title>
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="manifest" href="manifest.webmanifest">
</head>
<body>
  <app-container>
    <header>
      <app-logo></app-logo>
      <app-user></app-user>
    </header>
    <nav>
      <label role="button">
        Home
        <input type="radio" name="nav" aria-hidden="true" checked>
      </label>
      <label role="button">
        About
        <input type="radio" name="nav" aria-hidden="true">
      </label>
      <label role="button">
        Contact
        <input type="radio" name="nav" aria-hidden="true">
      </label>
    </nav>
    <main>
      <article>
        <h1></h1>
        <section></section>
      </article>
    </main>
    <aside></aside>
    <footer>
      <app-legal></app-legal>
      <app-version></app-version>
    </footer>
  </app-container>
  <script type="module" src="assets/js/app.js"><\/script>
</body>
</html>`
    },
    {
      path: "assets/css/layout.css",
      content: `:root {
  color-scheme: light dark;
}

app-container {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr auto;
  min-block-size: 100dvh;
}

header  { grid-area: header; }
nav     { grid-area: nav; }
main    { grid-area: main; }
aside   { grid-area: aside; }
footer  { grid-area: footer; }

nav label { cursor: pointer; }
nav label:has(input:checked) { font-weight: bold; }

nav input[type="radio"],
label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

h1:empty, section:empty, aside:empty { display: none; }`
    },
    {
      path: "assets/js/api.js",
      content: `const BASE_URL = "";
function endpoint(suffix) { return BASE_URL ? \`\${BASE_URL}/\${suffix}\` : suffix; }
async function fetchData(suffix) {
  const url = endpoint(suffix);
  const now = new Date().toISOString();
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    const data = await response.json();
    console.log(\`[\${now}] ✓ \${suffix}\`);
    return data;
  } catch (err) {
    console.error(\`[\${now}] ✗ \${suffix}\`, err);
    return null;
  }
}
export { endpoint, fetchData };`
    },
    {
      path: "manifest.webmanifest",
      content: `{
  "name": "D7460N",
  "short_name": "D7460N",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}`
    },
    {
      path: "assets/images/.gitkeep",
      content: ""
    }
  ];
}

// ---------------------------------------------------------------------------
// Rule Explanation
// ---------------------------------------------------------------------------

const RULE_EXPLANATIONS: Record<string, string> = {
  "no-div": "The <div> element is forbidden. D7460N requires semantic HTML elements that convey meaning (header, nav, main, section, article, aside, footer, etc.).",
  "no-span": "The <span> element is forbidden. Use semantic inline elements such as <strong>, <em>, <time>, <mark>, <code>, etc.",
  "no-class": "The 'class' attribute is forbidden. D7460N uses semantic elements, custom elements, and CSS pseudo-selectors (:has, :empty, :checked) instead of class-based styling.",
  "no-id": "The 'id' attribute is forbidden. Use document.querySelector() with semantic selectors instead.",
  "no-data-attributes": "data-* attributes are forbidden. State is managed via CSS state machines using hidden checkbox/radio inputs.",
  "no-flexbox": "Flexbox is forbidden. D7460N uses CSS Grid exclusively for all layout.",
  "no-event-listeners": "addEventListener is forbidden. All CRUD operations flow through the shared oninput lifecycle.",
  "css-state-machines": "UI state is controlled via hidden checkbox/radio inputs inside <label> elements, detected by CSS :has() pseudo-selector.",
  "nav-radio-pattern": "Navigation uses radio inputs inside <label role='button'> elements within <nav>. CSS :has(input:checked) handles active state.",
  "crud-only-js": "JavaScript is restricted to CRUD data transport only. No UI logic, no DOM visibility, no event handlers.",
  "single-index-html": "The project uses a single index.html at the root. SPA architecture with no routing framework.",
  "holy-grail-layout": "The layout uses CSS Grid Holy Grail pattern via <app-container> with header, nav, main, aside, footer regions.",
  "querySelector-only": "DOM access must use document.querySelector() exclusively. getElementById, getElementsByClassName, etc. are forbidden.",
  "oninput-lifecycle": "All API CRUD operations are triggered via oninput through a shared lifecycle utility, not via user-initiated event handlers.",
  "separation-of-concerns": "HTML = structure, CSS = all UI behavior/state/layout, JS = CRUD data transport only. These boundaries are strict."
};

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

const toolLogs: ToolLog[] = [];

function logToolCall(tool: string, args: unknown, result: string, ms: number): void {
  toolLogs.push({ tool, arguments: args, result_summary: result, execution_ms: ms, timestamp: new Date().toISOString() });
}

// ---------------------------------------------------------------------------
// MCP Resources
// ---------------------------------------------------------------------------

const RESOURCES = [
  { uri: "d7460n://rules/architecture", name: "D7460N Architecture Rules", description: "Core architecture philosophy and constraints", mime_type: "application/json" },
  { uri: "d7460n://rules/html", name: "D7460N HTML Rules", description: "HTML element and attribute constraints", mime_type: "application/json" },
  { uri: "d7460n://rules/css", name: "D7460N CSS Rules", description: "CSS architecture rules — Grid only, state machines", mime_type: "application/json" },
  { uri: "d7460n://rules/javascript", name: "D7460N JavaScript Rules", description: "JavaScript restrictions — CRUD transport only", mime_type: "application/json" },
  { uri: "d7460n://rules/project-structure", name: "D7460N Project Structure", description: "Canonical project file layout", mime_type: "application/json" }
];

function readResource(uri: string): { contents: Array<{ uri: string; mime_type: string; text: string }> } | undefined {
  const map: Record<string, string> = {
    "d7460n://rules/architecture": "architecture",
    "d7460n://rules/html": "html",
    "d7460n://rules/css": "css",
    "d7460n://rules/javascript": "javascript",
    "d7460n://rules/project-structure": "project-structure"
  };
  const ruleName = map[uri];
  if (!ruleName) return undefined;
  const data = getRule(ruleName);
  if (!data) return undefined;
  return { contents: [{ uri, mime_type: "application/json", text: JSON.stringify(data, null, 2) }] };
}

// ---------------------------------------------------------------------------
// MCP Tools
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "get_d7460n_rules",
    description: "Return full D7460N architecture rules",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] }
  },
  {
    name: "get_html_rules",
    description: "Return HTML restrictions for D7460N architecture",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] }
  },
  {
    name: "get_css_rules",
    description: "Return CSS architecture rules for D7460N",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] }
  },
  {
    name: "get_js_rules",
    description: "Return JavaScript restrictions for D7460N architecture",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] }
  },
  {
    name: "get_project_structure",
    description: "Return canonical D7460N project layout",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] }
  },
  {
    name: "validate_html",
    description: "Validate HTML source for D7460N architecture compliance",
    inputSchema: { type: "object" as const, properties: { source: { type: "string", description: "HTML source code to validate" } }, required: ["source"] }
  },
  {
    name: "validate_css",
    description: "Validate CSS source for D7460N architecture compliance",
    inputSchema: { type: "object" as const, properties: { source: { type: "string", description: "CSS source code to validate" } }, required: ["source"] }
  },
  {
    name: "validate_js",
    description: "Validate JavaScript source for D7460N CRUD-only compliance",
    inputSchema: { type: "object" as const, properties: { source: { type: "string", description: "JavaScript source code to validate" } }, required: ["source"] }
  },
  {
    name: "validate_project",
    description: "Validate a repository file structure against D7460N project layout",
    inputSchema: { type: "object" as const, properties: { files: { type: "array", items: { type: "object", properties: { path: { type: "string" }, type: { type: "string", enum: ["file", "directory"] } }, required: ["path", "type"] }, description: "Array of {path, type} entries" } }, required: ["files"] }
  },
  {
    name: "validate_workspace",
    description: "Validate multiple repositories within a workspace",
    inputSchema: { type: "object" as const, properties: { projects: { type: "array", items: { type: "object", properties: { name: { type: "string" }, files: { type: "array", items: { type: "object", properties: { path: { type: "string" }, type: { type: "string", enum: ["file", "directory"] } }, required: ["path", "type"] } } }, required: ["name", "files"] }, description: "Array of {name, files} project entries" } }, required: ["projects"] }
  },
  {
    name: "generate_d7460n_starter",
    description: "Generate a complete D7460N starter project",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] }
  },
  {
    name: "explain_d7460n_rule",
    description: "Return a human-readable explanation of a D7460N architecture rule",
    inputSchema: { type: "object" as const, properties: { rule_name: { type: "string", description: "Rule name to explain" } }, required: ["rule_name"] }
  },
  {
    name: "get_mdn_reference",
    description: "Return MDN/W3C reference for a web platform topic",
    inputSchema: { type: "object" as const, properties: { topic: { type: "string", description: "Web platform topic (e.g. css-grid, has-selector, semantic-html)" } }, required: ["topic"] }
  },
  {
    name: "ping",
    description: "Health check — returns server status",
    inputSchema: { type: "object" as const, properties: {}, required: [] as string[] }
  }
];

function callTool(name: string, args: Record<string, unknown>): { content: Array<{ type: string; text: string }>; isError?: boolean } {
  const start = Date.now();
  let result: unknown;
  let summary: string;

  try {
    switch (name) {
      case "get_d7460n_rules":
        result = getAllRules();
        summary = "Returned all rules";
        break;
      case "get_html_rules":
        result = getRule("html");
        summary = "Returned HTML rules";
        break;
      case "get_css_rules":
        result = getRule("css");
        summary = "Returned CSS rules";
        break;
      case "get_js_rules":
        result = getRule("javascript");
        summary = "Returned JS rules";
        break;
      case "get_project_structure":
        result = getRule("project-structure");
        summary = "Returned project structure";
        break;
      case "validate_html":
        result = validateHtml(args.source as string);
        summary = (result as ValidationResult).compliant ? "Compliant" : `${(result as ValidationResult).violations.length} violation(s)`;
        break;
      case "validate_css":
        result = validateCss(args.source as string);
        summary = (result as ValidationResult).compliant ? "Compliant" : `${(result as ValidationResult).violations.length} violation(s)`;
        break;
      case "validate_js":
        result = validateJs(args.source as string);
        summary = (result as ValidationResult).compliant ? "Compliant" : `${(result as ValidationResult).violations.length} violation(s)`;
        break;
      case "validate_project":
        result = validateProject(args.files as FileEntry[]);
        summary = (result as ValidationResult).compliant ? "Compliant" : `${(result as ValidationResult).violations.length} violation(s)`;
        break;
      case "validate_workspace":
        result = validateWorkspace(args.projects as { name: string; files: FileEntry[] }[]);
        summary = "Workspace validated";
        break;
      case "generate_d7460n_starter":
        result = generateStarter();
        summary = `Generated ${(result as GeneratedFile[]).length} files`;
        break;
      case "explain_d7460n_rule": {
        const ruleName = args.rule_name as string;
        const explanation = RULE_EXPLANATIONS[ruleName];
        result = explanation ? { rule_name: ruleName, explanation } : { error: { code: "UNKNOWN_RULE", message: `Unknown rule: '${ruleName}'. Available: ${Object.keys(RULE_EXPLANATIONS).join(", ")}` } };
        summary = explanation ? "Explained" : "Unknown rule";
        break;
      }
      case "get_mdn_reference": {
        const ref = getMdnReference(args.topic as string);
        result = ref || { error: { code: "TOPIC_NOT_FOUND", message: `No reference for '${args.topic}'. Available: ${Object.keys(MDN_REFS).join(", ")}` } };
        summary = ref ? "Found" : "Not found";
        break;
      }
      case "ping":
        result = { status: "ok", server: "D7460N MCP Server", version: "1.0.0", uptime_ms: Date.now() - serverStartTime, rules_loaded: ruleCache.size };
        summary = "ok";
        break;
      default:
        logToolCall(name, args, "Unknown tool", Date.now() - start);
        return { content: [{ type: "text", text: JSON.stringify({ error: { code: "UNKNOWN_TOOL", message: `Unknown tool: ${name}` } }) }], isError: true };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logToolCall(name, args, `Error: ${msg}`, Date.now() - start);
    return { content: [{ type: "text", text: JSON.stringify({ error: { code: "EXECUTION_ERROR", message: msg } }) }], isError: true };
  }

  logToolCall(name, args, summary, Date.now() - start);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
}

// ---------------------------------------------------------------------------
// MCP Prompts
// ---------------------------------------------------------------------------

const PROMPTS = [
  {
    name: "d7460n.generate_starter",
    description: "Generate a new D7460N project following all architecture rules",
    arguments: []
  },
  {
    name: "d7460n.validate_architecture",
    description: "Analyze a repository for D7460N architecture rule violations",
    arguments: [
      { name: "repository_path", description: "Path to the repository to validate", required: true }
    ]
  },
  {
    name: "d7460n.fix_architecture",
    description: "Suggest compliant fixes for D7460N architecture violations",
    arguments: [
      { name: "repository_path", description: "Path to the repository to fix", required: true }
    ]
  }
];

function getPrompt(name: string, args: Record<string, string>): { messages: Array<{ role: string; content: { type: string; text: string } }> } | undefined {
  switch (name) {
    case "d7460n.generate_starter":
      return {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: "Generate a new D7460N Architecture starter project. Follow all D7460N rules:\n- HTML: semantic elements only, no div/span, no class/id/data-* attributes\n- CSS: Grid only (no Flexbox), state machines via :has()/:empty on hidden inputs\n- JS: CRUD transport only in assets/js/api.js, no event listeners\n- Layout: Holy Grail via <app-container>\n- Navigation: radio inputs inside <label role=\"button\"> in <nav>\n- Single index.html at root with assets/css/layout.css, assets/js/api.js, assets/images/"
          }
        }]
      };
    case "d7460n.validate_architecture":
      return {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `Analyze the repository at '${args.repository_path || "."}' for D7460N architecture violations. Check:\n1. HTML: no div/span, no class/id/data-*, semantic elements only\n2. CSS: no Flexbox, Grid only, state machines via hidden inputs\n3. JS: no addEventListener, no onclick, querySelector only, CRUD only\n4. Structure: index.html at root, assets/css/layout.css, assets/js/api.js, assets/images/\nReport all violations with file locations.`
          }
        }]
      };
    case "d7460n.fix_architecture":
      return {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `Analyze the repository at '${args.repository_path || "."}' for D7460N architecture violations and suggest compliant fixes:\n- Replace <div>/<span> with semantic HTML equivalents\n- Replace class/id selectors with semantic/a11y CSS selectors\n- Replace Flexbox with CSS Grid\n- Replace addEventListener/onclick with oninput lifecycle\n- Replace getElementById with querySelector\nProvide specific code changes for each violation.`
          }
        }]
      };
    default:
      return undefined;
  }
}

// ---------------------------------------------------------------------------
// JSON-RPC Transport (stdio)
// ---------------------------------------------------------------------------

const serverStartTime = Date.now();

function send(msg: JsonRpcResponse | { jsonrpc: "2.0"; method: string; params?: unknown }): void {
  const json = JSON.stringify(msg);
  process.stdout.write(json + "\n");
}

function handleRequest(req: JsonRpcRequest): void {
  const id = req.id ?? null;

  // Notifications (no id) — no response needed
  if (id == null) {
    if (req.method === "notifications/initialized") {
      return;
    }
    return;
  }

  switch (req.method) {
    case "initialize":
      send({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: { listChanged: true },
            resources: { listChanged: true },
            prompts: { listChanged: true }
          },
          serverInfo: {
            name: "D7460N MCP Server",
            version: "1.0.0"
          }
        }
      });
      break;

    case "ping":
      send({ jsonrpc: "2.0", id, result: {} });
      break;

    case "tools/list":
      send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
      break;

    case "tools/call": {
      const params = req.params || {};
      const toolName = params.name as string;
      const toolArgs = (params.arguments || {}) as Record<string, unknown>;
      const toolResult = callTool(toolName, toolArgs);
      send({ jsonrpc: "2.0", id, result: toolResult });
      break;
    }

    case "resources/list":
      send({ jsonrpc: "2.0", id, result: { resources: RESOURCES } });
      break;

    case "resources/read": {
      const uri = (req.params || {}).uri as string;
      const resource = readResource(uri);
      if (resource) {
        send({ jsonrpc: "2.0", id, result: resource });
      } else {
        send({ jsonrpc: "2.0", id, error: { code: -32602, message: `Unknown resource: ${uri}` } });
      }
      break;
    }

    case "prompts/list":
      send({ jsonrpc: "2.0", id, result: { prompts: PROMPTS } });
      break;

    case "prompts/get": {
      const params = req.params || {};
      const promptName = params.name as string;
      const promptArgs = (params.arguments || {}) as Record<string, string>;
      const prompt = getPrompt(promptName, promptArgs);
      if (prompt) {
        send({ jsonrpc: "2.0", id, result: prompt });
      } else {
        send({ jsonrpc: "2.0", id, error: { code: -32602, message: `Unknown prompt: ${promptName}` } });
      }
      break;
    }

    default:
      send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${req.method}` } });
  }
}

// ---------------------------------------------------------------------------
// Rule Hot Reload
// ---------------------------------------------------------------------------

function watchRules(): void {
  try {
    watch(RULES_DIR, () => {
      try {
        loadAllRules();
        send({
          jsonrpc: "2.0",
          method: "notifications/tools/list_changed",
          params: undefined
        });
      } catch {
        // Ignore errors (e.g., invalid JSON during save)
      }
    });
  } catch {
    // rules directory may not be watchable in all environments
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

loadAllRules();
watchRules();

const rl = createInterface({ input: process.stdin, terminal: false });

rl.on("line", (line: string) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const req = JSON.parse(trimmed) as JsonRpcRequest;
    handleRequest(req);
  } catch {
    send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
  }
});

process.stderr.write("D7460N MCP Server v1.0.0 started\n");
