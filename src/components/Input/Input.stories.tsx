import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Search } from 'lucide-react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { label: 'Email', placeholder: 'you@example.com' },
  argTypes: {
    iconLeading: { control: false },
    iconTrailing: { control: false },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'We only use it for receipts.' } };
export const WithError: Story = {
  args: { defaultValue: 'eylul@', errorMessage: 'Enter a valid email address.' },
};
export const LeadingIcon: Story = { args: { iconLeading: Mail } };
export const TrailingIcon: Story = {
  args: { label: 'Search', placeholder: 'Search components', iconTrailing: Search },
};
export const Small: Story = { args: { size: 'sm' } };
export const Disabled: Story = { args: { isDisabled: true, defaultValue: 'locked@example.com' } };
export const Required: Story = { args: { isRequired: true, hint: 'Required field.' } };
