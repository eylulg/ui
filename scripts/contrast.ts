/**
 * WCAG contrast check for the base theme and every variant, in light and dark.
 * Dev only: uses culori.
 *
 * Semantic token mappings are read from src/styles/theme.css, primitive scales
 * from theme.css (base) and from the variant matrix, so the check follows any
 * change to either. Runs in the test suite (src/styles/themes/themes.test.ts)
 * and on its own with `npm run contrast`.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { interpolate, parse, wcagContrast, type Color } from 'culori';
import { variantNames, variants, type VariantName } from '../src/styles/themes/variants';

export type Mode = 'light' | 'dark';

export interface ContrastResult {
  variant: VariantName | 'base';
  mode: Mode;
  fg: string;
  bg: string;
  ratio: number;
  min: number;
  pass: boolean;
}

/** Badge hues beyond brand, success, warning and error. */
const extraHues = ['blue', 'purple', 'pink', 'orange', 'indigo'];

/** Foreground token, the surfaces it must work on, and the minimum ratio. */
export const pairs: Array<{ fg: string; bg: string[]; min: number }> = [
  {
    fg: 'text-primary',
    bg: ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-elevated'],
    min: 4.5,
  },
  {
    fg: 'text-secondary',
    bg: ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-elevated'],
    min: 4.5,
  },
  {
    fg: 'text-tertiary',
    bg: ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-elevated'],
    min: 4.5,
  },
  { fg: 'text-placeholder', bg: ['bg-primary'], min: 4.5 },
  {
    fg: 'text-brand',
    bg: ['bg-primary', 'bg-secondary', 'bg-elevated', 'bg-brand-subtle'],
    min: 4.5,
  },
  { fg: 'text-error', bg: ['bg-primary', 'bg-elevated', 'bg-error-subtle'], min: 4.5 },
  { fg: 'text-success', bg: ['bg-primary', 'bg-elevated', 'bg-success-subtle'], min: 4.5 },
  { fg: 'text-warning', bg: ['bg-primary', 'bg-elevated', 'bg-warning-subtle'], min: 4.5 },
  ...extraHues.flatMap((hue) => [
    {
      fg: `text-${hue}`,
      bg: ['bg-primary', 'bg-elevated', `bg-${hue}-subtle`],
      min: 4.5,
    },
    { fg: `fg-${hue}`, bg: ['bg-primary', 'bg-elevated'], min: 3 },
  ]),
  { fg: 'text-on-solid', bg: ['bg-brand-solid', 'bg-error-solid'], min: 4.5 },
  { fg: 'text-inverse', bg: ['bg-inverse'], min: 4.5 },
  // Non text: icons, control outlines and focus rings need 3:1 (WCAG 1.4.11).
  { fg: 'fg-brand', bg: ['bg-primary', 'bg-elevated'], min: 3 },
  { fg: 'border-control', bg: ['bg-primary', 'bg-elevated'], min: 3 },
  { fg: 'border-focus', bg: ['bg-primary', 'bg-elevated'], min: 3 },
];

const themeCss = readFileSync(resolve(import.meta.dirname, '../src/styles/theme.css'), 'utf8');

function baseScales(): Record<string, string> {
  const out: Record<string, string> = { white: '#ffffff', black: '#000000' };
  for (const match of themeCss.matchAll(/--color-([a-z]+-\d+):\s*(#[0-9a-f]{3,8});/gi)) {
    const [, name = '', value = ''] = match;
    out[name] = value;
  }
  return out;
}

function semanticBlock(mode: Mode): Record<string, string> {
  const marker = `color-scheme: ${mode};`;
  const start = themeCss.indexOf(marker);
  if (start === -1) throw new Error(`No ${mode} block in theme.css`);
  const block = themeCss.slice(start, themeCss.indexOf('\n  }', start));
  const out: Record<string, string> = {};
  for (const [, name = '', value = ''] of block.matchAll(/--ui-([\w-]+):\s*([^;]+);/g)) {
    out[name] = value.trim();
  }
  return out;
}

function palette(variant: VariantName | 'base'): Record<string, string> {
  const colors = baseScales();
  if (variant === 'base') return colors;
  const { brand, gray, warning } = variants[variant].colors;
  for (const [step, value] of Object.entries(brand)) colors[`brand-${step}`] = value;
  for (const [step, value] of Object.entries(gray)) colors[`gray-${step}`] = value;
  for (const [step, value] of Object.entries(warning ?? {})) colors[`warning-${step}`] = value;
  return colors;
}

function resolveValue(value: string, colors: Record<string, string>, backdrop?: Color): Color {
  const ref = /^var\(--color-([a-z]+(?:-\d+)?)\)$/.exec(value);
  if (ref) return resolveValue(colors[ref[1] ?? ''] ?? '', colors);
  const mix =
    /^color-mix\(in oklab, (?:var\(--color-([a-z]+-\d+)\)|(#[0-9a-f]{6})) (\d+)%, transparent\)$/i.exec(
      value,
    );
  if (mix) {
    if (!backdrop) throw new Error(`A translucent token needs a backdrop: ${value}`);
    const top = mix[2]
      ? resolveValue(mix[2], colors)
      : resolveValue(colors[mix[1] ?? ''] ?? '', colors);
    return interpolate([backdrop, top], 'oklab')(Number(mix[3]) / 100);
  }
  const color = parse(value);
  if (!color) throw new Error(`Cannot parse colour "${value}"`);
  if (color.alpha !== undefined && color.alpha < 1) {
    if (!backdrop) throw new Error(`A translucent token needs a backdrop: ${value}`);
    return interpolate([backdrop, { ...color, alpha: 1 }], 'rgb')(color.alpha);
  }
  return color;
}

export function checkVariant(variant: VariantName | 'base'): ContrastResult[] {
  const colors = palette(variant);
  const results: ContrastResult[] = [];
  for (const mode of ['light', 'dark'] as const) {
    const tokens = { ...semanticBlock('light'), ...(mode === 'dark' ? semanticBlock('dark') : {}) };
    if (mode === 'dark' && variant !== 'base') {
      for (const [token, value] of Object.entries(variants[variant].dark ?? {}))
        tokens[token] = value;
    }
    const surface = resolveValue(tokens['bg-primary'] ?? '', colors);
    const get = (token: string) => {
      const value = tokens[token];
      if (!value) throw new Error(`Unknown token ${token}`);
      return resolveValue(value, colors, surface);
    };
    for (const { fg, bg, min } of pairs) {
      for (const background of bg) {
        const ratio = Number(wcagContrast(get(fg), get(background)).toFixed(2));
        results.push({ variant, mode, fg, bg: background, ratio, min, pass: ratio >= min });
      }
    }
  }
  return results;
}

export function checkAll(): ContrastResult[] {
  return (['base', ...variantNames] as const).flatMap((variant) => checkVariant(variant));
}

if (process.argv[1]?.endsWith('contrast.ts')) {
  const results = checkAll();
  const failures = results.filter((result) => !result.pass);
  for (const variant of ['base', ...variantNames]) {
    const own = results.filter((result) => result.variant === variant);
    const lowest = own.reduce((a, b) => (a.ratio / a.min < b.ratio / b.min ? a : b));
    console.log(
      `${variant.padEnd(15)} ${own.filter((r) => r.pass).length}/${own.length} pass, tightest ${lowest.fg} on ${lowest.bg} (${lowest.mode}) ${lowest.ratio}:1`,
    );
  }
  for (const failure of failures) {
    console.error(
      `FAIL ${failure.variant} ${failure.mode}: ${failure.fg} on ${failure.bg} ${failure.ratio}:1 < ${failure.min}:1`,
    );
  }
  process.exit(failures.length ? 1 : 0);
}
