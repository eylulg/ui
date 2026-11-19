import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse, type Oklch } from 'culori';
import { describe, expect, it } from 'vitest';
import pkg from '../../../../package.json';
import { checkSeparation, checkVariant } from '../../../../scripts/contrast';
import { brandLightness, scalesModule } from '../../../../scripts/palette';
import {
  allVariantsCss,
  scaleSteps,
  variantFileCss,
  variantNames,
  variantSpecs,
  variants,
  type VariantName,
} from '../variants';

const dir = resolve(import.meta.dirname, '..');
const themeCss = readFileSync(resolve(dir, '../theme.css'), 'utf8');

describe('theme variants', () => {
  it.each(['base', ...variantNames] as const)('%s meets WCAG AA in light and dark', (name) => {
    const failures = checkVariant(name as VariantName | 'base').filter((result) => !result.pass);
    expect(failures.map((f) => `${f.mode} ${f.fg} on ${f.bg}: ${f.ratio}:1 < ${f.min}:1`)).toEqual(
      [],
    );
  });

  it('keeps every pair of chart series apart in light and dark', () => {
    const weak = checkSeparation().filter((result) => !result.pass);
    expect(weak.map((r) => `${r.mode} ${r.a} and ${r.b}: ${r.normal} / ${r.cvd}`)).toEqual([]);
  });

  it('uses the same lightness per brand step in every variant, so contrast matches', () => {
    for (const name of variantNames) {
      for (const step of scaleSteps) {
        const brand = parse(variants[name].colors.brand[step]) as Oklch;
        expect(brand.l).toBeCloseTo(brandLightness[step], 3);
      }
    }
  });

  it('keeps the generated scales and CSS files in sync with the matrix', () => {
    expect(readFileSync(resolve(dir, 'scales.ts'), 'utf8')).toBe(scalesModule(variantSpecs));
    for (const name of variantNames) {
      const file = readFileSync(resolve(dir, `${name}.css`), 'utf8');
      expect(file, `${name}.css is stale, run npm run themes`).toBe(variantFileCss(variants[name]));
    }
    expect(readFileSync(resolve(dir, 'all.css'), 'utf8')).toBe(allVariantsCss(variants));
  });

  it('gives the base theme the portfolio colour, green', () => {
    const { seed, colors } = variants.portfolio;

    expect(themeCss).toContain(`--color-brand-seed: ${seed.light};`);
    expect(themeCss).toContain(`--color-brand-seed-dark: ${seed.dark};`);
    for (const step of scaleSteps) {
      expect(themeCss).toContain(`--color-brand-${step}: ${colors.brand[step]};`);
    }
  });

  it('only sets the seed and the brand scale', () => {
    for (const name of variantNames) {
      const css = readFileSync(resolve(dir, `${name}.css`), 'utf8');
      const declared = [...css.matchAll(/^\s+(--[\w-]+):/gm)].map((match) => match[1]!);
      for (const variable of declared) {
        expect(variable).toMatch(/^--color-brand-(\d+|seed|seed-dark)$/);
      }
    }
  });

  it('publishes every variant file', () => {
    const exports = pkg.exports as Record<string, unknown>;
    expect(exports['./themes/*.css']).toBe('./dist/themes/*.css');
    expect(exports['./themes']).toBeDefined();
  });
});
