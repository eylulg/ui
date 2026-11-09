import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from './Tooltip';

function Example() {
  return (
    <Tooltip content="Open settings" delay={0}>
      <IconButton icon={Settings} aria-label="Settings" />
    </Tooltip>
  );
}

describe('Tooltip', () => {
  it('is not rendered until triggered', () => {
    render(<Example />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on keyboard focus and describes the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Open settings');
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveAccessibleDescription(
      'Open settings',
    );
  });

  it('closes with Escape', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('opens on hover', async () => {
    const user = userEvent.setup();
    render(<Example />);
    // React Aria only treats hover as intent once the pointer has moved, as in a real browser.
    await user.hover(document.body);
    await user.hover(screen.getByRole('button'));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });

  it('has no axe violations in light and dark while open', async () => {
    await expectNoA11yViolations(
      () => <Example />,
      async () => {
        await userEvent.setup().tab();
        await screen.findByRole('tooltip');
      },
    );
  });
});
