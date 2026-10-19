# Contrast report (thesis, Phase 4)

WCAG 2.x contrast ratios for every text colour in the app's CSS, measured against the background it actually sits on. Hex values are copied exactly from the stylesheets.

## Method

Computed by [`scripts/contrast.js`](../scripts/contrast.js), which has no dependencies. Reproduce with:

```bash
node scripts/contrast.js
```

Formula (WCAG 2.x relative luminance):

- each sRGB channel `c = value / 255` is linearised: `c ≤ 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055)^2.4`
- `L = 0.2126·R + 0.7152·G + 0.0722·B`
- `ratio = (L1 + 0.05) / (L2 + 0.05)`, where `L1` is the lighter colour
- colours with an alpha channel (`#rrggbbaa`) are first alpha-composited over their background
- pass/fail is decided on the unrounded ratio (WCAG does not allow rounding up). The table shows ratios rounded to 2 decimals.

Thresholds: SC 1.4.3 (AA) needs 4.5:1 for normal text and 3:1 for large text (≥ 24 px, or ≥ 18.66 px bold). SC 1.4.6 (AAA) needs 7:1 / 4.5:1. SC 1.4.11 (non-text: UI component boundaries, icons) needs 3:1. Purely decorative lines are exempt.

The **Expected** column holds the values given in the task brief. ✓ means the computed value matches.

## Results

| Element | Foreground | Background | Ratio | Size category | AA | AAA | Expected |
|---|---|---|---|---|---|---|---|
| Text on cards / nav bar / forms (body text, labels, nav links, error messages) | `#000` | `#8c7851` | 4.92:1 | normal | Pass | Fail | 4.92 ✓ |
| Page titles (Pacifico, 2.6rem) | `#000` | `#eaddcf` | 15.74:1 | large | Pass | Pass | 15.74 ✓ |
| Top bar (header) text | `#fffff5` | `#61574b` | 7.02:1 | normal | Pass | Pass | 7.02 ✓ |
| Active nav item / button hover / nav hover | `#d8ba7e` | `#1f0800` | 10.29:1 | normal | Pass | Pass | 10.29 ✓ |
| Input text | `#f5f5f5` | `#2b2b2b` | 12.99:1 | normal | Pass | Pass | 12.99 ✓ |
| Input field boundary vs form background (SC 1.4.11) | `#2b2b2b` | `#8c7851` | 3.32:1 | non-text | Pass | n/a | 3.32 ✓ |
| Button border vs card (SC 1.4.11) | `#000` | `#8c7851` | 4.92:1 | non-text | Pass | n/a | 4.92 ✓ |
| Required asterisk — before | `#fffff5` | `#8c7851` | 4.24:1 | normal | Fail | Fail | 4.24 ✓ |
| Required asterisk — after | `#000` | `#8c7851` | 4.92:1 | normal | Pass | Fail | 4.92 ✓ |
| Footer text (#fffff5 at 80% alpha) | `#fffff5cc` | `#61574b` | 5.21:1 | normal | Pass | Fail | — |
| Allergen card text, dark cards (#f5f5f5 at 89% alpha) | `#f5f5f5e3` | `#61574b` | 5.54:1 | normal | Pass | Fail | — |
| Allergen card text, light cards | `#000` | `#8c7851` | 4.92:1 | normal | Pass | Fail | — |
| Login page links ("forgot password"/"register", 600 weight 1rem) | `#ffd0d7` | `#8c7851` | 3.10:1 | normal | Fail | Fail | — |
| Login page link hover | `#ffd0d7` | `#1f0800` | 13.96:1 | normal | Pass | Pass | — |
| Phone input: highlighted country in dropdown | `#ffd0d7` | `#1f0800` | 13.96:1 | normal | Pass | Pass | — |
| Phone input: dial code in country list | `#f5f5f5` | `#8c7851` | 3.91:1 | normal | Fail | Fail | — |
| Modal message text | `#FF944D` | `#1c1c1c` | 7.79:1 | normal | Pass | Pass | — |
| Modal OK button text | `#FF944D` | `#1c1c1c` | 7.79:1 | normal | Pass | Pass | — |
| Shopping-cart delete icon, hover state only (non-text) | `#ffcbcb` | `#8c7851` | 2.98:1 | non-text | Fail | n/a | — |
| Section divider (#000) vs card (decorative) | `#000` | `#8c7851` | 4.92:1 | decorative | n/a | n/a | — |
| Content separator (#695A3D) vs card (decorative) | `#695A3D` | `#8c7851` | 1.57:1 | decorative | n/a | n/a | — |

## Notes

- **Required asterisk:** fixed in this phase. It changed from `#fffff5` (4.24:1, fails AA) to `#000` (4.92:1, passes AA). Its `aria` behaviour is unchanged.
- **Validation/error messages** (`.error-message`) have no colour of their own. They inherit `#000` and sit on the form background `#8c7851`, so 4.92:1 (AA pass). This is the first row.
- **Still failing AA. These are out of scope for Phase 4, which changes only the asterisk colour, so they're not fixed:**
  - Login page links `#ffd0d7` on `#8c7851` (3.10:1, 1rem / weight 600, so normal-size text).
  - Phone input dial codes in the country dropdown `#f5f5f5` on `#8c7851` (3.91:1). `PhoneNumberInput.css` is deliberately left untouched.
  - Shopping-cart delete icon in its **hover state only**, `#ffcbcb` on `#8c7851` (2.98:1, non-text). In its default state it's black (4.92:1).
- Content separators `#695A3D` (1.57:1) and section dividers `#000` are decorative, so SC 1.4.11 doesn't apply. Headings and spacing carry the structure, not the lines.
