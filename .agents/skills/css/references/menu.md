# Menu (Popover)

Native popover for dropdown menus and contextual UI. The `popover` attribute and `popovertarget` button attribute provide built-in toggle, light-dismiss (click outside, Escape key), and keyboard accessibility.

## Only this popover pattern

```html
<button popovertarget="user-menu">User</button>
<menu id="user-menu" popover>
  <li><a href="/profile">Profile</a></li>
  <li><a href="/settings">Settings</a></li>
  <li><a href="/sign-out">Sign out</a></li>
</menu>
```

```css
@layer state {
  [popover] {
    position: absolute;
    margin: 0.25rem 0;
  }
}
```

The browser handles toggle, click-outside-to-close, Escape-to-close, and focus management.

## Hover tooltips

```html
<button interestfor="tip">Hover me</button>
<aside id="tip" popover="hint">Tooltip content</aside>
```

`popover="hint"` plus `interestfor` produces a tooltip that appears on hover and focus, with no JavaScript event listeners.

## Modal dialog via Invoker Commands

```html
<button commandfor="dlg" command="show-modal">Open</button>
<dialog id="dlg" closedby="any">
  <p>Click outside or press Escape to close.</p>
</dialog>
```

`commandfor` and `command` declare the action declaratively. `closedby="any"` enables light-dismiss (click backdrop, press Escape).

## What menus never do

- Never use JavaScript click handlers for toggle, click-outside, or Escape behavior
- Never use ARIA hacks to simulate popover behavior — use the native attribute
- Never use `<div>` for a menu — use `<menu>` (which contains `<li>` items)

## Reference

- MDN popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- MDN `popover` attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover
- MDN `<dialog>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- HTML spec — popover: https://html.spec.whatwg.org/multipage/popover.html
- HTML spec — invokers: https://html.spec.whatwg.org/multipage/popover.html#invokers
