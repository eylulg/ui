import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { themeStorageKey } from '../themeScript';
import { ThemeToggle } from '../ThemeToggle';

function mockSystemDark(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark-mode');
});

describe('ThemeToggle', () => {
  it.each([
    { choice: 'Dark theme', stored: 'dark', dark: true },
    { choice: 'Light theme', stored: 'light', dark: false },
  ])('applies and remembers $choice', async ({ choice, stored, dark }) => {
    const user = userEvent.setup();
    mockSystemDark(!dark);
    render(<ThemeToggle />);

    await user.click(screen.getByRole('radio', { name: choice }));

    expect(document.documentElement.classList.contains('dark-mode')).toBe(dark);
    expect(window.localStorage.getItem(themeStorageKey)).toBe(stored);
  });

  it('follows the system and forgets the stored choice when set to system', async () => {
    const user = userEvent.setup();
    mockSystemDark(true);
    window.localStorage.setItem(themeStorageKey, 'light');
    render(<ThemeToggle />);

    await user.click(screen.getByRole('radio', { name: 'System theme' }));

    expect(document.documentElement).toHaveClass('dark-mode');
    expect(window.localStorage.getItem(themeStorageKey)).toBeNull();
  });

  it('starts from the stored choice', () => {
    mockSystemDark(false);
    window.localStorage.setItem(themeStorageKey, 'dark');

    render(<ThemeToggle />);

    expect(screen.getByRole('radio', { name: 'Dark theme' })).toBeChecked();
  });

  it('still switches when storage is blocked', async () => {
    const user = userEvent.setup();
    mockSystemDark(false);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<ThemeToggle />);

    await user.click(screen.getByRole('radio', { name: 'Dark theme' }));

    expect(document.documentElement).toHaveClass('dark-mode');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <ThemeToggle />);
  });
});
