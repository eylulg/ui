import type { Meta, StoryObj } from '@storybook/react-vite';
import { Film, Inbox, SearchX } from 'lucide-react';
import { Button } from '../Button/Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  args: {
    title: 'No issues yet',
    description: 'Create an issue to start tracking work.',
    icon: Inbox,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    icon: { control: false },
    primaryAction: { control: false },
    secondaryAction: { control: false },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    primaryAction: <Button>Create issue</Button>,
    secondaryAction: <Button variant="secondary">Import issues</Button>,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    icon: SearchX,
    title: 'No results',
    description: 'Try a shorter search or clear the filters.',
  },
};

export const WithoutIcon: Story = {
  args: {
    icon: undefined,
    title: 'Your watchlist is empty',
    description: 'Add a film to see it here.',
    primaryAction: <Button iconLeading={Film}>Add a film</Button>,
  },
};
