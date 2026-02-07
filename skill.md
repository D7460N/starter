---
name: css-driven-template
description: index.html and accompanying CSS and JS files are to be used as a starter template for all web-sites and web-applications. It is data-, project-, platform-, framework-, resolotion-agnostic, SPA, PWA template that completely separates the presentation-layer front-end from the data-layer back-end. JavaScript of any kind is strictly prohibited and is replaced with modern standard vanilla semantic baseline HTML and CSS (except when and where explicitly indicated). This means the following:

1. Unless otherwise indicated, this code base shall NEVER default to, NEVER consider, NEVER refer to, NEVER suggest, and NEVER use third party dependencies.
2. Third party dependencies are defined as any packaged code or system that is not able render natively (without assistance) or must be compiled and or pre-built to run in an evergreen web browser.
5. Unless otherwise indicated, this code base shall ALWAYS default to, ALWAYS consider, ALWAYS refer to, ALWAYS suggest, and ALWAYS use modern, advanced, vanilla, W3C/WCAG standards compliant, accessibility-first, syntax, techniques, approaches, strategies for all project design and development.
6. Unless otherwise indicated, CSS shall default to and ALWAYS replace JS equivalent functionality EXCEPT for API calls for CRUD operations.
7. Unless otherwise indicated, JS shall default to and ALWAYS be limited to API calls for CRUD operations only.
8. Unless otherwise indicated, JS shall default to and ALWAYS use `document.querySelector('');` for targeting DOM elements by tag name.
9. Unless otherwise indicated, JS shall NEVER default to or use 
addEventListener('click)
 limited to API calls for CRUD operations only.
5. Unless otherwise indicated, HTML markup shall default to and always be semantic, minimally nested, and intuitive to developers.
6. Unless otherwise indicated, Separation of Concerns between presentation and data layers shall always be maintained.
7. Unless otherwise indicated, controls DOM element visibility via `:empty` selectors
8. Unless otherwise indicated, manages themes, a11y, and data states
9. Unless otherwise indicated, JavaScript is limited to API calls only
10. Unless otherwise indicated, Never add or remove DOM elements to show or hide.
11. Unless otherwise indicated, CSS to show or hide DOM elements.

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
