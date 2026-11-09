import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  argTypes: { shape: { control: 'inline-radio', options: ['text', 'circle', 'rect'] } },
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = { args: { shape: 'text' } };
export const MultipleLines: Story = { args: { shape: 'text', lines: 3 } };
export const Circle: Story = { args: { shape: 'circle' } };
export const Rect: Story = { args: { shape: 'rect' } };

export const Card: Story = {
  render: () => (
    <div aria-busy="true" aria-label="Loading profile" role="region" className="flex gap-3">
      <Skeleton shape="circle" />
      <div className="flex-1">
        <Skeleton lines={3} />
      </div>
    </div>
  ),
};
