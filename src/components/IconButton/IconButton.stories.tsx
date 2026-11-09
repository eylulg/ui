import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Settings, Trash2 } from 'lucide-react';
import { fn } from 'storybook/test';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { icon: Settings, 'aria-label': 'Settings', onPress: fn() },
  argTypes: {
    icon: { control: false },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'tertiary', 'destructive'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', icon: Bell, 'aria-label': 'Notifications' },
};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };
export const Destructive: Story = {
  args: { variant: 'destructive', icon: Trash2, 'aria-label': 'Delete' },
};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };
