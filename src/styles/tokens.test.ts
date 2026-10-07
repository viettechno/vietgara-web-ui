import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Design System 3.2.1: every text / surface pair must reach 4.5 : 1 and every
// control boundary and focus indicator 3 : 1, in both themes. The build fails
// if a token edit breaks one.
const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector)
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('\n}', start))
  return Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2].toLowerCase()]))
}

function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2)
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const light = block(':root')
const dark = { ...light, ...block("[data-theme='dark']") }

const TEXT_PAIRS: Array<[string, string]> = [
  ['foreground', 'background'],
  ['foreground', 'surface'],
  ['surface-foreground', 'surface'],
  ['popover-foreground', 'popover'],
  ['muted-foreground', 'surface'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'muted'],
  ['primary-foreground', 'primary'],
  ['primary-subtle-foreground', 'primary-subtle'],
  ['secondary-foreground', 'secondary'],
  ['destructive-foreground', 'destructive'],
  ['destructive-subtle-foreground', 'destructive-subtle'],
  ['success-foreground', 'success'],
  ['success-subtle-foreground', 'success-subtle'],
  ['warning-foreground', 'warning'],
  ['warning-subtle-foreground', 'warning-subtle'],
  ['info-foreground', 'info'],
  ['info-subtle-foreground', 'info-subtle'],
  ['sidebar-foreground', 'sidebar'],
  ['sidebar-active-foreground', 'sidebar-active'],
  ['plate-foreground', 'plate'],
]

const BOUNDARY_PAIRS: Array<[string, string]> = [
  ['input', 'surface'],
  ['ring', 'background'],
  ['ring', 'surface'],
]

describe.each([
  ['light', light],
  ['dark', dark],
])('%s theme contrast', (_name, tokens) => {
  it.each(TEXT_PAIRS)('%s on %s reaches 4.5:1', (fg, bg) => {
    expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(4.5)
  })
  it.each(BOUNDARY_PAIRS)('%s against %s reaches 3:1', (fg, bg) => {
    expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(3)
  })
})
