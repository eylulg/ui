import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExternalLink } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button } from '../../Button/Button';
import { IconButton } from '../../IconButton/IconButton';
import { Input } from '../../Input/Input';
import { Dialog, DialogTrigger } from '../Dialog';

function Example({ onConfirm = () => {} }: { onConfirm?: () => void }) {
  return (
    <DialogTrigger>
      <Button>Edit profile</Button>
      <Dialog
        title="Edit profile"
        description="Changes are saved to your account."
        headerActions={
          <IconButton icon={ExternalLink} aria-label="Open as page" variant="tertiary" size="sm" />
        }
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

async function open() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Edit profile' }));
  const dialog = await screen.findByRole('dialog');
  return { user, dialog };
}

describe('Dialog', () => {
  it('is named and described by its title and description', async () => {
    render(<Example />);

    const { dialog } = await open();

    expect(dialog).toHaveAccessibleName('Edit profile');
    expect(dialog).toHaveAccessibleDescription('Changes are saved to your account.');
  });

  it('moves focus inside on open and back to the trigger on close', async () => {
    render(<Example />);
    const { user, dialog } = await open();
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit profile' })).toHaveFocus());
  });

  it.each(['Save', 'Close'])('closes from the %s button', async (name) => {
    render(<Example />);
    const { user } = await open();

    await user.click(screen.getByRole('button', { name }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('runs the footer action', async () => {
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);
    const { user } = await open();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('keeps header actions beside the title and the close button reachable', async () => {
    render(<Example />);

    const { dialog } = await open();

    expect(within(dialog).getByRole('button', { name: 'Open as page' })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Close' })).toBeInTheDocument();
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
