import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilePlus, Moon } from 'lucide-react';
import { useState } from 'react';
import type { Key } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button } from '../../Button/Button';
import {
  CommandGroup,
  CommandItem,
  CommandPalette,
  useCommandPaletteShortcut,
} from '../CommandPalette';

function Example({ onAction = () => {} }: { onAction?: (key: Key) => void }) {
  const [isOpen, setOpen] = useState(false);
  useCommandPaletteShortcut(setOpen);

  function handleOpen() {
    setOpen(true);
  }

  return (
    <>
      <Button onPress={handleOpen}>Open commands</Button>
      <CommandPalette isOpen={isOpen} onOpenChange={setOpen} onAction={onAction}>
        <CommandGroup heading="Issues">
          <CommandItem id="new-issue" icon={FilePlus} shortcut={['C']}>
            Create issue
          </CommandItem>
          <CommandItem id="assign">Assign to me</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Preferences">
          <CommandItem id="theme" icon={Moon} description="Light, dark or system">
            Change theme
          </CommandItem>
        </CommandGroup>
      </CommandPalette>
    </>
  );
}

async function open() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Open commands' }));
  await screen.findByRole('dialog', { name: 'Command palette' });
  return user;
}

describe('CommandPalette', () => {
  it.each(['{Meta>}k{/Meta}', '{Control>}k{/Control}'])('opens with %s', async (keys) => {
    const user = userEvent.setup();
    render(<Example />);

    await user.keyboard(keys);

    expect(await screen.findByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
  });

  it('starts with focus in the search field', async () => {
    render(<Example />);

    await open();

    await waitFor(() =>
      expect(screen.getByRole('searchbox', { name: 'Search commands' })).toHaveFocus(),
    );
  });

  it('filters every group as you type', async () => {
    render(<Example />);
    const user = await open();

    await user.keyboard('theme');

    expect(screen.getByRole('menuitem', { name: /^Change theme/ })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Create issue' })).not.toBeInTheDocument();
  });

  it('shows "No results" when nothing matches', async () => {
    render(<Example />);
    const user = await open();

    await user.keyboard('zzz');

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('runs the chosen command and closes', async () => {
    const onAction = vi.fn();
    render(<Example onAction={onAction} />);
    const user = await open();

    await user.keyboard('assign{ArrowDown}{Enter}');

    expect(onAction).toHaveBeenCalledWith('assign');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('returns focus to the opener when closed with Escape', async () => {
    render(<Example />);
    const user = await open();

    await user.keyboard('{Escape}{Escape}');

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Open commands' })).toHaveFocus(),
    );
  });

  it('has no axe violations in light and dark while open', async () => {
    await expectNoA11yViolations(
      () => <Example />,
      async () => {
        await open();
      },
    );
  });
});
