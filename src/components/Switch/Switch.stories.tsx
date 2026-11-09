import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { children: 'Email notifications', onChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { defaultSelected: true } };
export const Small: Story = { args: { size: 'sm' } };
export const WithHint: Story = { args: { hint: 'A daily summary at 9:00.' } };
export const Disabled: Story = { args: { isDisabled: true } };
