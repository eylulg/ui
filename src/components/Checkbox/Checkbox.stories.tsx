import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { children: 'Remember me', onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultSelected: true } };
export const Indeterminate: Story = { args: { isIndeterminate: true, children: 'Select all' } };
export const WithHint: Story = { args: { hint: 'Stay signed in for 30 days.' } };
export const Invalid: Story = { args: { isInvalid: true, children: 'Accept the terms' } };
export const Disabled: Story = { args: { isDisabled: true } };
