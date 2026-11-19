import type { Meta, StoryObj } from '@storybook/react-vite';
import { variantNames } from '../styles/themes/variants';
import { BrandMark } from './BrandMark';

const meta = {
  title: 'Chrome/BrandMark',
  component: BrandMark,
  args: { title: 'Eylül Güneş', size: 48 },
} satisfies Meta<typeof BrandMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InEveryVariant: Story = {
  render: (args) => (
    <ul className='flex flex-wrap gap-4'>
      {variantNames.map((name) => (
        <li key={name} data-ui-variant={name} className='flex flex-col items-center gap-2'>
          <BrandMark {...args} title={`Eylül Güneş, ${name} variant`} />
          <span className='text-xs text-tertiary'>{name}</span>
        </li>
      ))}
    </ul>
  ),
};
