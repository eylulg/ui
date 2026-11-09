/**
 * Regenerates src/styles/themes/scales.ts and the published variant CSS files
 * from the matrix in src/styles/themes/variants.ts.
 *
 *   npm run themes
 *
 * The themes test fails when these files are out of date.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { variantFileCss, variantNames, variantSpecs } from '../src/styles/themes/variants';
import { buildAllScales, scalesModule } from './palette';

const themesDir = resolve(import.meta.dirname, '../src/styles/themes');

writeFileSync(resolve(themesDir, 'scales.ts'), scalesModule(variantSpecs));

const scales = buildAllScales(variantSpecs);
for (const name of variantNames) {
  const css = variantFileCss({ ...variantSpecs[name], colors: scales[name] });
  writeFileSync(resolve(themesDir, `${name}.css`), css);
}
console.log(`Wrote scales.ts and ${variantNames.length} variant files to src/styles/themes/`);
