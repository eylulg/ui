import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { tokensCss } from '../../../scripts/build-tokens';
import { variantFileCss, variantNames, variants } from '../themes/variants';

const themeCss = readFileSync(resolve(import.meta.dirname, '../theme.css'), 'utf8');
const tokens = tokensCss(themeCss);

function declared(css: string): Set<string> {
  return new Set([...css.matchAll(/^\s*(--[\w-]+):/gm)].map(([, name = '']) => name));
}

function unresolved(css: string): string[] {
  const known = declared(css);
  const used = [...css.matchAll(/var\((--[\w-]+)\)/g)].map(([, name = '']) => name);
  return [...new Set(used)].filter((name) => !known.has(name));
}

describe('plain tokens', () => {
  it('holds custom properties only, with no at-rules or component styles', () => {
    const body = tokens.replace(/\/\*[\s\S]*?\*\//g, '');

    const selectors = [...body.matchAll(/^([^\s{}][^{}]*)\{/gm)].map(([, selector = '']) =>
      selector.replace(/\s+/g, ' ').trim(),
    );
    const declarations = [...body.matchAll(/^\s+([\w-]+):/gm)].map(([, name = '']) => name);

    expect(body).not.toContain('@');
    expect(selectors.join(' ')).not.toMatch(/(^|[ ,])[a-z*]/);
    expect(
      declarations.filter((name) => !name.startsWith('--') && name !== 'color-scheme'),
    ).toEqual([]);
  });

  it('defines every semantic token and font token of the Tailwind theme', () => {
    const semantic = [...themeCss.matchAll(/^\s+(--ui-[\w-]+):/gm)].map(([, name = '']) => name);

    expect([...declared(tokens)]).toEqual(
      expect.arrayContaining([
        ...semantic,
        '--font-sans',
        '--font-display',
        '--font-mono',
        '--font-body',
      ]),
    );
  });

  it.each(['base', ...variantNames] as const)(
    'resolves every variable with the %s variant on top',
    (name) => {
      const css = name === 'base' ? tokens : `${tokens}\n${variantFileCss(variants[name])}`;

      expect(unresolved(css)).toEqual([]);
    },
  );
});
