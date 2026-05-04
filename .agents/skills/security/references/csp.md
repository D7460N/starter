# Content Security Policy

The strict CSP this architecture supports without `unsafe-*` exceptions, and the rationale per directive.

## The full CSP

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
```

## Directive-by-directive

### `default-src 'self'`
Default fallback for any directive not explicitly set. Restricts loading of any resource type to the same origin.

### `script-src 'self'`
Scripts may only load from the same origin. No `unsafe-inline` (no inline `<script>` blocks, no `on*=` attributes). No `unsafe-eval` (no `eval()`, no `Function` constructor). The architecture's HTML and JavaScript skills already enforce these prohibitions, so this CSP is achievable with no exceptions.

### `style-src 'self'`
Styles may only load from the same origin. No `unsafe-inline` (no `<style>` tags, no `style=` attributes). The architecture's HTML and CSS skills already enforce these prohibitions.

### `img-src 'self' data:`
Images load from the same origin. `data:` is permitted for inline data URIs (small icons embedded in CSS as `background-image: url(data:...)`). If the project uses no data URIs, drop the `data:` token.

### `font-src 'self'`
Fonts load from the same origin. If the project uses Google Fonts via `@import`, add the Google Fonts origins explicitly:

```
font-src 'self' https://fonts.gstatic.com;
style-src 'self' https://fonts.googleapis.com;
```

Self-hosting fonts is preferred — it avoids the third-party CSP exception and the cross-origin request.

### `connect-src 'self' https://api.example.tld`
`fetch()` and `XMLHttpRequest` may target the same origin and the explicitly-listed API origin. Replace `https://api.example.tld` with the actual API origin declared once in `api.js`.

### `object-src 'none'`
No `<object>`, `<embed>`, `<applet>`. Prevents legacy plugin-based attack vectors.

### `base-uri 'self'`
The `<base>` element may only set a base URI within the same origin. Prevents an attacker from using an injected `<base>` to redirect relative URLs.

### `frame-ancestors 'none'`
The page cannot be embedded in any `<iframe>`, `<frame>`, or `<embed>`. Prevents clickjacking. If the project must be embeddable in specific origins, replace `'none'` with the explicit list:

```
frame-ancestors https://parent.example.tld;
```

### `upgrade-insecure-requests`
Any `http://` URL in the page (in attributes, fetches, etc.) is automatically upgraded to `https://`. Combined with HSTS (in headers), this prevents accidental mixed-content.

### `form-action 'self'`
Form submissions target the same origin. Prevents an injected form from submitting credentials to an attacker-controlled endpoint.

## What this CSP does not include

- **No `unsafe-inline`** in `script-src` or `style-src` — the architecture has no inline scripts or styles.
- **No `unsafe-eval`** — the architecture does not use `eval` or `new Function`.
- **No nonce or hash directives** — the architecture has zero inline scripts or styles, so no nonce/hash is needed. (If a future deployment must include a single inline measurement script, prefer `'sha256-...'` hash over `'nonce-...'` because hashes do not require server-rendered HTML.)
- **No `data:` in `script-src`** — preserves protection against data-URI script injection.

## Reporting

For monitoring, add a reporting endpoint:

```
report-to csp-endpoint;
report-uri /csp-report;
```

with a corresponding `Reporting-Endpoints` header:

```
Reporting-Endpoints: csp-endpoint="https://example.tld/csp-report"
```

CSP reports identify policy violations in the field — an early warning for any drift from the architecture.

## Reference

- W3C CSP Level 3: https://www.w3.org/TR/CSP3/
- MDN CSP: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- MDN CSP `script-src`: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
- OWASP CSP cheat sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- CSP Evaluator: https://csp-evaluator.withgoogle.com/
