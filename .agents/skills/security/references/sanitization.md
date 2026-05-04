# Sanitization

Text vs. HTML injection. The architecture's default is text injection. HTML injection is an explicit, documented exception.

## Default: text injection

```javascript
// safe — the browser treats the value as text, not as markup
element.textContent = userValue;
```

If `userValue` contains `<script>alert(1)</script>`, the browser displays the literal characters. No parsing happens.

`textContent` is the default for all data injection in `oninput.js` and `data-flow`.

## Setting attributes from data

```javascript
// allowlist of safe attributes for the element type
const SAFE_ATTRS = new Set(['href', 'src', 'alt', 'title', 'lang']);

function setAttrFromData(el, name, value) {
  if (!SAFE_ATTRS.has(name)) {
    throw new Error(`Attribute ${name} not allowed from data`);
  }
  // additional checks for url-bearing attributes
  if (name === 'href' || name === 'src') {
    if (!isSafeURL(value)) {
      throw new Error(`Unsafe URL: ${value}`);
    }
  }
  el.setAttribute(name, value);
}

function isSafeURL(value) {
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}
```

`javascript:` URLs are explicitly excluded. Relative URLs are resolved against the current origin, then the protocol is checked.

## Forbidden: HTML injection from data

```javascript
// FORBIDDEN
element.innerHTML = userValue;
```

`innerHTML` parses the assigned string as markup. An attacker who controls `userValue` can inject elements, attributes, and (with sufficient browser leniency) scripts.

This pattern is forbidden architecturally. If a use case genuinely requires rendering trusted HTML, treat it as an exception:

1. Document the exception in the project's security notes.
2. Define the allowlist of permitted elements and attributes at the integration boundary.
3. Use a battle-tested sanitizer at the boundary (DOMPurify, or the upcoming HTML Sanitizer API where supported).
4. Never call `innerHTML` outside that boundary.

## HTML Sanitizer API (modern browsers)

When supported, the native sanitizer is preferred over a third-party library:

```javascript
const sanitized = element.setHTMLUnsafe(trustedHTML, {
  sanitizer: { /* allowlist config */ }
});
```

(The exact API is still settling — verify against current MDN before using.) The native sanitizer reduces the JavaScript bundle and is updated by the browser.

## Trusted Types

For projects that opt in, Trusted Types makes `innerHTML` and similar sinks reject plain strings entirely:

```
Content-Security-Policy: require-trusted-types-for 'script'; trusted-types default;
```

Once enforced, only values created by a registered Trusted Types policy can be assigned to dangerous sinks. This converts an entire class of XSS bugs into runtime errors that surface in development.

The architecture is compatible with Trusted Types because it doesn't use `innerHTML` in the first place — turning on Trusted Types is "free" in the sense that no existing code paths break.

## Output encoding

When writing data to:

- **HTML text** — `textContent` (already encoded)
- **HTML attribute** — `setAttribute` (encoded automatically; never string-concatenate into an attribute)
- **URL** — `encodeURIComponent` for path / query parts
- **CSS** — never inject data into CSS values; use custom properties on the element instead

```javascript
// inject a per-element value safely
element.style.setProperty('--row-progress', `${value}%`);
```

A custom property declared via `setProperty` is treated as a value, not as a string assembled into a CSS rule.

## What sanitization never does

- Never relies on regex-based "stripping" of HTML
- Never builds a "safe" subset by hand without a sanitizer library or the native API
- Never trusts a value from the network without explicit allowlist checks at the boundary
- Never uses `eval` or `new Function` on data

## Reference

- MDN `textContent`: https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
- MDN `Element.setAttribute()`: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
- MDN HTML Sanitizer API: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API
- W3C Trusted Types: https://www.w3.org/TR/trusted-types/
- DOMPurify (when native sanitizer is unavailable): https://github.com/cure53/DOMPurify
- OWASP XSS prevention cheat sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
