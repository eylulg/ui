import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { TextSizeToggle } from '../TextSizeToggle';
import { textSizeStorageKey } from '../themeScript';

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-ui-text');
});

describe('TextSizeToggle', () => {
  it('starts at default text', () => {
    render(<TextSizeToggle />);

    expect(screen.getByRole('button', { name: 'Compact text' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('applies and remembers the choice', async () => {
    const user = userEvent.setup();
    render(<TextSizeToggle />);

    await user.click(screen.getByRole('button', { name: 'Compact text' }));

    expect(document.documentElement).toHaveAttribute('data-ui-text', 'compact');
    expect(window.localStorage.getItem(textSizeStorageKey)).toBe('compact');
    expect(screen.getByRole('button', { name: 'Compact text' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('switches back to default text', async () => {
    const user = userEvent.setup();
    render(<TextSizeToggle />);
    await user.click(screen.getByRole('button', { name: 'Compact text' }));

    await user.click(screen.getByRole('button', { name: 'Compact text' }));

    expect(document.documentElement).toHaveAttribute('data-ui-text', 'default');
    expect(window.localStorage.getItem(textSizeStorageKey)).toBe('default');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <TextSizeToggle />);
  });
});
