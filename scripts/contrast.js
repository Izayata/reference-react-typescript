#!/usr/bin/env node
// WCAG 2.x contrast ratios for the colour pairs used in the app.
// Usage: node scripts/contrast.js
// Generates the table in docs/thesis-contrast-report.md.
//
// Relative luminance (WCAG 2.x): each sRGB channel c = value / 255 is linearised as
//   c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4
// L = 0.2126 R + 0.7152 G + 0.0722 B
// Contrast ratio = (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter colour.
// Colours with an alpha channel (#rrggbbaa) are alpha-composited over the background first.

function parse(hex) {
  let h = hex.replace('#', '')
  if (h.length === 3 || h.length === 4) h = h.split('').map(c => c + c).join('')
  const n = [0, 2, 4, 6].slice(0, h.length / 2).map(i => parseInt(h.slice(i, i + 2), 16))
  return { r: n[0], g: n[1], b: n[2], a: n.length === 4 ? n[3] / 255 : 1 }
}

function composite(fg, bg) {
  const a = fg.a
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 }
}

function luminance({ r, g, b }) {
  const lin = v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function ratio(fgHex, bgHex) {
  const bg = parse(bgHex)
  const fg = composite(parse(fgHex), bg)
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

// size: 'normal' | 'large' (>= 24px, or >= 18.66px bold) | 'non-text' (SC 1.4.11, needs 3:1)
//       | 'decorative' (purely decorative lines are exempt from SC 1.4.11)
// Pass/fail uses the unrounded ratio (WCAG: no rounding up); the table shows it rounded to 2 decimals.
function verdict(r, size) {
  if (size === 'decorative') return { aa: 'n/a', aaa: 'n/a' }
  if (size === 'non-text') return { aa: r >= 3 ? 'Pass' : 'Fail', aaa: 'n/a' }
  const [aa, aaa] = size === 'large' ? [3, 4.5] : [4.5, 7]
  return { aa: r >= aa ? 'Pass' : 'Fail', aaa: r >= aaa ? 'Pass' : 'Fail' }
}

const pairs = [
  // [element, fg, bg, size, expected]
  ['Text on cards / nav bar / forms (body text, labels, nav links, error messages)', '#000', '#8c7851', 'normal', 4.92],
  ['Page titles (Pacifico, 2.6rem)', '#000', '#eaddcf', 'large', 15.74],
  ['Top bar (header) text', '#fffff5', '#61574b', 'normal', 7.02],
  ['Active nav item / button hover / nav hover', '#d8ba7e', '#1f0800', 'normal', 10.29],
  ['Input text', '#f5f5f5', '#2b2b2b', 'normal', 12.99],
  ['Input field boundary vs form background (SC 1.4.11)', '#2b2b2b', '#8c7851', 'non-text', 3.32],
  ['Button border vs card (SC 1.4.11)', '#000', '#8c7851', 'non-text', 4.92],
  ['Required asterisk — before', '#fffff5', '#8c7851', 'normal', 4.24],
  ['Required asterisk — after', '#000', '#8c7851', 'normal', 4.92],
  ['Footer text (#fffff5 at 80% alpha)', '#fffff5cc', '#61574b', 'normal', null],
  ['Allergen card text, dark cards (#f5f5f5 at 89% alpha)', '#f5f5f5e3', '#61574b', 'normal', null],
  ['Allergen card text, light cards', '#000', '#8c7851', 'normal', null],
  ['Login page links ("forgot password"/"register", 600 weight 1rem)', '#ffd0d7', '#8c7851', 'normal', null],
  ['Login page link hover', '#ffd0d7', '#1f0800', 'normal', null],
  ['Phone input: highlighted country in dropdown', '#ffd0d7', '#1f0800', 'normal', null],
  ['Phone input: dial code in country list', '#f5f5f5', '#8c7851', 'normal', null],
  ['Modal message text', '#FF944D', '#1c1c1c', 'normal', null],
  ['Modal OK button text', '#FF944D', '#1c1c1c', 'normal', null],
  ['Shopping-cart delete icon, hover state only (non-text)', '#ffcbcb', '#8c7851', 'non-text', null],
  ['Section divider (#000) vs card (decorative)', '#000', '#8c7851', 'decorative', null],
  ['Content separator (#695A3D) vs card (decorative)', '#695A3D', '#8c7851', 'decorative', null],
]

console.log('| Element | Foreground | Background | Ratio | Size category | AA | AAA | Expected |')
console.log('|---|---|---|---|---|---|---|---|')
for (const [el, fg, bg, size, expected] of pairs) {
  const r = ratio(fg, bg)
  const { aa, aaa } = verdict(r, size)
  const shown = Math.round(r * 100) / 100
  const exp = expected == null ? '—' : (Math.abs(shown - expected) < 0.015 ? `${expected} ✓` : `${expected} ✗ MISMATCH`)
  console.log(`| ${el} | \`${fg}\` | \`${bg}\` | ${shown.toFixed(2)}:1 | ${size} | ${aa} | ${aaa} | ${exp} |`)
}
