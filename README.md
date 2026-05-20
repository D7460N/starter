# D7460N Architecture

```css
_       ___        ___  _____     ___        __        __     ___
 )  ____) (__    __) /  \    |    \ (__    __) \    ___) |    \  
(  (___      |  |   /    \   |     )   |  |     |  (__   |     ) 
 \___  \     |  |  /  ()  \  |    /    |  |     |   __)  |    /  
 ____)  )    |  | |   __   | | |\ \    |  |     |  (___  | |\ \  
(      (_____|  |_|  (__)  |_| |_\ \___|  |____/       )_| |_\ \_

```



## Have UI, bring data.

**One codebase. One UI. Infinite backends.**

Presentation layer, hosted once. Called by anything. Any backend. Any language. Any platform.

---

## Did you know . . .

**. . . CSS is always live, always reactive to dynamic DOM changes?**
The word "reactive" got hijacked by React. CSS was reactive first. Native. Zero overhead. It's been this way the whole time.

**. . . modern baseline CSS can now replace most, if not all, JavaScript UI equivalents?**
`:has()`, `:checked`, `:empty`, container queries, `@starting-style`, anchor positioning, view transitions. The browser ships a UI runtime. Nobody's been using it.

**. . . the presentation layer can now be fetched (not copied) as an independent, autonomous resource?**
This is the part that hasn't been done before.

---

## What you don't need to bring

- No AI
- No framework
- No build tools
- No transpilers
- No 3rd-party dependencies

**Bring them if you want.** D7460N runs alongside whatever's already in your stack. It just doesn't require any of it.

**Compatible.** Works with what you've already shipped.
**Interoperable.** Talks to any backend over HTTP and JSON.
**Extensible.** Add your own modules without touching the core.

---

## ## One front-end. At any scale.

| Projects | Front-ends | New codebases | New build pipelines | New dependencies | Cost to add next project | Time to launch next project |
|---|---|---|---|---|---|---|
| 1 | 1 | 0 | 0 | 0 | $0 | 0 |
| 10 | 1 | 0 | 0 | 0 | $0 | 0 |
| 100 | 1 | 0 | 0 | 0 | $0 | 0 |
| 1,000 | 1 | 0 | 0 | 0 | $0 | 0 |

Same codebase. Same UI. Different data. Different backends. Different brands. Different deployments.

- **Build once. Use everywhere.** One front-end deployable to a CDN, callable by any backend.
- **Uniform look and feel across every project.** Brand changes are CSS variable swaps.
- **Auto-layout that adapts to the environment.** OS, viewport, light/dark mode, reduced motion, contrast preferences, language direction, input method. The UI reads the platform and responds.
- **Layout that adapts to the data.** Empty states, sparse states, dense states, error states. The same CSS handles all of them because CSS is reactive to the DOM.

Scale becomes a deployment instead of a migration.

---

## Same architecture. Two audiences.

| Developers | Stakeholders |
|---|---|
| Single `index.html`. Open it. It works. | No build pipeline to maintain. |
| `:has()`, `:checked`, `:empty` drive UI state. | UI that survives framework cycles, because it isn't in one. |
| `fetch()` for CRUD. That's all the JS does. | Junior devs can maintain it. So can senior devs from any background. |
| Zero dependencies, zero lock-in. | No supply-chain risk. No deprecation deadline. |
| One repeatable `oninput` event handles all CRUD. | Script-based XSS attack surface collapses to near zero. |
| Semantic HTML only. No `<div>`. No `<span>`. | 508 / WCAG compliant by construction, not by audit. |
| Edit. Refresh. Ship. | Time-to-feature collapses. |
| One UI on a CDN, fetched as an autonomous resource. | One UI serving every backend you own. |
| Standards-only. Forward-compatible. | Migration path in is just standards. Migration path out is also just standards. |

---

## Where users live

A UI is where end-users spend their working day. The architecture treats it that way.

When I shipped a fraction of what the platform makes possible for end-user customization, leadership told me they had never seen a UI give that much attention and respect to the people using it. That reaction wasn't about the features. It was about the signal those features sent: **you are valued here.**

That signal compounds.

- Users who feel respected take ownership of the tool.
- Users who take ownership use the tool more effectively.
- Effective users produce more, with less friction, in less time.
- Less friction at the individual scale becomes saved budget at the team scale.
- A team that feels respected has higher morale, more energy, more enthusiasm.
- Higher morale compounds across the workforce.

One respected user is a productivity gain. A whole workforce that feels respected is a different company.

The customization itself is just CSS doing what CSS does:

- **Light, dark, or system theme** via `prefers-color-scheme` and custom properties.
- **Font size and zoom** via relative units throughout.
- **Reduced motion** via `prefers-reduced-motion`.
- **High contrast and forced colors** via `prefers-contrast` and `forced-colors`.
- **Spacing and density** via custom property scales.
- **Language direction** via logical properties and writing modes.
- **Input method adaptation** via pointer, hover, and touch media queries.

Preferences persist across sessions in `localStorage`. Changes apply instantly. No rebuild. No reload. No round-trip.

Other architectures treat user preferences as a feature to schedule. This one treats them as a place to live.

---

## Browser-Centric SDLC

Every framework and CMS sells itself as the center of software delivery. React. Angular. WordPress. Drupal. AEM. Each one positions itself in the middle of the diagram, with design, development, content, QA, and deployment orbiting around it.

D7460N starts with the browser what is already installed in every environment, the web browser. 

> *[SDLC illustration goes here — horizontal flow with the browser as the central node, every role's lines of sight converging on it.]*

The browser is what every role already looks at:

- **Designers** evaluate the design in the browser.
- **Developers** verify the code in the browser.
- **QA** tests the build in the browser.
- **Stakeholders** approve the work in the browser.
- **End-users** do their job in the browser.

Every visual cue about whether something is working, broken, fast, slow, accessible, on-brand, or usable comes through the browser. It is the single surface where the entire delivery pipeline gets judged.

Most architectures put a framework or a CMS at the center and render through the browser. D7460N skips the middleman. The browser is the runtime, the rendering target, and the assessment surface. One focal point. No translation layer between what gets built and what gets seen.

UX and DX converge here. The developer is looking at the same surface the user is going to look at. The feedback loop is the same loop.

---

## What this is

**D7460N Architecture** is an open-source, browser-native, fully declarative front-end architecture for building scalable, maintainable, accessible web applications.

**D7460N Starter** is the reference implementation. A Single Page Application that is also a Progressive Web App, served from a single `index.html`, maintained through strict Separation of Concerns and modern W3C / WCAG standards.

Easy. Fast. Developer-friendly. Stakeholder-defensible.

---

## Air-gapped Separation of Concerns

Most architectures organize HTML, CSS, and JS into separate files and call it Separation of Concerns. The layers still talk to each other constantly. Class hooks. ID selectors. `data-*` attributes. Framework bindings. Ref objects. They're separate in name. Coupled in practice.

D7460N air-gaps them.

| Layer | Job | What it never does | What it never touches |
|---|---|---|---|
| **HTML** | Semantic structure only | Style. State. Behavior. | No `class`. No `id`. No `data-*`. No `on*=` handlers. |
| **CSS** | Everything visible. Every state. Every transition. | Fetch. Store. Compute business logic. | Never depends on JS to apply a class or flip a flag. Reacts to the DOM as it is. |
| **JavaScript** | CRUD against an API. Data delivery. | Touch the DOM for presentation. Manage UI state. | No class manipulation. No style injection. No event listeners. Hands off JSON and walks away. |

**No shared hooks. No agreed-upon vocabulary between layers. No coupling tokens.** Each layer does its job using only what's native to it: semantic elements, CSS selectors, `fetch()`. They compose at runtime through the DOM and the JSON shape. Nothing else.

This is what makes the presentation layer independently deployable. If HTML, CSS, and JS shared a vocabulary of class hooks and data attributes, you couldn't host the UI on a CDN and call it from any backend. Every backend would have to know the hook names. Air-gap the layers and that problem disappears.

This is a style preference becoming an architectural law. The same law that makes "UI as a Service" possible.

---
## Secure by design

Most architectures bolt security on. This one makes insecurity unreachable.

The same decoupling that enables one UI to serve infinite backends also forbids, by construction, every pattern that script-based XSS depends on.

| What's forbidden | What it would have enabled |
|---|---|
| Inline `<script>` blocks | Reflected XSS via injected scripts |
| `on*=` event handler attributes | Stored XSS via persisted markup |
| `innerHTML` with markup strings | DOM XSS via untrusted strings |
| `eval`, `Function`, dynamic code | Arbitrary remote code execution |
| Third-party CDN scripts | Supply-chain compromise |
| Inline `style=` attributes | CSS-based data exfiltration |

What's left for JavaScript to do? **One repeatable `oninput` event for CRUD.** That's it. The attack surface for script-based XSS collapses to near zero.

The Content Security Policy that hardens this can be strict by default. No `unsafe-inline`. No `unsafe-eval`. No third-party allowlist.

```css
script-src 'self';
style-src 'self';
object-src 'none';
base-uri 'self';
frame-ancestors 'none';
```

Most projects spend years migrating toward a CSP this strict. This architecture ships with it on day one.

---

## Accessibility as a side effect

The architecture's HTML rule is "semantic structure only." No `<div>`. No `<span>`. No `class`. No `id`.

That rule isn't about accessibility. It produces accessibility anyway.

- Every interactive element is a real `<button>`, `<a>`, `<input>`, `<label>`, or `<select>`. Keyboard navigation works because it's native.
- Every landmark is a real `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. Screen readers map the page because the page maps itself.
- Focus order matches DOM order. No `tabindex` gymnastics.
- ARIA is used sparingly and correctly, because the semantic baseline already says what most components are.

508 and WCAG compliance becomes what's left when you take the broken patterns away. Not a quarterly remediation project.

---

## Fast and simple, by design

- Browser-native. Zero dependencies.
- Fully declarative UI logic via `:has()`, `:checked`, `:empty`, container queries, and friends.
- Dynamic rendering driven by always-live, always-reactive CSS. No virtual DOM diffing.
- Responsive, accessible, and standards-compliant out of the box.
- No build step. Edit. Refresh. Done.

---

## Status

Active development. Reference deployments in flight. The starter is live. New sites are being built against the same single codebase to prove the "UI as a Service" thesis end-to-end.

Have UI. Bring data. That's the whole story.

![D7460N](https://raw.githubusercontent.com/D7460N/starter/refs/heads/main/assets/images/brand/logo.svg)

![D7460N](https://raw.githubusercontent.com/D7460N/starter/refs/heads/main/assets/images/brand/logo.svg)

![Image](https://raw.githubusercontent.com/D7460N/starter/refs/heads/main/assets/images/brand/logo.svg)
