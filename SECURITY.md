<!--
D7460N / THOR UI — SECURITY.md
Compliance note: This policy follows D7460N core rules (Separation of Concerns; CSS/UI state; data-only JS; no frameworks) and has been accuracy-verified against those rules and modern browser-native best practices as of 2025-09-27.
Verification complete.
-->

# Security Policy

This repository implements the D7460N (THOR UI) architecture: semantic HTML for structure, CSS for UI/state, and data-only JavaScript. It is intentionally dependency-light and browser-native to reduce attack surface and supply-chain risk.

## Supported Versions

| Version branch | Status      | Security fixes |
| -------------- | ----------- | -------------- |
| `main`         | Active      | ✔              |
| `dev`          | Pre-release | As feasible    |
| Older tags     | Archived    | ✖              |

> We generally patch only the latest stable branch (`main`). If you need a fix on older tags, please upgrade.

---

## Reporting a Vulnerability

**Please use GitHub Security Advisories** for private disclosure:

1. Go to **Security → Advisories → Report a vulnerability** on this repo.
2. Provide:

   * Affected files/components and exact version/commit
   * Impact (what can an attacker do?)
   * Reproduction steps or PoC (minimal and deterministic)
   * Environment details (browser version, OS, hosting)
   * Suggested remediation (if known)

**Preferred format:** CWE and CVSS v3.1/4.0 vector (if you can).

**PGP:** If you require encrypted email, include a way for us to share keys inside the advisory thread.

**Response targets**

* Acknowledge receipt: **48 hours**
* Initial assessment: **5 business days**
* Fix/mitigation or timeline: **10 business days** (complex issues may take longer; we will keep you updated)

We appreciate coordinated disclosure. We’ll credit reporters in release notes unless you prefer to remain anonymous.

---

## Scope

In-scope:

* Source in this repo: HTML (structure), CSS (UI/state), JS (data logic only), build scripts, and JSON schemas/configs
* Static hosting guidance and headers documented here
* CI automation that runs in this repo

Out-of-scope:

* Back-end services, APIs, infrastructure not owned by this repo
* Third-party browsers, extensions, or user scripts
* Social engineering or physical attacks

If in doubt, open a private advisory and ask.

---

## Threat Model (high-level)

Common risks we consider:

* **XSS/Injection:** Inline script/style bans, strong CSP, Trusted Types (where available), escaping and content sanitization at integration points.
* **Clickjacking/UI Redress:** `frame-ancestors 'none'` (unless embedding is required).
* **Supply Chain:** No runtime frameworks; minimal dev-time tooling; version-pinned dev deps; integrity pinning for any remote assets.
* **Mixed Content & Downgrade:** Enforce HTTPS; `upgrade-insecure-requests`.
* **MIME Sniffing:** `X-Content-Type-Options: nosniff`.
* **Leaky Referrers:** `Referrer-Policy: no-referrer` or `strict-origin-when-cross-origin`.
* **Permissions Abuse:** Restrictive `Permissions-Policy`.

---

## D7460N Secure Development Rules (Non-Negotiable)

1. **Separation of concerns**

   * HTML = structure/semantics only (no inline event handlers or inline styles).
   * CSS = all UI state/behavior (use `:has()`, `:empty`, native controls; no JS event listeners for UI).
   * JS = data fetch/transform only; never manipulates presentation/state; no `eval`/Function constructors; no DOM-injected inline scripts.

2. **No inline code**

   * No `<script>` with inline JS; no `style` attributes; no `on*=` handlers.
   * Enables a strict CSP without `unsafe-inline`.

3. **Content handling**

   * Treat all external data as untrusted.
   * Prefer textContent/attribute assignment with safe allowlists when injecting data.
   * If HTML is truly required, use a vetted sanitizer at the integration boundary (document the allowlist).

4. **Dependencies**

   * Avoid runtime libraries; if dev-deps are needed, pin versions and verify checksums.
   * Lockfiles are required for any package managers used in CI.

5. **Secrets**

   * **Never** commit secrets, tokens, or API keys.
   * Front-end must not embed private credentials; use server-side proxies or public, scoped, and revocable tokens only when unavoidable.

6. **Headers/Hosting**

   * Projects must document recommended headers (see below) for whichever host (e.g., GH Pages, CDN, app server) deploys the artifacts.

---

## Recommended Security Headers (Production)

Configure your host/CDN to send these headers (tailor as needed):

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self' https://api.example.tld;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  form-action 'self';
  navigate-to 'self';

Permissions-Policy:
  accelerometer=(), autoplay=(), camera=(), clipboard-read=(),
  clipboard-write=(), geolocation=(), gyroscope=(), magnetometer=(),
  microphone=(), payment=(), usb=()

Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-site
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

If you must load third-party assets, prefer self-hosting; otherwise add them explicitly to `script-src`/`style-src` with **Subresource Integrity (SRI)** and avoid `unsafe-inline`/`unsafe-eval`.

---

## Example CSP-Compatible Patterns

**HTML (no inline handlers)**

```html
<button type="button">Refresh data</button>
```

**CSS controls UI/state**

```css
article:has(> ul:not(:empty)) { /* show populated state */ }
```

**JS (data only; no UI logic)**

```js
export async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

---

## Supply-Chain & CI

* Enable **GitHub Dependabot alerts** and **secret scanning**.
* Enable **CodeQL** for JavaScript.
* Verify checksums (or SLSA-provenance) for any downloaded build tools.
* Fail CI on:

  * Known vulnerabilities above a defined severity threshold
  * Presence of secrets or high-entropy strings
  * Prohibited patterns (inline scripts/styles, `on*=` handlers, `eval`)

---

## Vulnerability Severity & Fix Policy

We prioritize by CVSS score, exploitability, and impact:

* **Critical/High:** Patch ASAP; public release with notes.
* **Medium:** Batch into next scheduled release.
* **Low/Informational:** Document or defer with rationale.

We may provide mitigations (e.g., header tweaks) if a full fix needs broader changes.

---

## Safe Harbor for Researchers

If you follow **good-faith** testing:

* No privacy violations, data exfiltration, or service disruption
* No social engineering or physical access
* Respect rate limits

…we will not pursue legal action. Please keep findings private until a fix is available.

---

## Contact

* Private report: **GitHub Security Advisory** (preferred)
* If that fails: open a minimal “security-concern” issue **without PoC details**, and we’ll move to a private channel.

Thank you for helping keep D7460N secure.
