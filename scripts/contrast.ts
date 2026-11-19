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
import { converter, interpolate, parse, wcagContrast, type Color } from 'culori';
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

const chartSeries = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'chart-6'];

/** Badge hues beyond brand, success, warning and error. */
const extraHues = ['blue', 'purple', 'pink', 'orange', 'indigo'];

/** Foreground token, the surfaces it must work on, and the minimum ratio. */
export const pairs: Array<{ fg: string; bg: string[]; min: number; modes?: Mode[] }> = [
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
  // Solid buttons: the resting, hover and pressed fills all carry white text.
  {
    fg: 'text-on-solid',
    bg: ['bg-brand-solid', 'bg-brand-solid-hover', 'bg-error-solid', 'bg-error-solid-hover'],
    min: 4.5,
  },
  {
    fg: 'fg-on-solid',
    bg: ['bg-brand-solid', 'bg-brand-solid-hover', 'bg-error-solid', 'bg-error-solid-hover'],
    min: 4.5,
  },
  { fg: 'text-inverse', bg: ['bg-inverse'], min: 4.5 },
  // Non text: icons, control outlines and focus rings need 3:1 (WCAG 1.4.11).
  { fg: 'fg-brand', bg: ['bg-primary', 'bg-elevated'], min: 3 },
  { fg: 'border-control', bg: ['bg-primary', 'bg-elevated'], min: 3 },
  { fg: 'border-focus', bg: ['bg-primary', 'bg-elevated'], min: 3 },
  // Chart marks are non text: every series colour needs 3:1 on every surface a chart can sit on.
  ...[...chartSeries, 'chart-muted'].map((fg) => ({
    fg,
    bg: ['bg-primary', 'bg-secondary', 'bg-elevated'],
    min: 3,
  })),
  // Heat grid cells print their value in one of two inks, chosen by the step.
  {
    fg: 'chart-seq-ink-dark',
    bg: ['chart-seq-1', 'chart-seq-2', 'chart-seq-3'],
    min: 4.5,
    modes: ['light'],
  },
  { fg: 'chart-seq-ink-light', bg: ['chart-seq-4', 'chart-seq-5'], min: 4.5, modes: ['light'] },
  {
    fg: 'chart-seq-ink-light',
    bg: ['chart-seq-1', 'chart-seq-2', 'chart-seq-3'],
    min: 4.5,
    modes: ['dark'],
  },
  { fg: 'chart-seq-ink-dark', bg: ['chart-seq-4', 'chart-seq-5'], min: 4.5, modes: ['dark'] },
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
    for (const { fg, bg, min, modes } of pairs) {
      if (modes && !modes.includes(mode)) continue;
      for (const background of bg) {
        const ratio = Number(wcagContrast(get(fg), get(background)).toFixed(2));
        results.push({ variant, mode, fg, bg: background, ratio, min, pass: ratio >= min });
      }
    }
  }
  return results;
}

export interface SeparationResult {
  mode: Mode;
  a: string;
  b: string;
  normal: number;
  cvd: number;
  pass: boolean;
}

type Vec3 = readonly [number, number, number];
type Matrix3 = readonly [Vec3, Vec3, Vec3];

/** Machado, Oliveira and Fernandes (2009) matrices at severity 1, in linear RGB. */
const deficiencies: readonly Matrix3[] = [
  [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
];

const normalFloor = 15;
const cvdFloor = 8;

function linear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function oklabOf([r, g, b]: Vec3): Vec3 {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function linearRgb(hex: string): Vec3 {
  const color = parse(hex);
  if (!color) throw new Error(`Cannot parse colour "${hex}"`);
  const { r, g, b } = converter('rgb')(color);
  return [linear(r), linear(g), linear(b)];
}

function simulate([r, g, b]: Vec3, matrix: Matrix3): Vec3 {
  const channel = ([x, y, z]: Vec3) => Math.min(1, Math.max(0, x * r + y * g + z * b));
  return [channel(matrix[0]), channel(matrix[1]), channel(matrix[2])];
}

function distance(a: Vec3, b: Vec3): number {
  const [x, y] = [oklabOf(a), oklabOf(b)];
  return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

/**
 * Neighbouring chart series must stay apart: 15 or more in OKLab (times 100)
 * for full colour vision and 8 or more under protanopia and deuteranopia.
 * The palette is the same in every variant, so this runs once per mode.
 */
export function checkSeparation(): SeparationResult[] {
  const results: SeparationResult[] = [];
  for (const mode of ['light', 'dark'] as const) {
    const tokens = { ...semanticBlock('light'), ...(mode === 'dark' ? semanticBlock('dark') : {}) };
    for (let index = 0; index < chartSeries.length - 1; index += 1) {
      const a = chartSeries[index] ?? '';
      const b = chartSeries[index + 1] ?? '';
      const [hexA, hexB] = [tokens[a] ?? '', tokens[b] ?? ''];
      const [rgbA, rgbB] = [linearRgb(hexA), linearRgb(hexB)];
      const normal = Number(distance(rgbA, rgbB).toFixed(1));
      const cvd = Number(
        Math.min(
          ...deficiencies.map((matrix) => distance(simulate(rgbA, matrix), simulate(rgbB, matrix))),
        ).toFixed(1),
      );
      results.push({ mode, a, b, normal, cvd, pass: normal >= normalFloor && cvd >= cvdFloor });
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
  const separation = checkSeparation();
  const weak = separation.filter((result) => !result.pass);
  for (const mode of ['light', 'dark']) {
    const own = separation.filter((result) => result.mode === mode);
    console.log(
      `chart series ${mode}: ${own.filter((r) => r.pass).length}/${own.length} neighbour pairs apart, closest ${Math.min(...own.map((r) => r.normal))} normal, ${Math.min(...own.map((r) => r.cvd))} colour-blind`,
    );
  }
  for (const result of weak) {
    console.error(
      `FAIL ${result.mode}: ${result.a} next to ${result.b} is ${result.normal} apart (${result.cvd} colour-blind), needs ${normalFloor} and ${cvdFloor}`,
    );
  }
  process.exit(failures.length || weak.length ? 1 : 0);
}
