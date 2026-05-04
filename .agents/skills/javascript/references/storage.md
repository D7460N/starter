# Storage

`localStorage` primary. Cookie fallback when `localStorage` is unavailable. Generic, single-purpose utilities.

## The shape of `storage.js`

```javascript
const COOKIE_PATH = '/';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function localStorageAvailable() {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function setItem(key, value) {
  const serialized = JSON.stringify(value);
  if (localStorageAvailable()) {
    window.localStorage.setItem(key, serialized);
    return;
  }
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(serialized)}; path=${COOKIE_PATH}; max-age=${COOKIE_MAX_AGE}`;
}

export function getItem(key) {
  if (localStorageAvailable()) {
    const raw = window.localStorage.getItem(key);
    return raw == null ? null : JSON.parse(raw);
  }
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${encodeURIComponent(key)}=`));
  if (!match) return null;
  return JSON.parse(decodeURIComponent(match.split('=')[1]));
}

export function removeItem(key) {
  if (localStorageAvailable()) {
    window.localStorage.removeItem(key);
    return;
  }
  document.cookie = `${encodeURIComponent(key)}=; path=${COOKIE_PATH}; max-age=0`;
}
```

Three functions: `setItem`, `getItem`, `removeItem`. JSON-serialized values. `localStorage` first, cookie fallback if unavailable (private browsing, storage quota, restricted contexts).

## Sensitive data

Never store secrets, tokens, or session credentials in `localStorage`. The browser exposes `localStorage` to any script running on the same origin — including a future XSS. Tokens belong in HttpOnly cookies set by the server.

## What storage never does

- Never stores HTML or DOM references
- Never stores JavaScript functions
- Never stores secrets
- Never silently swallows JSON parse errors (they throw — caller handles)

## Reference

- MDN `localStorage`: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- MDN `document.cookie`: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
- MDN cookie security: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#security
