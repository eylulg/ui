import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info, Settings } from 'lucide-react';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    content: 'Open settings',
    children: <IconButton icon={Settings} aria-label="Settings" />,
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'start', 'end'] },
    children: { control: false },
  },
  decorators: [(Story) => <div className="flex justify-center py-16">{Story()}</div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = { args: { placement: 'top' } };
export const Bottom: Story = { args: { placement: 'bottom' } };
export const Start: Story = { args: { placement: 'start' } };
export const End: Story = { args: { placement: 'end' } };
export const DefaultOpen: Story = { args: { defaultOpen: true } };
export const OnButton: Story = {
  args: {
    content: 'Saved drafts are kept for 30 days.',
    children: (
      <Button variant="secondary" iconLeading={Info}>
        Retention
      </Button>
    ),
  },
};
