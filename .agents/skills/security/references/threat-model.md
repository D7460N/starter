# Threat Model

What the architecture defends against, how, and what residual risks remain.

## In scope

This is the threat model for a public-facing SPA / PWA built per the architecture. Backend security, server hardening, and infrastructure security are out of scope here — covered separately by the deployment environment.

## Threats and defenses

### XSS via inline script injection
**Threat:** Attacker injects `<script>` or `on*=` attributes via reflected/stored input.
**Defense:**
- HTML skill forbids `on*=` attributes and `<style>` tags.
- CSP `script-src 'self'` blocks all inline scripts.
- JavaScript skill uses `textContent` (not `innerHTML`) when injecting strings.
**Residual:** A future deviation from the HTML skill rules introduces inline handlers — caught by CSP violation reports if reporting is enabled.

### XSS via injected HTML
**Threat:** Attacker submits content containing markup; the application renders it as HTML.
**Defense:**
- JavaScript injection always uses `createElement` + `textContent` (text mode), not `innerHTML`.
- API responses are treated as untrusted text. Markup characters are rendered as text, not parsed.
**Residual:** A future requirement to render trusted HTML (e.g., a rich-text editor) needs explicit allowlist sanitization at the integration boundary. Documented as an exception with the allowed elements.

### CSS-based attacks
**Threat:** Attacker injects styles to exfiltrate data (`background: url(...)` with selectors that fire on the user's data) or to trick the user (clickjacking via positioned elements).
**Defense:**
- CSP `style-src 'self'` blocks inline styles.
- CSP `frame-ancestors 'none'` blocks clickjacking via embedding.
- HTML skill forbids `style=` attribute.
**Residual:** The architecture does not use a CSS-in-JS library, so this surface is small.

### CSRF (Cross-Site Request Forgery)
**Threat:** Attacker tricks the user's browser into making an authenticated request to the API.
**Defense:**
- Session cookies use `SameSite=Strict` or `SameSite=Lax`.
- Sensitive state-changing requests include a CSRF token (server-issued, in a non-cookie header).
- CSP `form-action 'self'` keeps form submissions on-origin.
**Residual:** An attacker on the same site (subdomain) under `SameSite=Lax` can still forge top-level GETs. Use `SameSite=Strict` for high-sensitivity actions.

### Clickjacking
**Threat:** Attacker frames the page inside a malicious site and overlays UI to trick the user.
**Defense:**
- CSP `frame-ancestors 'none'` blocks framing.
**Residual:** None, when frame-ancestors is enforced.

### Supply chain compromise
**Threat:** A third-party dependency is compromised and ships malicious code.
**Defense:**
- The architecture has zero third-party runtime dependencies.
- Build-time tools (linters, validators) are minimal and pinned.
- GitHub Dependabot alerts and CodeQL scan the few dev dependencies.
**Residual:** Build-tool compromise still possible. Mitigation: pinned versions, checksums, SLSA provenance where available.

### Mixed content
**Threat:** An `http://` resource on an HTTPS page is intercepted by an attacker.
**Defense:**
- CSP `upgrade-insecure-requests` rewrites `http://` to `https://` automatically.
- HSTS forces HTTPS at the browser level.
**Residual:** The first ever request to a new origin is unprotected by HSTS unless preloaded. Preload submission removes that gap.

### MIME sniffing
**Threat:** Browser interprets a non-script response as a script and executes it.
**Defense:**
- `X-Content-Type-Options: nosniff` disables sniffing.
**Residual:** None.

### Referrer leakage
**Threat:** Sensitive paths or query strings leak to third parties via the `Referer` header.
**Defense:**
- `Referrer-Policy: strict-origin-when-cross-origin` strips path/query for cross-origin.
**Residual:** Origin still leaks. For maximum privacy, use `same-origin` (sends `Referer` only on same-origin requests).

### Permissions abuse
**Threat:** A compromise tries to access camera, microphone, geolocation, etc., without user awareness.
**Defense:**
- `Permissions-Policy` denies all of these by default.
- Adding origins is opt-in per feature.
**Residual:** None when defaults are deny-all.

### Token theft (XSS exfiltration)
**Threat:** XSS reads tokens from `localStorage` and sends them to the attacker.
**Defense:**
- Sensitive tokens stored in `HttpOnly` cookies, not `localStorage`.
- The architecture's CSP heavily restricts XSS in the first place.
**Residual:** A successful XSS that bypasses CSP can still abuse the user's session (CSRF-style, with credentials sent automatically). The right defense layer is the cookie scope (`SameSite`) and short session lifetimes.

### Denial of service via large payloads
**Threat:** Attacker submits very large payloads that crash the client renderer.
**Defense:**
- Server-side rate limiting and payload size limits at the API layer.
- Pagination at the data layer.
**Residual:** Out of architecture scope — handled by deployment.

## What's not in this threat model

- Backend / server vulnerabilities
- Network-layer attacks (DDoS, BGP hijack)
- Physical access to user devices
- Phishing / social engineering
- Insider threats
- Cryptographic key management

These need their own threat model at the deployment layer.

## Reference

- OWASP ASVS (Application Security Verification Standard): https://owasp.org/www-project-application-security-verification-standard/
- OWASP Top Ten: https://owasp.org/www-project-top-ten/
- MITRE ATT&CK for Web: https://attack.mitre.org/
