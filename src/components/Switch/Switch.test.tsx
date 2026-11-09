import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders with the switch role', () => {
    render(<Switch>Dark mode</Switch>);
    expect(screen.getByRole('switch', { name: 'Dark mode' })).not.toBeChecked();
  });

  it('toggles with Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Notifications</Switch>);
    await user.tab();
    await user.keyboard(' ');
    expect(screen.getByRole('switch')).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('respects isDisabled', async () => {
    const user = userEvent.setup();
    render(<Switch isDisabled>Locked</Switch>);
    await user.click(screen.getByText('Locked'));
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Switch hint="Sync across devices">Sync</Switch>
        <Switch defaultSelected size="sm">
          Small and on
        </Switch>
        <Switch isDisabled>Disabled</Switch>
      </div>
    ));
  });
});
