import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDot, Inbox, Layers, Plus, Users } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';
import { IconButton } from '../components/IconButton/IconButton';
import { SidebarNav } from './SidebarNav';

const meta = {
  title: 'Chrome/SidebarNav',
  component: SidebarNav,
  parameters: { layout: 'padded' },
  args: {
    sections: [
      {
        id: 'main',
        items: [
          { href: '#inbox', label: 'Inbox', icon: <Inbox />, badge: '4', isCurrent: true },
          { href: '#issues', label: 'My issues', icon: <CircleDot /> },
        ],
      },
      {
        id: 'teams',
        title: 'Teams',
        collapsible: true,
        items: [
          { href: '#web', label: 'Web', icon: <Users /> },
          { href: '#platform', label: 'Platform', icon: <Layers /> },
        ],
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-64 rounded-lg border border-subtle">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A secondary control beside the link, as its own tab stop. */
export const WithItemAction: Story = {
  args: {
    sections: [
      {
        id: 'teams',
        title: 'Teams',
        items: [
          {
            href: '#web',
            label: 'Web',
            icon: <Users />,
            action: (
              <IconButton
                icon={Plus}
                aria-label="Add project to Web"
                variant="tertiary"
                size="sm"
              />
            ),
          },
          { href: '#platform', label: 'Platform', icon: <Layers /> },
        ],
      },
    ],
  },
};

export const CollapsedSection: Story = {
  args: {
    sections: [
      { id: 'main', items: [{ href: '#inbox', label: 'Inbox', icon: <Inbox />, isCurrent: true }] },
      {
        id: 'teams',
        title: 'Teams',
        collapsible: true,
        defaultExpanded: false,
        items: [{ href: '#web', label: 'Web', icon: <Users /> }],
      },
    ],
  },
};

export const ArrowKeys: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('link', { name: /inbox/i }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('link', { name: 'My issues' })).toHaveFocus();
  },
};
