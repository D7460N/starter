---
name: css-driven-template
description: index.html and accompanying CSS and JS files are to be used as a starter template for all web-sites and web-applications. It is data-, project-, platform-, framework-, resolotion-agnostic, SPA, PWA template that completely separates the presentation-layer front-end from the data-layer back-end using modern baseline CSS for all state management, theming, heuristics, and conditional DOM node visibility. JS handles only API calls for CRUD operations. HTML DOM structure is pre-built in index.html.
---

# CSS-Driven Web Template

## Architecture

- **index.html** (root): Complete DOM structure, pre-built
- **assets/css/**: Drop-in modular CSS files control all layout, conditional DOM visibility, themes, user interaction, heuristics
- **assets/js/**: Data transport for CRUD operations only
- **assets/images/**: Static assets

## Key Principles (non-negotiable)

1. Code shall default to and always be modern and vanilla.
2. HTML markup shall default to and always be semantic, minimally nested, and intuitive to developers.
3. 3rd party dependencies shall NEVER be considered, suggested, or used unless otherwise instructed.
4. Separation of Concerns between presentation and data layers shall always be maintained.
5. CSS controls DOM element visibility via `:empty` selectors
6. CSS manages themes, a11y, and data states
7. JavaScript is limited to API calls only
8. Never add/remove DOM elements for show/hide-use CSS

## CSS Files

- `a11y.css` - Accessibility styles
- `layout.css` - Grid only structure (never flex)
- `reset.css` - Browser normalization
- `scrollbars.css` - Custom scrollbar styling
[Add others as needed]

## When modifying this project

- All UI states, including loading states, use CSS and HTML checkboxs as state machines
- Keep JS focused on fetch/CRUD only
- Always only ever use semantic HTML markup
- Never use div, span, class, data-*, or id.
