import type { Meta, StoryObj } from '@storybook/react-vite';
import { scaleSteps, variantNames, variants, type VariantName } from '../styles/themes/variants';
import { KitchenSink } from './KitchenSink';

const panel = 'rounded-2xl border border-default bg-secondary p-card text-primary';
const darkPanel = 'dark-mode rounded-2xl border border-default bg-secondary p-card text-primary';
const swatch = 'h-10 rounded-sm ring-1 ring-default ring-inset';
const seedSwatch = 'h-10 w-20 rounded-sm ring-1 ring-default ring-inset';

function Seeds({ name }: { name: VariantName }) {
  const { seed } = variants[name];
  return (
    <div className='flex gap-2'>
      {[
        { mode: 'Light', color: seed.light },
        { mode: 'Dark', color: seed.dark },
      ].map(({ mode, color }) => (
        <div key={mode} className='flex flex-col gap-1'>
          <div className={seedSwatch} style={{ background: color }} />
          <span className='font-mono text-xs text-tertiary'>
            {mode} {color}
          </span>
        </div>
      ))}
    </div>
  );
}

function BrandScale({ name }: { name: VariantName }) {
  const { brand } = variants[name].colors;
  return (
    <div className='flex flex-col gap-1'>
      <span className='font-mono text-xs text-secondary'>--color-brand-*</span>
      <div className='grid grid-cols-6 gap-1 sm:grid-cols-12'>
        {scaleSteps.map((step) => (
          <div key={step} className='flex flex-col gap-1'>
            <div className={swatch} style={{ background: brand[step] }} />
            <span className='text-center font-mono text-xs text-tertiary'>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VariantPage({ name }: { name: VariantName }) {
  const variant = variants[name];
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='font-display text-2xl font-semibold'>
          {variant.project} <span className='text-tertiary'>({name})</span>
        </h1>
        <p className='text-md text-secondary'>{variant.description}</p>
        <pre className='w-fit rounded-md bg-tertiary px-3 py-2 font-mono text-xs text-secondary'>
          {`@import '@eylulg/ui/theme.css';\n@import '@eylulg/ui/themes/${name}.css';`}
        </pre>
      </div>
      <div data-ui-variant={name} className='flex flex-col gap-4'>
        <Seeds name={name} />
        <BrandScale name={name} />
      </div>
      <div className='grid gap-6 xl:grid-cols-2'>
        <section aria-label={`${variant.project}, light`} data-ui-variant={name} className={panel}>
          <KitchenSink label={`${name} light`} />
        </section>
        <section
          aria-label={`${variant.project}, dark`}
          data-ui-variant={name}
          className={darkPanel}
        >
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

/** Every project's colour, in the mode the Theme toolbar picks. */
export const Overview: Story = {
  args: { name: 'portfolio' },
  // The variant pages force light so their light and dark panels sit side by side.
  // The overview shows one grid, so it follows the Theme toolbar instead.
  parameters: { forceTheme: null },
  render: () => (
    <ul className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${panel}`}>
      {variantNames.map((name) => (
        <li
          key={name}
          data-ui-variant={name}
          className='flex flex-col gap-3 rounded-xl border border-default bg-primary p-card'
        >
          <span className='flex items-center justify-between gap-3'>
            <span className='font-display text-xl font-semibold'>{variants[name].project}</span>
            <span aria-hidden='true' className='size-6 rounded-full bg-brand-solid' />
          </span>
          <span className='text-sm text-tertiary'>{variants[name].seed.name}</span>
          <span className='flex items-center gap-2 rounded-md bg-brand-subtle p-3'>
            <span className='rounded-md bg-brand-solid px-3 py-1.5 text-sm font-semibold text-on-solid'>
              Save changes
            </span>
            <span className='text-sm font-medium text-brand'>In review</span>
          </span>
        </li>
      ))}
    </ul>
  ),
};
