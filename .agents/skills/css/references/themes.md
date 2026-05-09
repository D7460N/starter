# Themes

Light, dark, and system themes via `color-scheme`, `light-dark()`, and `oklch`. No duplicate theme blocks. No `class="dark-mode"`.

## Only this color-scheme declaration

```css
@layer themes {
  :root {
    color-scheme: light dark;
  }
}
```

That single declaration tells the browser the page supports both schemes. Browser-rendered controls (form fields, scrollbars, default backgrounds) match the user's system preference automatically.

## Only `oklch` for project colors

```css
@layer themes {
  :root {
    --surface-1: light-dark(oklch(80% 10% 250), oklch(10% 5% 250));
    --surface-2: light-dark(oklch(90% 7% 250), oklch(20% 5% 250));
    --surface-3: light-dark(oklch(100% 8% 250), oklch(30% 5% 250));
    --text-1: light-dark(oklch(10% 5% 250), oklch(90% 5% 250));
    --text-2: light-dark(oklch(20% 5% 250), oklch(80% 5% 250));
    --accent: oklch(70% 18% 230);
  }
}
```

`oklch` is perceptually uniform — the same `L` value produces the same perceived brightness across hues. `hsl`, `hex`, and `rgb` are not perceptually uniform and are forbidden for project colors.

`light-dark(LIGHT_VALUE, DARK_VALUE)` resolves automatically based on `color-scheme`. No `@media (prefers-color-scheme: dark)` block is needed for paired values.

## Color variants without preprocessor

Relative color syntax derives variants at runtime:

```css
@layer themes {
  :root {
    --accent-light: oklch(from var(--accent) calc(l + 0.15) c h);
    --accent-dark: oklch(from var(--accent) calc(l - 0.15) c h);
  }
}
```

Updates automatically when `--accent` changes. No Sass `lighten()` / `darken()` needed.

## Color mixing without preprocessor

```css
@layer themes {
  .panel {
    background: color-mix(in oklab, var(--surface-2), transparent 90%);
  }
}
```

`color-mix(in COLOR_SPACE, A, B PERCENT)` blends two colors at runtime. `oklab` produces perceptually smooth mixes.

## Body background

```css
@layer themes {
  body {
    background: radial-gradient(circle in oklab,
      var(--surface-2),
      var(--surface-1)) fixed;
    color: var(--text-1);
  }
}
```

`circle in oklab` keeps the gradient perceptually smooth.

## Manual override (rare)

Theme follows the system by default. If a user-toggle is needed, the toggle is a state machine (checkbox in label) and CSS reads it via `:has()`:

```css
@layer themes {
  :root:has(header label:last-of-type input:checked) {
    /* manual dark override regardless of system */
  }
}
```

System preference remains the default; the toggle only overrides when checked.

## Accent color for native controls

```css
@layer themes {
  :root {
    accent-color: var(--accent);
  }
}
```

`accent-color` styles native form controls (checkboxes, radios, range sliders, progress bars) to match the brand without rebuilding the controls.

## What themes never do

- Never duplicate values in `:root` and `@media (prefers-color-scheme: dark)` — use `light-dark()`
- Never use `hex`, `rgb`, or `hsl` for project colors — use `oklch`
- Never use `class="dark-mode"` to switch themes — `color-scheme` and `light-dark()` handle it
- Never re-style native form controls when `accent-color` covers the need

## Reference

- MDN `color-scheme`: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
- MDN `light-dark()`: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
- MDN `oklch()`: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- MDN `color-mix()`: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
- MDN `accent-color`: https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color
- W3C CSS Color Module Level 4: https://www.w3.org/TR/css-color-4/
