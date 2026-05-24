# D7460N Architecture

```
        ___        ___  _____     ___        __        __     ___
 )  ____) (__    __) /  \    |    \ (__    __) \    ___) |    \  
(  (___      |  |   /    \   |     )   |  |     |  (__   |     ) 
 \___  \     |  |  /  ()  \  |    /    |  |     |   __)  |    /  
 ____)  )    |  | |   __   | | |\ \    |  |     |  (___  | |\ \  
(      (_____|  |_|  (__)  |_| |_\ \___|  |____/       )_| |_\ \_
```

## Have UI, bring data.

**One codebase. One UI. Infinite backends.**

> Presentation layer, hosted once. Called by anything. Any backend. Any language. Any platform.

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

**Bring them if you want.**

D7460N runs alongside whatever's already in your stack. It just doesn't require any of it.

- **Compatible.** Works with what you've already shipped.  
- **Interoperable.** Talks to any backend over HTTP and JSON.  
- **Extensible.** Add your own modules without touching the core.

---

## One front-end, at scale
> _Called, not copied._


| Projects | Front-ends | New codebases | New build pipelines | New dependencies | Cost to add next project | Time to launch next project |
|---|---|---|---|---|---|---|
| 1 | 1 | 0 | 0 | 0 | $0 | 0 |
| 10 | 1 | 0 | 0 | 0 | $0 | 0 |
| 100 | 1 | 0 | 0 | 0 | $0 | 0 |
| 1,000 | 1 | 0 | 0 | 0 | $0 | 0 |
| 10,000 | 1 | 0 | 0 | 0 | $0 | 0 |

Same codebase. Same UI. Different data. Different backends. Different brands. Different deployments.

- **Build once. Use everywhere.** One front-end deployable to a CDN, callable by any backend.
- **Uniform look and feel across every project.** Brand changes are CSS variable swaps.
- **Auto-layout that adapts to the environment.** OS, viewport, light/dark mode, reduced motion, contrast preferences, language direction, input method. The UI reads the platform and responds.
- **Layout that adapts to the data.** Empty states, sparse states, dense states, error states. The same CSS handles all of them because CSS is reactive to the DOM.

Every project in a framework-based stack adds its own build pipeline, its own dependency tree, and its own framework version to track. Each one is a tax on every project that came before it.

**D7460N**'s numbers stay at zero because there is nothing to add.

Scale becomes a deployment instead of a migration.

---

## Browser-Centric SDLC

Every **framework** and **CMS** start with themselves as the center of software delivery. **React**. **Angular**. **WordPress**. **Drupal**. **Joomla**, **AEM**. Each as their own SDLC center piece along with their proprietary 3rd, 4th, 5th, etc., party dependencies in the center of SDLC diagrams with design, development, content, QA, and deployment orbiting around it.

**D7460N** starts, is dependent on, and ends with what is already installed in every environment, the **BROWSER**.

> *[SDLC illustration goes here — horizontal flow with the browser as the central node, every role's lines of sight converging on it.]*

The browser is what every role already looks at:

- **Designers** evaluate the design in the browser.
- **Developers** verify the code in the browser.
- **QA** tests the build in the browser.
- **Stakeholders** approve the work in the browser.
- **End-users** do their job in the browser.

Every visual cue about whether something is working, broken, fast, slow, accessible, on-brand, or usable comes through the browser. It is the single surface where the entire delivery pipeline gets judged.

Most architectures put a framework or a CMS at the center and render through the browser. D7460N skips the middleman. The browser is the runtime, the rendering target, and the assessment surface all in one. No translation layer between what gets built and what gets seen. One focal point. One design. One source of truth.

UX and DX converge here. The developer is looking at the same surface the user is going to look at. The feedback loop is the same loop.

---

## Same architecture. Many audiences.

The architecture is one thing. Its benefits land differently depending on who's reading.

<details>
<summary><strong>Developers</strong></summary>

One `index.html`. One repeatable `oninput` event for all CRUD. No build step, no transpiler, no framework version to track. Open the file. It works.
</details>

<details>
<summary><strong>Designers</strong></summary>

CSS is the runtime. Design changes ship by editing CSS, with no JavaScript intervention required. The cascade is the design system.
</details>

<details>
<summary><strong>Clients</strong></summary>

A site that doesn't accrue technical debt while sitting still. No framework migration bills in year three. Brand changes are CSS variable swaps.
</details>

<details>
<summary><strong>End users</strong></summary>

Small payload. No framework runtime. Fast first paint. Keyboard navigation that works. Screen readers that work. No cookie banners for analytics nobody asked for.
</details>

<details>
<summary><strong>Stakeholders and executives</strong></summary>

No supply-chain risk. No deprecation deadlines. No vendor lock-in. Predictable cost. Headcount stays focused on features instead of toolchain.
</details>

<details>
<summary><strong>Middle management and product</strong></summary>

Junior devs can ship. Senior devs from any background can maintain it. Cross-team dependencies shrink because the front-end has no toolchain to coordinate.
</details>

<details>
<summary><strong>Security and compliance</strong></summary>

Strict Content Security Policy on day one. No `unsafe-inline`. No `unsafe-eval`. No third-party scripts to audit. Script-based XSS attack surface near zero.
</details>

<details>
<summary><strong>Accessibility teams</strong></summary>

Semantic HTML only. Every interactive element is a real `<button>`, `<a>`, `<input>`, `<label>`, or `<select>`. 508 and WCAG compliance falls out of the architecture, not out of remediation budgets.
</details>

<details>
<summary><strong>DevOps and SRE</strong></summary>

Static assets only. CDN-cacheable. No build pipeline to maintain, monitor, or break. Deployment is a file copy.
</details>

<details>
<summary><strong>QA and testing</strong></summary>

The DOM is predictable because nothing is rewriting it. No virtual DOM diffing, no framework version skew, no flaky hydration. Components test in isolation.
</details>

<details>
<summary><strong>Procurement and legal</strong></summary>

Open source. No SaaS dependencies in the runtime. No license entanglements to clear. No third-party data processors to disclose.
</details>

<details>
<summary><strong>Founders and new ventures</strong></summary>

Ship a working front-end without hiring a front-end team. Add backends as the business grows. The UI scales for free.
</details>

---

## What this is

**D7460N Architecture** is an open-source, browser-native, fully declarative front-end architecture for building scalable, maintainable, accessible web applications.

**D7460N Starter** is the reference implementation. A Single Page Application that is also a Progressive Web App, served from a single `index.html`, maintained through strict Separation of Concerns and modern W3C / WCAG standards.

Easy. Fast. Developer-friendly. Stakeholder-defensible.

---

## Decoupled to the point of air-gap

Most architectures organize HTML, CSS, and JS into separate files and call it Separation of Concerns. The layers are decoupled in name. Coupled in practice. They still talk to each other constantly through class hooks, ID selectors, `data-*` attributes, framework bindings, and ref objects.

D7460N takes decoupling all the way. The layers are air-gapped.

| Layer | Job | What it never does | What it never touches |
|---|---|---|---|
| **HTML** | Semantic structure only | Style. State. Behavior. | No `class`. No `id`. No `data-*`. No `on*=` handlers. |
| **CSS** | Everything visible. Every state. Every transition. | Fetch. Store. Compute business logic. | Never depends on JS to apply a class or flip a flag. Reacts to the DOM as it is. |
| **JavaScript** | CRUD against an API. Data delivery. | Touch the DOM for presentation. Manage UI state. | No class manipulation. No style injection. No event listeners. Hands off JSON and walks away. |

**Fully decoupled means no shared hooks, no agreed-upon vocabulary between layers, no coupling tokens.** Each layer does its job using only what's native to it: semantic elements, CSS selectors, `fetch()`. They compose at runtime through the DOM and the JSON shape. Nothing else.

This is what makes the presentation layer independently deployable. Coupled layers can't be hosted on a CDN and called from any backend, because every backend would have to know the shared hook names. Decouple the layers all the way to air-gap, and that problem disappears.

This is the architectural law that makes "UI as a Service" possible.

---

## Secure by design

Most architectures bolt security on. This one makes insecurity unreachable.

The same decoupling that enables one UI to serve infinite backends also forbids, by construction, every pattern that script-based XSS depends on.

<details>
<summary><strong>What the architecture forbids, and the attacks each forbidden pattern would have enabled</strong></summary>

| What's forbidden | What it would have enabled |
|---|---|
| Inline `<script>` blocks | Reflected XSS via injected scripts |
| `on*=` event handler attributes | Stored XSS via persisted markup |
| `innerHTML` with markup strings | DOM XSS via untrusted strings |
| `eval`, `Function`, dynamic code | Arbitrary remote code execution |
| Third-party CDN scripts | Supply-chain compromise |
| Inline `style=` attributes | CSS-based data exfiltration |

</details>

What's left for JavaScript to do? **One repeatable `oninput` event for CRUD.** That's it. The attack surface for script-based XSS collapses to near zero.

The Content Security Policy that hardens this can be strict by default. No `unsafe-inline`. No `unsafe-eval`. No third-party allowlist.

```
script-src 'self';
style-src 'self';
object-src 'none';
base-uri 'self';
frame-ancestors 'none';
```

Most projects spend years migrating toward a CSP this strict. This architecture ships with it on day one.

---

## Accessible by design

Most architectures retrofit accessibility. This one makes inaccessibility unreachable.

The HTML rule is "semantic structure only." No `<div>`. No `<span>`. No `class`. No `id`. That rule isn't about accessibility, but it produces accessibility anyway.

- Every interactive element is a real `<button>`, `<a>`, `<input>`, `<label>`, or `<select>`. Keyboard navigation works because it's native.
- Every landmark is a real `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. Screen readers map the page because the page maps itself.
- Focus order matches DOM order. No `tabindex` gymnastics.
- ARIA is used sparingly and correctly, because the semantic baseline already says what most components are.

508 and WCAG compliance becomes what's left when you take the broken patterns away. Not a quarterly remediation project.

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

<details>
<summary><strong>The customization itself is just CSS doing what CSS does</strong></summary>

- **Light, dark, or system theme** via `prefers-color-scheme` and custom properties.
- **Font size and zoom** via relative units throughout.
- **Reduced motion** via `prefers-reduced-motion`.
- **High contrast and forced colors** via `prefers-contrast` and `forced-colors`.
- **Spacing and density** via custom property scales.
- **Language direction** via logical properties and writing modes.
- **Input method adaptation** via pointer, hover, and touch media queries.

Preferences persist across sessions in `localStorage`. Changes apply instantly. No rebuild. No reload. No round-trip.

</details>

Other architectures treat user preferences as a feature to schedule. This one treats them as a place to live.

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

---

## Roadmap

Future section: **Browser as IDE.** Design and development happen in the browser itself. In secure environments where software installation requires special permissions, the most useful dev tool is the one already installed. Bookmarked for the next pass.

---

![D7460N](https://raw.githubusercontent.com/D7460N/starter/refs/heads/main/assets/images/brand/logo.svg)
