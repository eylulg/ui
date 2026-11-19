import type { Meta, StoryObj } from '@storybook/react-vite';
import { cx } from '../utils/cx';
import { BrandLogo } from './BrandLogo';
import { BrandMark } from './BrandMark';

const meta = {
  title: 'Chrome/BrandLogo',
  component: BrandLogo,
  args: { title: 'Eylül Güneş', size: 160 },
} satisfies Meta<typeof BrandLogo>;

export default meta;

const tile = 'flex flex-col items-center gap-3 rounded-2xl bg-secondary p-8 text-primary';
type Story = StoryObj<typeof meta>;

/** A draft. Stroke weight and thick-to-thin contrast are still open. */
export const Default: Story = {};

/** The logo keeps its colours in every project: green letters and ink lines, light green and cream in dark mode. */
export const LightAndDark: Story = {
  render: (args) => (
    <div className='flex flex-wrap gap-4'>
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className={cx(tile, mode === 'dark' && 'dark-mode')}>
          <BrandLogo {...args} title={`Eylül Güneş, ${mode}`} />
          <span className='text-sm text-tertiary'>{mode === 'dark' ? 'Dark' : 'Light'}</span>
        </div>
      ))}
    </div>
  ),
};

/** Sizes from page header to app icon. Below 32px, BrandMark stays until a simplified logo exists. */
export const Sizes: Story = {
  render: () => (
    <div className='flex items-end gap-6'>
      {[32, 48, 64, 96].map((size) => (
        <BrandLogo key={size} size={size} title={`Eylül Güneş, ${size} pixels`} />
      ))}
      <BrandMark size={24} title='Eylül Güneş, tab size mark' />
    </div>
  ),
};
