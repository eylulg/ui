import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandLoader } from './BrandLoader';

const meta = {
  title: 'Chrome/BrandLoader',
  component: BrandLoader,
  args: { size: 160 },
} satisfies Meta<typeof BrandLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Draws itself along the outline, holds, fades and repeats. Under reduced motion it is the still logo. */
export const Default: Story = {};
