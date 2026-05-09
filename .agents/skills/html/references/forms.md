# Forms

`<fieldset>` wraps fields. `<legend>` titles the fieldset. `<label>` wraps each input. Schema and rules come from JSON.

## The canonical form pattern

```html
<form>
  <fieldset>
    <legend>Contact</legend>

    <label>
      Name
      <input type="text" name="name" required />
    </label>

    <label>
      Email
      <input type="email" name="email" required />
    </label>

    <label>
      Message
      <textarea name="message" required></textarea>
    </label>

    <label role="button" aria-label="Send">
      Send
      <input type="checkbox" aria-hidden="true" />
    </label>
  </fieldset>
</form>
```

- `<form>` carries the form. It does not need an `action` if submission is handled by the `oninput` lifecycle (CRUD via `api.js`).
- `<fieldset>` groups related fields. Always use one.
- `<legend>` titles the group. The accessibility tree announces it as the group name.
- `<label>` wraps each input. The implicit association (label-as-parent) provides the accessible name without a `for` attribute.
- The submit action uses the state-machine pattern, not `<button type="submit">`.

## Multi-fieldset forms

Forms with logical sub-groups use multiple `<fieldset>`s:

```html
<form>
  <fieldset>
    <legend>Contact</legend>
    <label>Name <input type="text" name="name" required /></label>
    <label>Email <input type="email" name="email" required /></label>
  </fieldset>

  <fieldset>
    <legend>Message</legend>
    <label>Subject <input type="text" name="subject" /></label>
    <label>Body <textarea name="body" required></textarea></label>
  </fieldset>

  <fieldset>
    <legend>Actions</legend>
    <label role="button" aria-label="Send">
      Send
      <input type="checkbox" aria-hidden="true" />
    </label>
    <label role="button" aria-label="Cancel">
      Cancel
      <input type="checkbox" aria-hidden="true" />
    </label>
  </fieldset>
</form>
```

## Validation

Use native validation attributes:

- `required`
- `type="email"`, `type="url"`, `type="number"`, `type="date"`, `type="time"`, etc.
- `pattern="..."` for regex constraints
- `minlength`, `maxlength`, `min`, `max`, `step`

CSS reads validity via `:user-invalid` / `:user-valid`. See `../../css/references/inputs.md`.

## Schema-driven forms

For forms whose fields come from JSON, the schema declares:

```json
{
  "fields": [
    { "name": "name", "type": "text", "required": true, "label": "Name" },
    { "name": "email", "type": "email", "required": true, "label": "Email" },
    { "name": "message", "type": "textarea", "required": true, "label": "Message" }
  ]
}
```

`oninput.js` renders the fieldset by iterating the schema, creating each `<label>` with its `<input>`, and applying validation attributes. The HTML stays semantic; the dynamic part is the contents of the fieldset. See the `data-flow` skill.

## What forms never contain

- `<button onclick="...">` — `on*=` is forbidden
- `<button>` for non-intrinsic actions — use the label/checkbox state machine
- Inline `style` attributes
- `class` or `id` (except where required by external integration, in which case surface to user first)
- `<br>` for layout — use CSS Grid

## Reference

- HTML `<form>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
- HTML `<fieldset>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset
- HTML `<legend>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend
- HTML `<label>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
- MDN form validation: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
- WCAG 3.3 Input Assistance: https://www.w3.org/WAI/WCAG22/Understanding/input-assistance.html
