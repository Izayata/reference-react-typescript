# Fonts report (thesis, Phase 4)

State **after** the Phase 4 typography fixes. The fonts are self-hosted through `@fontsource`. They are bundled by webpack into `build/static/media/*.woff2`, so the app makes no Google Fonts `<link>` and no external font requests.

## Fonts in use

| Font | Package / version | Type | Weights loaded | Where it is used (selectors and UI elements) |
|---|---|---|---|---|
| **Pacifico** | `@fontsource/pacifico` 5.3.0 | Script / display (fallback: generic `cursive`) | 400 | `.page-title` (page titles, e.g. "Pénztár", "Szezonális tematikánk"); `.header` (top bar: "ImagineBar • Ahol álmaid étele vár"); `.footer h3` (footer column headings); `.menu-item-category-name` (menu category title); `.allergen-page-title`; `.user-profile-title`; `.food-details-title`; `.food-details-allergens` (allergen label on the food details page); `.shopping-cart-empty-message` |
| **Roboto** | `@fontsource/roboto` 5.3.0 | Sans serif (fallback: generic `sans-serif`) | 400, 500, 600, 700 | Everything else, set once on `body` in `src/index.css` and inherited: navigation bar and hamburger menu, cards, forms, labels, the required asterisk, validation messages, buttons, menu item names/prices, cart, checkout, profile, footer body text, modal. `button, input, select, textarea { font-family: inherit }` makes form controls inherit it too, because browsers don't inherit fonts into form controls by default. |

Both packages are imported once, in `src/index.tsx`, before `index.css`:

```ts
import '@fontsource/pacifico/400.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/600.css'
import '@fontsource/roboto/700.css'
```

### Weight mapping

| `font-weight` in the CSS | Where | Roboto face used |
|---|---|---|
| `400` (default) | body text | 400 |
| `500` | `.menu-item-name`, `.shopping-cart-order-item-name`, `.restaurant-name` | 500 |
| `600` | `.login-page-nav-link-text`, `.country-list` (phone input) | **600**: `@fontsource/roboto` 5.x ships a real 600 face, so no mapping is needed |
| `bold` / `700` | `<strong>`, `<b>`, buttons, active nav link, cart bag link | 700 |

### Hungarian glyphs (ő, ű, Ő, Ű)

Each weight file includes a `latin-ext` subset, selected through `unicode-range: U+0100-02BA, …`, which covers U+0150/0151 (Ő/ő) and U+0170/0171 (Ű/ű). Verified two ways:

1. The `cmap` tables of `pacifico-latin-ext-400-normal.woff2` and `roboto-latin-ext-{400,500,600,700}-normal.woff2`, inspected with `fontTools`, contain all four code points.
2. In Chrome, `document.fonts.check()` returns `true` for both families, and the sample text "őű ŐŰ árvíztűrő tükörfúrógép" renders with proper double acute accents in both Pacifico and Roboto. **No glyph is missing.**

## Before the fix

Before Phase 4, no web font was loaded at all (no `@font-face`, no `<link>`), and several declarations were malformed:

| Declaration (before) | Used on | What actually rendered |
|---|---|---|
| `body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', … sans-serif }` | default for the whole app | The operating system's UI font (San Francisco on macOS/iOS, Segoe UI on Windows, Roboto only on Android, where it's the system font) |
| `font-family: 'Roboto, sans-serif'` (whole list in **one** quoted string) | `.form-container`, `.form-required-indicator`, `.menu-item-name`, `.menu-item-price`, `.food-details-price`, `.shopping-cart-order-item-name`, `.shopping-cart-order-item-price`, `.restaurant-name` | The browser looked for a font literally named "Roboto, sans-serif". None exists and there was no valid fallback, so it used its **default font, a serif (Times / Times New Roman)**. This covered every form, the menu cards, the cart and the "ImagineBar" logo text in the nav bar. |
| `font-family: 'Roboto'` (no generic fallback) | `.form-label-strong` | Roboto wasn't loaded, so **Times** |
| `font-family: 'Open Sans'` (no generic fallback) | `.nav-bar-container` (the navigation bar) | Open Sans wasn't loaded, so **Times**, inherited by every nav link and nav button |
| `font-family: 'Roboto', sans-serif` (correct syntax, but not loaded) | `.allergen-name` | The system `sans-serif` (Helvetica / Arial) |
| `font-family: 'Pacifico', cursive` (correct syntax, but not loaded) | page titles, header bar, footer headings, etc. (see table above) | Pacifico wasn't installed on most machines, so the system **`cursive`** font: Apple Chancery on macOS, Comic Sans MS on Windows |
| (none) form controls `<input>`, `<button>` | all form fields and buttons | The browser's form-control default (system UI font) |
