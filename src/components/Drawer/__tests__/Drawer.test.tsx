import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button } from '../../Button/Button';
import { Input } from '../../Input/Input';
import { Drawer, DrawerTrigger } from '../Drawer';

function Example({ hideTitle = false }: { hideTitle?: boolean }) {
  return (
    <DrawerTrigger>
      <Button>Open filters</Button>
      <Drawer
        title='Filters'
        hideTitle={hideTitle}
        description='Narrow the list of issues.'
        footer={({ close }) => <Button onPress={close}>Apply filters</Button>}
      >
        <Input label='Assignee' />
      </Drawer>
    </DrawerTrigger>
  );
}

async function open() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Open filters' }));
  const dialog = await screen.findByRole('dialog');
  return { user, dialog };
}

describe('Drawer', () => {
  it.each([false, true])('is named and described with hideTitle %s', async (hideTitle) => {
    render(<Example hideTitle={hideTitle} />);

    const { dialog } = await open();

    expect(dialog).toHaveAccessibleName('Filters');
    expect(dialog).toHaveAccessibleDescription('Narrow the list of issues.');
  });

  it('moves focus inside on open and back to the trigger on close', async () => {
    render(<Example />);
    const { user, dialog } = await open();
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.getByRole('button', { name: 'Open filters' })).toHaveFocus());
  });

  it.each(['Apply filters', 'Close'])('closes from the %s button', async (name) => {
    render(<Example />);
    const { user } = await open();

    await user.click(screen.getByRole('button', { name }));

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
