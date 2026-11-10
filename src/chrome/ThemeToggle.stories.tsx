import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from './ThemeToggle';

const meta = {
  title: 'Chrome/ThemeToggle',
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** One icon button that opens a menu, for the top bar at 375px. */
export const Compact: Story = { args: { compact: true } };

export const Translated: Story = {
  args: { labels: { ariaLabel: 'Farbschema', light: 'Hell', dark: 'Dunkel', system: 'System' } },
};
