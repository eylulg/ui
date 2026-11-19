/**
 * Regenerates src/styles/themes/scales.ts, the published variant CSS files and
 * all.css from the matrix in src/styles/themes/variants.ts.
 *
 *   npm run themes
 *
 * The themes test fails when these files are out of date.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  allVariantsCss,
  variantFileCss,
  variantNames,
  variantSpecs,
  type Variant,
  type VariantName,
} from '../src/styles/themes/variants';
import { buildAllScales, scalesModule } from './palette';

const themesDir = resolve(import.meta.dirname, '../src/styles/themes');

writeFileSync(resolve(themesDir, 'scales.ts'), scalesModule(variantSpecs));

const scales = buildAllScales(variantSpecs);
const all = Object.fromEntries(
  variantNames.map((name) => [name, { ...variantSpecs[name], colors: scales[name] }]),
) as Record<VariantName, Variant>;
for (const name of variantNames)
  writeFileSync(resolve(themesDir, `${name}.css`), variantFileCss(all[name]));
writeFileSync(resolve(themesDir, 'all.css'), allVariantsCss(all));
console.log(
  `Wrote scales.ts, ${variantNames.length} variant files and all.css to src/styles/themes/`,
);
