/**
 * The theme variant matrix for Eylül Güneş's projects.
 *
 * Every variant shares the base theme (@eylulg/ui/theme.css): the warm page
 * frame, the shape, the status colours and the semantic tokens. A variant sets
 * four things only:
 *
 * - colour: one seed per project, with a light solid and a dark solid
 * - font pairing: the heading font next to Inter
 * - text size: the default size of the type scale, compact or default
 * - density: control heights and paddings
 *
 * The brand scale of each variant is generated from its seed by `npm run themes`
 * (scripts/generate-themes.ts) with fixed oklch lightness steps, so a given step
 * has the same contrast in every variant. The generated values live in
 * ./scales.ts and in the published CSS files at @eylulg/ui/themes/<name>.css.
 */
import { scales } from './scales';

export const variantNames = [
  'portfolio',
  'workspace',
  'review',
  'control-room',
  'watchlist',
  'tokens',
  'plain-language',
  'sudoku',
  'assistant',
] as const;

export type VariantName = (typeof variantNames)[number];

export type Pairing = 'friendly' | 'product' | 'technical' | 'editorial';
export type TextSize = 'compact' | 'default';
export type Density = 'compact' | 'comfortable';

/** The steps of every generated colour scale. */
export const scaleSteps = [
  '25',
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

export type ScaleStep = (typeof scaleSteps)[number];
export type ColorScale = Record<ScaleStep, string>;

export interface Seed {
  /** Name of the colour, such as "Clay". */
  name: string;
  /** Solid fill in light mode. Carries white text at 4.5:1 or better. */
  light: string;
  /** Solid fill in dark mode. Reads on the dark page at 4.5:1 or better. */
  dark: string;
}

export interface VariantSpec {
  name: VariantName;
  /** The project this variant is designed for, in Title Case. */
  project: string;
  description: string;
  seed: Seed;
  pairing: Pairing;
  textSize: TextSize;
  density: Density;
}

export interface VariantColors {
  brand: ColorScale;
}

export interface Variant extends VariantSpec {
  colors: VariantColors;
}

const sans =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const inter = `var(--font-inter, 'Inter'), ${sans}`;

/**
 * Inter is the reading font in every pairing; the heading font changes. The
 * `--font-*` names are set by @eylulg/ui/fonts.css; without it each stack names
 * an installed copy of the font and then falls back to the system font.
 */
export const pairings: Record<
  Pairing,
  { label: string; heading: string; display: string; data: 'sans' | 'mono' }
> = {
  friendly: {
    label: 'Friendly',
    heading: 'Manrope',
    display: `var(--font-manrope, 'Manrope'), ${sans}`,
    data: 'sans',
  },
  product: {
    label: 'Product',
    heading: 'Inter Tight',
    display: `var(--font-inter-tight, 'Inter Tight'), ${inter}`,
    data: 'sans',
  },
  technical: {
    label: 'Technical',
    heading: 'Inter, with JetBrains Mono for code and data',
    display: inter,
    data: 'mono',
  },
  editorial: {
    label: 'Editorial',
    heading: 'Newsreader, for titles only',
    display: `var(--font-newsreader, 'Newsreader'), ui-serif, Georgia, 'Times New Roman', serif`,
    data: 'sans',
  },
};

export const variantSpecs: Record<VariantName, VariantSpec> = {
  portfolio: {
    name: 'portfolio',
    project: 'Portfolio',
    description: 'Personal site and case studies. Clay is the brand, shared with the logo.',
    seed: { name: 'Clay', light: '#b8583e', dark: '#e8a58c' },
    pairing: 'friendly',
    textSize: 'default',
    density: 'comfortable',
  },
  workspace: {
    name: 'workspace',
    project: 'Workspace',
    description: 'An issue tracker. Slate blue, the usual colour of productivity tools.',
    seed: { name: 'Slate blue', light: '#3f6fb6', dark: '#8cb2eb' },
    pairing: 'product',
    textSize: 'compact',
    density: 'compact',
  },
  review: {
    name: 'review',
    project: 'Review Companion',
    description: 'A code review tool. Eucalyptus suggests approved; monospace for data.',
    seed: { name: 'Eucalyptus', light: '#177360', dark: '#8ad0bc' },
    pairing: 'technical',
    textSize: 'compact',
    density: 'comfortable',
  },
  'control-room': {
    name: 'control-room',
    project: 'Agent Workflows',
    description: 'Watching and steering agents. A deep ink, like a control room at night.',
    seed: { name: 'Ink', light: '#293647', dark: '#c4d2e5' },
    pairing: 'product',
    textSize: 'compact',
    density: 'compact',
  },
  watchlist: {
    name: 'watchlist',
    project: 'Watchlist',
    description: 'A film watchlist. Rose like cinema velvet, a serif for titles.',
    seed: { name: 'Rose', light: '#af5275', dark: '#ed99b6' },
    pairing: 'editorial',
    textSize: 'default',
    density: 'comfortable',
  },
  tokens: {
    name: 'tokens',
    project: 'Tokens to Tailwind',
    description: 'A design token converter. Iris, the violet of design tools.',
    seed: { name: 'Iris', light: '#7766b6', dark: '#b8aded' },
    pairing: 'product',
    textSize: 'default',
    density: 'comfortable',
  },
  'plain-language': {
    name: 'plain-language',
    project: 'Plain Language Add-in',
    description: 'A narrow Word task pane. Sea glass, the cyan-blue of Word.',
    seed: { name: 'Sea glass', light: '#2d7787', dark: '#81b6c3' },
    pairing: 'friendly',
    textSize: 'default',
    density: 'compact',
  },
  sudoku: {
    name: 'sudoku',
    project: 'Sudoku',
    description: 'A puzzle game. A calm sage green.',
    seed: { name: 'Sage', light: '#446c2b', dark: '#97bf82' },
    pairing: 'friendly',
    textSize: 'default',
    density: 'comfortable',
  },
  assistant: {
    name: 'assistant',
    project: 'Assistant Studio',
    description: 'A research assistant. Magenta softened to plum.',
    seed: { name: 'Plum', light: '#824d85', dark: '#deb0e0' },
    pairing: 'friendly',
    textSize: 'default',
    density: 'comfortable',
  },
};

export const variants: Record<VariantName, Variant> = Object.fromEntries(
  variantNames.map((name) => [name, { ...variantSpecs[name], colors: scales[name] }]),
) as Record<VariantName, Variant>;

export type DensityToken =
  | 'control-xs'
  | 'control-sm'
  | 'control-md'
  | 'control-lg'
  | 'control-x'
  | 'item-x'
  | 'item-y'
  | 'cell-x'
  | 'cell-y'
  | 'card'
  | 'stack';

export const densities: Record<Density, Record<DensityToken, string>> = {
  comfortable: {
    'control-xs': '1.5rem',
    'control-sm': '2rem',
    'control-md': '2.5rem',
    'control-lg': '3rem',
    'control-x': '1rem',
    'item-x': '0.625rem',
    'item-y': '0.5rem',
    'cell-x': '1rem',
    'cell-y': '0.75rem',
    card: '1.5rem',
    stack: '1rem',
  },
  compact: {
    'control-xs': '1.25rem',
    'control-sm': '1.75rem',
    'control-md': '2.125rem',
    'control-lg': '2.5rem',
    'control-x': '0.75rem',
    'item-x': '0.5rem',
    'item-y': '0.3125rem',
    'cell-x': '0.75rem',
    'cell-y': '0.4375rem',
    card: '1rem',
    stack: '0.75rem',
  },
};

export type TextStep = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/** Font size and line height per step, in px. Body text is `md`. */
export const textSizes: Record<TextSize, Record<TextStep, readonly [number, number]>> = {
  compact: {
    xs: [12, 16],
    sm: [13, 18],
    md: [14, 20],
    lg: [16, 24],
    xl: [20, 28],
    '2xl': [24, 32],
    '3xl': [32, 38],
  },
  default: {
    xs: [13, 18],
    sm: [14, 20],
    md: [16, 24],
    lg: [18, 28],
    xl: [22, 30],
    '2xl': [28, 36],
    '3xl': [40, 46],
  },
};

const rem = (px: number) => `${px / 16}rem`;

/** The `--text-*` declarations for one text size, as CSS lines. */
export function textSizeLines(size: TextSize, indent = '  '): string[] {
  return Object.entries(textSizes[size]).flatMap(([step, [font, line]]) => [
    `${indent}--text-${step}: ${rem(font)};`,
    `${indent}--text-${step}--line-height: ${rem(line)};`,
  ]);
}

/**
 * Builds the CSS for one variant. `selector` is where the values apply; the
 * published files use `:root, [data-ui-variant='<name>']`.
 */
export function variantCss(
  variant: Variant,
  selector = `:root,\n[data-ui-variant='${variant.name}']`,
): string {
  const pairing = pairings[variant.pairing];
  const lines: string[] = [];
  for (const step of scaleSteps)
    lines.push(`  --color-brand-${step}: ${variant.colors.brand[step]};`);
  lines.push(`  --color-brand-seed: ${variant.seed.light};`);
  lines.push(`  --color-brand-seed-dark: ${variant.seed.dark};`);
  for (const [key, value] of Object.entries(densities[variant.density])) {
    lines.push(`  --density-${key}: ${value};`);
  }
  lines.push(`  --font-display: ${pairing.display};`);
  lines.push(`  --ui-font-data: var(--font-${pairing.data});`);
  lines.push(`  --ui-text-size: ${variant.textSize};`);
  if (variant.textSize === 'compact') lines.push(...textSizeLines('compact'));
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

export function variantFileCss(variant: Variant): string {
  return [
    '/*',
    ` * @eylulg/ui theme variant: ${variant.name} (${variant.project})`,
    ` * ${variant.description}`,
    ` * ${variant.seed.name}, ${variant.seed.light} light and ${variant.seed.dark} dark. ${pairings[variant.pairing].label} pairing, ${variant.textSize} text, ${variant.density} density.`,
    ' *',
    ' * Import after @eylulg/ui/theme.css. Generated by `npm run themes`; do not edit by hand.',
    ' */',
    '',
    variantCss(variant),
  ].join('\n');
}

/**
 * Every variant scoped to `[data-ui-variant='<name>']` only, in one file, so a
 * page can switch themes live by changing the attribute, or show several
 * projects' colours side by side. Published as @eylulg/ui/themes/all.css.
 */
export function allVariantsCss(all: Record<VariantName, Variant>): string {
  return [
    '/*',
    ' * @eylulg/ui: every theme variant, scoped to [data-ui-variant] only, for pages that',
    ' * switch themes live. Import after @eylulg/ui/theme.css. Generated by `npm run themes`;',
    ' * do not edit by hand.',
    ' */',
    '',
    ...variantNames.map((name) => variantCss(all[name], `[data-ui-variant='${name}']`)),
  ].join('\n');
}
