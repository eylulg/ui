import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: { label: 'Message', placeholder: 'Write a few words' },
  decorators: [(Story) => <div className="max-w-md">{Story()}</div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Markdown is supported.' } };
export const WithError: Story = { args: { errorMessage: 'A message is required.' } };
export const NotResizable: Story = { args: { resizable: false, rows: 3 } };
export const Disabled: Story = { args: { isDisabled: true, defaultValue: 'Read only text' } };
