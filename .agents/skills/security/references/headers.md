# Security Headers

The recommended HTTP response headers, with rationale per header.

## The full header set

```
Content-Security-Policy: <see csp.md>
Permissions-Policy: accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-site
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Header-by-header

### `Content-Security-Policy`
Controls resource loading and script execution. Full rationale in `csp.md`.

### `Permissions-Policy`
Disables browser feature APIs (camera, microphone, geolocation, etc.) that the architecture does not use. The empty parentheses `()` mean "no origin allowed." Add origins (`(self)`) only when a feature is genuinely used.

The full directive list is long; the headers above cover the most-abused features. The full list is in the spec.

### `Referrer-Policy: strict-origin-when-cross-origin`
- Same-origin requests send the full URL as `Referer`.
- Cross-origin requests send only the origin (no path or query).
- HTTPS-to-HTTP cross-origin sends nothing.

This balance preserves analytics for first-party while preventing referrer leakage to third parties.

### `X-Content-Type-Options: nosniff`
Tells the browser to trust the `Content-Type` header instead of trying to detect the type from the bytes. Prevents an attacker from uploading a file that the browser would interpret as a script.

### `Cross-Origin-Opener-Policy: same-origin`
The page's browsing context group is isolated from cross-origin pages opened from it (and vice versa). Required for `SharedArrayBuffer` and a stronger isolation boundary.

### `Cross-Origin-Embedder-Policy: require-corp`
Cross-origin resources must explicitly opt-in to being loaded by this page (via `Cross-Origin-Resource-Policy: cross-origin` on their response). If the project loads any cross-origin resource that does not opt in, this header will block it. For a same-origin-only architecture, this is fine. For projects that pull from third-party APIs or CDNs, the third party must include the matching CORP header.

### `Cross-Origin-Resource-Policy: same-site`
Other origins cannot load this page's resources unless they're same-site. Defends against side-channel attacks like Spectre.

### `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `max-age=31536000` — 1 year. Browsers remember to use HTTPS for this origin.
- `includeSubDomains` — applies to every subdomain.
- `preload` — opt in to the browser's hardcoded HSTS list. Once preloaded, the protection survives even a fresh browser install.

Send only over HTTPS. Preload submission is at https://hstspreload.org.

## What is intentionally not set

### `X-Frame-Options`
Superseded by `Content-Security-Policy: frame-ancestors`. Set CSP only.

### `X-XSS-Protection`
Deprecated. Modern browsers ignore it; some implementations introduced their own vulnerabilities. Do not set.

### `Feature-Policy`
Renamed to `Permissions-Policy`. Set the new name only.

## Cookie attributes (not headers, but related)

When the project sets cookies (typically server-side):

- `Secure` — only sent over HTTPS
- `HttpOnly` — not accessible to JavaScript (defends against XSS stealing the cookie)
- `SameSite=Strict` or `SameSite=Lax` — controls cross-site sending (CSRF defense)
- `Path=/` — the typical scope
- `Max-Age=...` — explicit lifetime

Session cookies must use `Secure` and `HttpOnly`. CSRF tokens go in cookies + matching headers, not in `localStorage`.

## Reference

- MDN HTTP headers index: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
- OWASP Secure Headers Project: https://owasp.org/www-project-secure-headers/
- Mozilla Observatory (testing tool): https://observatory.mozilla.org/
- MDN `Permissions-Policy`: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
- MDN `Strict-Transport-Security`: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
- MDN `Cross-Origin-*` headers: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP)
- HSTS preload list: https://hstspreload.org
