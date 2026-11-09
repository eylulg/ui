import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Dialog, DialogTrigger } from './Dialog';

function Example({ onConfirm = () => {} }: { onConfirm?: () => void }) {
  return (
    <DialogTrigger>
      <Button>Edit profile</Button>
      <Dialog
        title="Edit profile"
        description="Changes are saved to your account."
        footer={({ close }) => (
          <>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                onConfirm();
                close();
              }}
            >
              Save
            </Button>
          </>
        )}
      >
        <Input label="Display name" />
      </Dialog>
    </DialogTrigger>
  );
}

async function openWithKeyboard() {
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard('{Enter}');
  const dialog = await screen.findByRole('dialog');
  return { user, dialog };
}

describe('Dialog', () => {
  it('is closed until the trigger is pressed', () => {
    render(<Example />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens from the keyboard with an accessible name and description', async () => {
    render(<Example />);
    const { dialog } = await openWithKeyboard();
    expect(dialog).toHaveAccessibleName('Edit profile');
    expect(dialog).toHaveAccessibleDescription('Changes are saved to your account.');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
  });

  it('traps focus inside the dialog', async () => {
    render(<Example />);
    const { user, dialog } = await openWithKeyboard();
    for (let step = 0; step < 8; step += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    for (let step = 0; step < 8; step += 1) {
      await user.tab({ shift: true });
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it('closes with Escape and restores focus to the trigger', async () => {
    render(<Example />);
    const { user } = await openWithKeyboard();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit profile' })).toHaveFocus());
  });

  it('runs footer actions and closes', async () => {
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);
    const { user } = await openWithKeyboard();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes from the header close button', async () => {
    render(<Example />);
    const { user } = await openWithKeyboard();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('supports the alertdialog role', async () => {
    render(<Dialog isOpen role="alertdialog" title="Delete file?" />);
    expect(await screen.findByRole('alertdialog', { name: 'Delete file?' })).toBeInTheDocument();
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
