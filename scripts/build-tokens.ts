/**
 * Builds dist/tokens.css (@eylulg/ui/tokens.css) from src/styles/theme.css:
 * only custom properties, for apps that do not run Tailwind. No preflight, no
 * component styles, no at-rules. Because it is derived from theme.css it
 * cannot drift from the Tailwind path.
 *
 *   npm run build:css
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const header = `/*
 * @eylulg/ui plain tokens, for apps that do not run Tailwind.
 *
 * Custom properties only: the colour scales, the semantic --ui-* set for light
 * (:root) and dark (.dark-mode or .dark), fonts, the type scale, radii, shadows and density.
 * No preflight and no component styles. Import it before a variant file:
 *
 *   @import '@eylulg/ui/tokens.css';
 *   @import '@eylulg/ui/themes/workspace.css';
 *
 * Generated from theme.css by scripts/build-tokens.ts; do not edit by hand.
 */
`;

/** Returns the text between the braces of the block that starts at `open`. */
function blockBody(css: string, open: number): string {
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    if (css[index] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(css.indexOf('{', open) + 1, index);
    }
  }
  throw new Error('Unbalanced braces in theme.css');
}

function dedent(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/^ {2}/, ''))
    .join('\n')
    .trim();
}

export function tokensCss(themeCss: string): string {
  const themeStart = themeCss.indexOf('@theme {');
  const baseStart = themeCss.indexOf('@layer base {');
  if (themeStart === -1 || baseStart === -1)
    throw new Error('theme.css has no @theme or @layer base');

  const primitives = [
    ...blockBody(themeCss, themeStart).matchAll(
      /^\s*(--(?:font|radius|shadow|color|leading|tracking|text-(?!color-))[\w-]+):\s*([^;]+);/gm,
    ),
  ].map(([, name = '', value = '']) => `  ${name}: ${value.replace(/\s+/g, ' ').trim()};`);

  const root = [
    ':root {',
    '  --color-white: #fff;',
    '  --color-black: #000;',
    ...primitives,
    '  --font-body: var(--font-sans);',
    '}',
  ].join('\n');

  return `${header}\n${root}\n\n${dedent(blockBody(themeCss, baseStart))}\n`;
}

if (process.argv[1]?.endsWith('build-tokens.ts')) {
  const root = resolve(import.meta.dirname, '..');
  const css = tokensCss(readFileSync(resolve(root, 'src/styles/theme.css'), 'utf8'));
  mkdirSync(resolve(root, 'dist'), { recursive: true });
  writeFileSync(resolve(root, 'dist/tokens.css'), css);
  console.log(`Wrote dist/tokens.css (${css.length} bytes)`);
}
