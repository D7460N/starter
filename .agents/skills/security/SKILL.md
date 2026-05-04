---
name: security
description: Security rules for projects following the air-gapped, declarative-first architecture. Covers Content Security Policy, recommended security headers, and the architectural decisions that enable a strict CSP without unsafe-inline or unsafe-eval. Use when configuring deployment, reviewing CSP, or auditing for inline-script or inline-style violations.
license: MIT
metadata:
  version: "1.0.0"
---

# Security

The architecture's separation of concerns enables a strict Content Security Policy without any `unsafe-*` exceptions. This skill defines the headers, the CSP, and the architectural decisions that make them possible.

## Why the architecture is secure by construction

- **No inline JavaScript.** No `<script>` with inline JS. No `on*=` event-handler attributes. CSP can ban inline scripts entirely.
- **No inline CSS.** No `<style>` tags. No `style=` attributes. CSP can ban inline styles entirely.
- **No third-party runtime dependencies.** No CDN loads. CSP `script-src 'self'` and `style-src 'self'` cover everything.
- **No `eval`, no `Function` constructor, no dynamic code generation.** CSP can ban these via the absence of `unsafe-eval`.
- **No HTML injection.** JavaScript injects text content and creates elements via `createElement`, never via `innerHTML` with markup strings.

These come from the `html`, `css`, and `javascript` skills as positive whitelists. The security posture is a consequence, not a separate effort.

## Recommended security headers

These are the only headers required for a hardened deployment.

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

`connect-src` is the only directive that needs project-specific tuning — replace `https://api.example.tld` with the actual API origin declared once in `api.js`.

## CSP-compatible patterns

These patterns are what the architecture already produces. They are listed here as the verifiable signal that the code is secure-by-construction.

**HTML** — no inline event handlers, no `style` attribute:

```html
<label role="button" aria-label="Save">
  Save
  <input type="checkbox" aria-hidden="true" />
</label>
```

**CSS** — controls all UI state via selectors on data presence:

```css
article:has(> ul:not(:empty)) {
  /* show populated state */
}
```

**JavaScript** — fetches data, throws on error, no UI logic:

```javascript
export async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

## Threat model — what we defend against

| Threat | Defense |
|---|---|
| XSS via inline scripts | CSP `script-src 'self'`, no inline `<script>` blocks, no `on*=` attributes |
| XSS via injected HTML | JS uses `createElement` and `textContent`, never `innerHTML` with markup |
| Style injection | CSP `style-src 'self'`, no inline `<style>`, no `style=` attributes |
| Clickjacking | CSP `frame-ancestors 'none'` (unless intentionally embeddable) |
| Supply-chain compromise | No third-party runtime dependencies |
| Mixed content | `upgrade-insecure-requests`, HSTS |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Referrer leakage | `Referrer-Policy: strict-origin-when-cross-origin` |
| Unintended permissions | `Permissions-Policy` denies everything by default |

## Secrets

- Never commit secrets, tokens, API keys, or `.env` files.
- The front-end never embeds private credentials. Use server-side proxies. If a public token is unavoidable, it must be scoped and revocable.
- `.gitignore` already excludes `.env`.

## Content sanitization

External data is treated as untrusted. The architecture handles this by:

- Using `textContent` (not `innerHTML`) when injecting strings into the DOM
- Using `setAttribute` with a known allowlist when setting attributes from data
- Refusing to render any data field that contains markup characters in a way that would invoke parsing

If a use case genuinely requires rendering trusted HTML, that is documented as an exception with the allowlist of permitted elements at the integration boundary.

## Supply chain

- Enable GitHub Dependabot alerts.
- Enable secret scanning.
- Enable CodeQL for JavaScript.
- Verify checksums or SLSA provenance for any downloaded build tools.
- CI fails on:
  - Known vulnerabilities above defined severity threshold
  - Presence of secrets or high-entropy strings
  - Inline scripts, inline styles, or `on*=` handlers in HTML

## What security never does in this architecture

- Never relies on `unsafe-inline` to make things work
- Never relies on `unsafe-eval`
- Never adds CSP exceptions for third-party CDNs (no third-party assets are loaded)
- Never trusts data origin without sanitization at the integration boundary
- Never embeds secrets in front-end code

## References

- `references/csp.md` — full CSP with rationale per directive
- `references/headers.md` — every recommended header with explanation
- `references/threat-model.md` — full threat model, defenses, residual risks
- `references/sanitization.md` — text vs. HTML injection rules
- W3C CSP Level 3: https://www.w3.org/TR/CSP3/
- MDN CSP: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- OWASP Secure Headers: https://owasp.org/www-project-secure-headers/
