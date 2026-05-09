# Shell Layout

The complete, canonical `index.html` shell. Single file at project root. SPA + PWA.

## The full file

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title></title>
  <link rel="manifest" href="manifest.webmanifest" />
  <link rel="stylesheet" href="assets/css/reset.css" />
  <link rel="stylesheet" href="assets/css/fonts.css" />
  <link rel="stylesheet" href="assets/css/layout.css" />
  <link rel="stylesheet" href="assets/css/typography.css" />
  <link rel="stylesheet" href="assets/css/themes.css" />
  <link rel="stylesheet" href="assets/css/transitions.css" />
  <link rel="stylesheet" href="assets/css/inputs.css" />
  <link rel="stylesheet" href="assets/css/media.css" />
</head>
<body>
  <app-container>
    <app-banner></app-banner>
    <header>
      <app-logo></app-logo>
      <app-user></app-user>
    </header>
    <nav></nav>
    <main>
      <article>
        <h1></h1>
        <p></p>
        <section>
          <ul></ul>
        </section>
      </article>
    </main>
    <aside></aside>
    <footer>
      <app-legal></app-legal>
      <app-version></app-version>
    </footer>
    <app-banner></app-banner>
  </app-container>
  <script type="module" src="assets/js/app.js"></script>
</body>
</html>
```

## Region responsibilities

| Region | Responsibility |
|---|---|
| `<app-container>` | The grid root. Holds all visible regions. |
| `<app-banner>` (top) | Optional top banner — alerts, system messages. Empty by default. |
| `<header>` | Wraps `<app-logo>` (brand mark) and `<app-user>` (user info). |
| `<nav>` | Global navigation. Populated from shell payload via `oninput.js`. |
| `<main>` | Primary content. Wraps `<article>` containing `<h1>`, optional `<p>`, and `<section>`. |
| `<section>` | The scrollable content surface. Holds `<ul>` for list-rendered pages. |
| `<aside>` | Sidebar / supplementary content. |
| `<footer>` | Wraps `<app-legal>` and `<app-version>`. |
| `<app-banner>` (bottom) | Optional bottom banner. Empty by default. |

## Custom-element slots

`<app-logo>`, `<app-user>`, `<app-legal>`, `<app-version>`, and `<app-banner>` are semantic anchors. They carry no behavior of their own — they exist to give CSS specific targets and to mark content destinations for `oninput.js`.

`<app-container>` is the layout root. CSS Grid styles it as the Holy Grail.

## The script tag

One `<script type="module">` at the end of `<body>`, outside `<app-container>`. `app.js` is the entrypoint; it imports the lifecycle and starts it.

## What the shell never contains

- Inline styles
- Inline scripts
- `class` attributes
- `id` attributes
- `data-*` attributes
- `<div>` or `<span>`
- `on*=` event handler attributes
- More than one `<script>` tag
- More than one `<title>` element

## Reference

- HTML `<head>` element guide: https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML
- PWA manifest: https://developer.mozilla.org/en-US/docs/Web/Manifest
- HTML script type=module: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
