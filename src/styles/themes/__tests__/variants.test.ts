import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse, type Oklch } from 'culori';
import { describe, expect, it } from 'vitest';
import pkg from '../../../../package.json';
import { checkVariant } from '../../../../scripts/contrast';
import { brandLightness, grayLightness, scalesModule } from '../../../../scripts/palette';
import {
  scaleSteps,
  variantFileCss,
  variantNames,
  variantSpecs,
  variants,
  type VariantName,
} from '../variants';

const dir = resolve(import.meta.dirname, '..');

describe('theme variants', () => {
  it.each(['base', ...variantNames] as const)('%s meets WCAG AA in light and dark', (name) => {
    const failures = checkVariant(name as VariantName | 'base').filter((result) => !result.pass);
    expect(failures.map((f) => `${f.mode} ${f.fg} on ${f.bg}: ${f.ratio}:1 < ${f.min}:1`)).toEqual(
      [],
    );
  });

  it('uses the same lightness per step in every variant, so contrast matches', () => {
    for (const name of variantNames) {
      for (const step of scaleSteps) {
        const brand = parse(variants[name].colors.brand[step]) as Oklch;
        const gray = parse(variants[name].colors.gray[step]) as Oklch;
        expect(brand.l).toBeCloseTo(brandLightness[step], 3);
        expect(gray.l).toBeCloseTo(grayLightness[step], 3);
      }
    }
  });

  it('keeps the generated scales and CSS files in sync with the matrix', () => {
    expect(readFileSync(resolve(dir, 'scales.ts'), 'utf8')).toBe(scalesModule(variantSpecs));
    for (const name of variantNames) {
      const file = readFileSync(resolve(dir, `${name}.css`), 'utf8');
      expect(file, `${name}.css is stale, run npm run themes`).toBe(variantFileCss(variants[name]));
    }
  });

  it('only overrides primitives, shape, density and fonts (plus dark surfaces)', () => {
    for (const name of variantNames) {
      const css = readFileSync(resolve(dir, `${name}.css`), 'utf8');
      const declared = [...css.matchAll(/^\s+(--[\w-]+):/gm)].map((match) => match[1]!);
      for (const variable of declared) {
        expect(variable).toMatch(
          /^--(color-(brand|gray)-\d+|radius-[\w]+|density-[\w-]+|font-(display|mono)|ui-font-data|ui-bg-(primary|secondary|elevated))$/,
        );
      }
    }
  });

  it('publishes every variant file', () => {
    const exports = pkg.exports as Record<string, unknown>;
    expect(exports['./themes/*.css']).toBe('./dist/themes/*.css');
    expect(exports['./themes']).toBeDefined();
  });
});
