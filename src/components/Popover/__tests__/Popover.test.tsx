import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button } from '../../Button/Button';
import { Popover, PopoverTrigger } from '../Popover';

function Example() {
  return (
    <PopoverTrigger>
      <Button variant='secondary'>Filters</Button>
      <Popover title='Issue filters'>
        {({ close }) => (
          <Button size='sm' onPress={close}>
            Apply filters
          </Button>
        )}
      </Popover>
    </PopoverTrigger>
  );
}

async function open() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Filters' }));
  const dialog = await screen.findByRole('dialog');
  return { user, dialog };
}

describe('Popover', () => {
  it('is named by its title', async () => {
    render(<Example />);

    const { dialog } = await open();

    expect(dialog).toHaveAccessibleName('Issue filters');
  });

  it('moves focus inside on open and back to the trigger on close', async () => {
    render(<Example />);
    const { user, dialog } = await open();
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.getByRole('button', { name: 'Filters' })).toHaveFocus());
  });

  it('closes from a control that receives close', async () => {
    render(<Example />);
    const { user } = await open();

    await user.click(screen.getByRole('button', { name: 'Apply filters' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
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
