import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings, Trash2 } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('uses aria-label as its accessible name and hides the icon', () => {
    const { container } = render(<IconButton icon={Settings} aria-label="Settings" />);
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('activates with the keyboard', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<IconButton icon={Trash2} aria-label="Delete" onPress={onPress} />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner and ignores presses while loading', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    const { container } = render(
      <IconButton icon={Trash2} aria-label="Delete" isLoading onPress={onPress} />,
    );
    expect(container.querySelector('.animate-spin')).not.toBeNull();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <IconButton icon={Settings} aria-label="Settings" />
        <IconButton icon={Trash2} aria-label="Delete" variant="destructive" />
        <IconButton icon={Settings} aria-label="Disabled settings" isDisabled />
      </div>
    ));
  });
});
