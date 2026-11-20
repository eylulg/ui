import type { Meta, StoryObj } from '@storybook/react-vite';
import { cx } from '../utils/cx';
import { BrandLogo } from './BrandLogo';

const meta = {
  title: 'Chrome/BrandLogo',
  component: BrandLogo,
  args: { title: 'Eylül Güneş', size: 160 },
} satisfies Meta<typeof BrandLogo>;

export default meta;

const tile = 'flex flex-col items-center gap-3 rounded-2xl bg-secondary p-8 text-primary';
type Story = StoryObj<typeof meta>;

/** The final logo, one path in the brand green. */
export const Default: Story = {};

/** Green in light mode and light green in dark mode, in every project. */
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

/** Sizes from page header to app icon. At 48px and below the logo gets a thin same-colour outline. */
export const Sizes: Story = {
  render: () => (
    <div className='flex items-end gap-6'>
      {[24, 32, 48, 64, 96].map((size) => (
        <BrandLogo key={size} size={size} title={`Eylül Güneş, ${size} pixels`} />
      ))}
    </div>
  ),
};
