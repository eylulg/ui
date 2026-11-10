import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilePlus, FolderGit2, Moon, Settings, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Kbd } from '../Kbd/Kbd';
import {
  CommandGroup,
  CommandItem,
  CommandPalette,
  useCommandPaletteShortcut,
} from './CommandPalette';

const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  args: { isOpen: false, onOpenChange: fn(), onAction: fn(), children: null },
  parameters: { docs: { story: { height: '480px' } } },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

function Palette({ onAction }: { onAction?: (key: React.Key) => void }) {
  const [isOpen, setOpen] = useState(false);
  useCommandPaletteShortcut(setOpen);

  function handleOpen() {
    setOpen(true);
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" onPress={handleOpen}>
        Open commands
      </Button>
      <span className="text-sm text-tertiary">
        or press <Kbd keys={['⌘', 'K']} />
      </span>
      <CommandPalette isOpen={isOpen} onOpenChange={setOpen} onAction={onAction}>
        <CommandGroup heading="Issues">
          <CommandItem id="new-issue" icon={FilePlus} shortcut={['C']}>
            Create issue
          </CommandItem>
          <CommandItem id="assign" icon={UserPlus} shortcut={['I']}>
            Assign to me
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Navigation">
          <CommandItem id="projects" icon={FolderGit2} description="Every project you follow">
            Go to projects
          </CommandItem>
          <CommandItem id="settings" icon={Settings} shortcut={['G', 'S']}>
            Open settings
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Preferences">
          <CommandItem id="theme" icon={Moon} description="Light, dark or system">
            Change theme
          </CommandItem>
        </CommandGroup>
      </CommandPalette>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <Palette onAction={args.onAction} />,
};

export const SearchAndRun: Story = {
  ...Default,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open commands' }));
    await body.findByRole('dialog', { name: 'Command palette' });
    await userEvent.keyboard('settings{ArrowDown}{Enter}');
    await expect(args.onAction).toHaveBeenCalledWith('settings');
  },
};

export const NoResults: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open commands' }));
    await body.findByRole('dialog', { name: 'Command palette' });
    await userEvent.keyboard('zzz');
    await expect(await body.findByText('No results')).toBeVisible();
  },
};

const statuses = ['Backlog', 'Todo', 'In progress', 'Done'];

function NestedPalette() {
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Backlog');
  useCommandPaletteShortcut(setOpen);

  function handleOpen() {
    setPage(null);
    setOpen(true);
  }

  function handleAction(key: React.Key) {
    if (key === 'status') {
      setPage('status');
      return;
    }
    setStatus(String(key));
    setOpen(false);
  }

  function handleBack() {
    setPage(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button variant="secondary" onPress={handleOpen}>
          Open commands
        </Button>
        <span className="text-sm text-tertiary">Status: {status}</span>
      </div>
      <p className="text-xs text-tertiary">Search text: {search || 'empty'}</p>
      <CommandPalette
        isOpen={isOpen}
        onOpenChange={setOpen}
        onAction={handleAction}
        closeOnAction={false}
        onSearchChange={setSearch}
        page={page ? { id: page, title: 'Change status' } : undefined}
        onBack={handleBack}
      >
        {page === 'status' ? (
          <CommandGroup heading="Status">
            {statuses.map((name) => (
              <CommandItem key={name} id={name}>
                {name}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : (
          <CommandGroup heading="Issue">
            <CommandItem id="status" description="Opens a list of statuses">
              Change status
            </CommandItem>
            <CommandItem id="assign" icon={UserPlus}>
              Assign to me
            </CommandItem>
          </CommandGroup>
        )}
      </CommandPalette>
    </div>
  );
}

/** Sub pages: the app keeps the page, Backspace in an empty search or the back button goes up. */
export const NestedPages: Story = {
  render: () => <NestedPalette />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open commands' }));
    await userEvent.click(await body.findByRole('menuitem', { name: /^Change status/ }));
    await expect(await body.findByRole('menuitem', { name: 'In progress' })).toBeVisible();
    await userEvent.keyboard('{Backspace}');
    await expect(await body.findByRole('menuitem', { name: 'Assign to me' })).toBeVisible();
  },
};
