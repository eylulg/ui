import type { Meta, StoryObj } from '@storybook/react-vite';
import { Star } from 'lucide-react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Badge' },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: [
        'gray',
        'brand',
        'success',
        'warning',
        'error',
        'blue',
        'purple',
        'pink',
        'orange',
        'indigo',
      ],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    icon: { control: false },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gray: Story = { args: { color: 'gray' } };
export const Brand: Story = { args: { color: 'brand' } };
export const Success: Story = { args: { color: 'success', children: 'Paid' } };
export const Warning: Story = { args: { color: 'warning', children: 'Pending' } };
export const ErrorColor: Story = { name: 'Error', args: { color: 'error', children: 'Failed' } };
export const Small: Story = { args: { size: 'sm' } };
export const Blue: Story = { args: { color: 'blue', children: 'Backlog' } };
export const Purple: Story = { args: { color: 'purple', children: 'In review' } };
export const Pink: Story = { args: { color: 'pink', children: 'Design' } };
export const Orange: Story = { args: { color: 'orange', children: 'Blocked' } };
export const Indigo: Story = { args: { color: 'indigo', children: 'Planned' } };

export const WithDot: Story = { args: { color: 'success', dot: true, children: 'Online' } };
export const WithIcon: Story = { args: { color: 'brand', icon: Star, children: 'Featured' } };
