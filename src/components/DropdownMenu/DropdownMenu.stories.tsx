import type { Meta, StoryObj } from '@storybook/react-vite';
import { Archive, Copy, LogOut, Pencil, Settings, Trash2, User } from 'lucide-react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownSubmenu,
} from './DropdownMenu';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  args: { children: null },
  parameters: { docs: { story: { height: '360px' } } },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const onAction = fn();

export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <Button variant="secondary">Actions</Button>
      <DropdownMenuContent aria-label="Actions" onAction={onAction}>
        <DropdownMenuItem id="edit" icon={Pencil}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem id="duplicate" icon={Copy}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem id="archive" icon={Archive}>
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const SectionsAndShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <Button variant="secondary">Account</Button>
      <DropdownMenuContent aria-label="Account" onAction={onAction}>
        <DropdownMenuSection title="Signed in as eylul@example.com">
          <DropdownMenuItem id="profile" icon={User} shortcut="⇧P">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem id="settings" icon={Settings} shortcut="⌘,">
            Settings
          </DropdownMenuItem>
        </DropdownMenuSection>
        <DropdownMenuSeparator />
        <DropdownMenuItem id="sign-out" icon={LogOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const CheckboxItems: Story = {
  render: () => (
    <DropdownMenu>
      <Button variant="secondary">View</Button>
      <DropdownMenuContent aria-label="View options">
        <DropdownMenuSection
          title="Show"
          selectionMode="multiple"
          defaultSelectedKeys={['open', 'review']}
        >
          <DropdownMenuItem id="open">Open</DropdownMenuItem>
          <DropdownMenuItem id="review">In review</DropdownMenuItem>
          <DropdownMenuItem id="done">Done</DropdownMenuItem>
        </DropdownMenuSection>
        <DropdownMenuSeparator />
        <DropdownMenuSection
          title="Group by"
          selectionMode="single"
          defaultSelectedKeys={['status']}
        >
          <DropdownMenuItem id="status">Status</DropdownMenuItem>
          <DropdownMenuItem id="assignee">Assignee</DropdownMenuItem>
        </DropdownMenuSection>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithDescriptionsAndDanger: Story = {
  render: () => (
    <DropdownMenu>
      <Button variant="secondary">More</Button>
      <DropdownMenuContent aria-label="More" onAction={onAction}>
        <DropdownMenuItem id="copy" icon={Copy} description="Includes labels and estimate">
          Duplicate issue
        </DropdownMenuItem>
        <DropdownMenuItem id="delete" icon={Trash2} isDanger>
          Delete issue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Submenu: Story = {
  render: () => (
    <DropdownMenu>
      <Button variant="secondary">Move</Button>
      <DropdownMenuContent aria-label="Move" onAction={onAction}>
        <DropdownMenuItem id="top">Move to top</DropdownMenuItem>
        <DropdownSubmenu>
          <DropdownMenuItem id="project">Move to project</DropdownMenuItem>
          <DropdownMenuContent aria-label="Projects" placement="end top" onAction={onAction}>
            <DropdownMenuItem id="workspace">Workspace</DropdownMenuItem>
            <DropdownMenuItem id="review">Review Companion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownSubmenu>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const KeyboardNavigation: Story = {
  ...Basic,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    await body.findByRole('menu');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    // React Aria passes a second argument to onAction, so read the key itself.
    await expect(onAction.mock.calls[0]?.[0]).toBe('duplicate');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Actions' })).toHaveFocus());
  },
};
