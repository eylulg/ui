import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings, Trash2 } from 'lucide-react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { IconButton } from '../IconButton';

describe('IconButton', () => {
  it('keeps its name and ignores presses while loading', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<IconButton icon={Trash2} aria-label='Delete' isLoading onPress={onPress} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('forwards its ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<IconButton ref={ref} icon={Settings} aria-label='Settings' />);

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Settings' }));
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <IconButton icon={Settings} aria-label='Settings' />
        <IconButton icon={Trash2} aria-label='Delete' variant='destructive' />
        <IconButton icon={Settings} aria-label='Disabled settings' isDisabled />
      </div>
    ));
  });
});
