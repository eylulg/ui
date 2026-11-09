import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  args: { label: 'Uploading files', value: 40 },
  argTypes: {
    tone: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {};
export const Success: Story = { args: { tone: 'success', value: 100, label: 'Upload complete' } };
export const Warning: Story = {
  args: { tone: 'warning', value: 85, label: 'Storage almost full' },
};
export const Failed: Story = { args: { tone: 'error', value: 30, label: 'Upload failed at 30%' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Indeterminate: Story = { args: { isIndeterminate: true, label: 'Syncing' } };
export const CustomValueLabel: Story = {
  args: { value: 3, maxValue: 8, valueLabel: '3 of 8 checks passed', label: 'Checks' },
};
export const WithoutValue: Story = { args: { hideValue: true } };
