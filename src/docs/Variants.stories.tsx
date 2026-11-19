import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  densities,
  radii,
  scaleSteps,
  variantNames,
  variants,
  type VariantName,
} from '../styles/themes/variants';
import { KitchenSink } from './KitchenSink';

const panel = 'rounded-xl border border-subtle bg-primary p-card text-primary';
const darkPanel = 'dark-mode rounded-xl border border-subtle bg-primary p-card text-primary';
const swatch = 'h-10 rounded-sm ring-1 ring-default ring-inset';
const facts = 'grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm';

function Swatches({ name }: { name: VariantName }) {
  const { colors } = variants[name];
  return (
    <div className="flex flex-col gap-3">
      {(['brand', 'warning', 'gray'] as const).map((scale) => {
        const colorScale = colors[scale];
        return (
          colorScale && (
            <div key={scale} className="flex flex-col gap-1">
              <span className="font-mono text-xs text-secondary">--color-{scale}-*</span>
              <div className="grid grid-cols-6 gap-1 sm:grid-cols-12">
                {scaleSteps.map((step) => (
                  <div key={step} className="flex flex-col gap-1">
                    <div className={swatch} style={{ background: colorScale[step] }} />
                    <span className="text-center font-mono text-xs text-tertiary">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}

function VariantPage({ name }: { name: VariantName }) {
  const variant = variants[name];
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold">
          {name} <span className="text-tertiary">for {variant.project}</span>
        </h1>
        <p className="text-sm text-secondary">{variant.description}</p>
        <pre className="w-fit rounded-md bg-tertiary px-3 py-2 font-mono text-xs text-secondary">
          {`@import '@eylulg/ui/theme.css';\n@import '@eylulg/ui/themes/${name}.css';`}
        </pre>
      </div>
      <dl className={facts}>
        <dt className="text-tertiary">Brand</dt>
        <dd>
          {variant.brand.name}, hue {variant.brand.hue}
        </dd>
        {variant.warning && (
          <>
            <dt className="text-tertiary">Warning</dt>
            <dd>
              {variant.warning.name}, hue {variant.warning.hue}
            </dd>
          </>
        )}
        <dt className="text-tertiary">Gray</dt>
        <dd>
          {variant.gray.family} ({variant.gray.like} like)
        </dd>
        <dt className="text-tertiary">Radius</dt>
        <dd>
          {variant.radius}, md is {radii[variant.radius].md}
        </dd>
        <dt className="text-tertiary">Density</dt>
        <dd>
          {variant.density}, controls are {densities[variant.density]['control-md']} tall
        </dd>
        <dt className="text-tertiary">Data font</dt>
        <dd>{variant.fonts.data === 'mono' ? 'monospace' : 'Inter'}</dd>
      </dl>
      <div data-ui-variant={name}>
        <Swatches name={name} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section aria-label={`${name}, light`} data-ui-variant={name} className={panel}>
          <KitchenSink label={`${name} light`} />
        </section>
        <section aria-label={`${name}, dark`} data-ui-variant={name} className={darkPanel}>
          <KitchenSink label={`${name} dark`} />
        </section>
      </div>
    </div>
  );
}

const meta = {
  title: 'Theme variants',
  component: VariantPage,
  tags: ['!autodocs'],
  parameters: { layout: 'padded', forceTheme: 'light', forceVariant: 'base' },
} satisfies Meta<typeof VariantPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Portfolio: Story = { args: { name: 'portfolio' } };
export const Workspace: Story = { args: { name: 'workspace' } };
export const Review: Story = { args: { name: 'review' } };
export const ControlRoom: Story = { args: { name: 'control-room' } };
export const Watchlist: Story = { args: { name: 'watchlist' } };
export const Tokens: Story = { args: { name: 'tokens' } };
export const PlainLanguage: Story = { args: { name: 'plain-language' } };
export const Sudoku: Story = { args: { name: 'sudoku' } };
export const Assistant: Story = { args: { name: 'assistant' } };

export const Overview: Story = {
  args: { name: 'portfolio' },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {variantNames.map((name) => (
        <div key={name} data-ui-variant={name} className={panel}>
          <p className="font-display text-lg font-semibold">{name}</p>
          <p className="mb-3 text-sm text-tertiary">{variants[name].project}</p>
          <Swatches name={name} />
        </div>
      ))}
    </div>
  ),
};
