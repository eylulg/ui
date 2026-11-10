import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button } from '../../Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
} from '../DropdownMenu';

function Example() {
  return (
    <DropdownMenu>
      <Button variant="secondary">Actions</Button>
      <DropdownMenuContent>
        <DropdownMenuSection title="Edit">
          <DropdownMenuItem id="rename" icon={Pencil} shortcut="R">
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem id="duplicate" icon={Copy} description="Copies labels too">
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuSection>
        <DropdownMenuSeparator />
        <DropdownMenuSection title="View" selectionMode="multiple" defaultSelectedKeys={['done']}>
          <DropdownMenuItem id="done">Show done</DropdownMenuItem>
          <DropdownMenuItem id="archived">Show archived</DropdownMenuItem>
        </DropdownMenuSection>
        <DropdownMenuSeparator />
        <DropdownMenuItem id="delete" icon={Trash2} isDanger>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function openWithKeyboard() {
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard('{Enter}');
  await screen.findByRole('menu');
  return user;
}

describe('DropdownMenu', () => {
  it('labels each section with its title', async () => {
    render(<Example />);

    await openWithKeyboard();

    expect(screen.getByRole('group', { name: 'View' })).toBeInTheDocument();
  });

  it('names an item with a description by its label first, then the description', async () => {
    render(<Example />);

    await openWithKeyboard();

    expect(screen.getByRole('menuitem', { name: /^Duplicate\s*Copies labels too/ })).toBeVisible();
  });

  it('jumps to an item by typing its label', async () => {
    render(<Example />);
    const user = await openWithKeyboard();

    await user.keyboard('del');

    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('returns focus to the trigger after an action', async () => {
    render(<Example />);
    const user = await openWithKeyboard();

    await user.keyboard('{Enter}');

    await waitFor(() => expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus());
  });

  it('has no axe violations in light and dark while open', async () => {
    await expectNoA11yViolations(
      () => <Example />,
      async () => {
        await openWithKeyboard();
      },
    );
  });
});
