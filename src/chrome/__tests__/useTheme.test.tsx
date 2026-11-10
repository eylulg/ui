import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { themeStorageKey } from '../themeScript';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../useTheme';

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

function PaletteCommand() {
  const { theme, resolved, setTheme } = useTheme();
  return (
    <div>
      <p>
        Choice {theme}, applied {resolved}
      </p>
      <button type="button" onClick={() => setTheme('dark')}>
        Use dark
      </button>
      <button type="button" onClick={() => setTheme('system')}>
        Use system
      </button>
    </div>
  );
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark-mode');
});

describe('useTheme', () => {
  it('sets the theme from anywhere and keeps a ThemeToggle in step', async () => {
    const user = userEvent.setup();
    mockSystemDark(false);
    render(
      <>
        <PaletteCommand />
        <ThemeToggle />
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Use dark' }));

    expect(screen.getByText('Choice dark, applied dark')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Dark theme' })).toBeChecked();
    expect(document.documentElement).toHaveClass('dark-mode');
    expect(window.localStorage.getItem(themeStorageKey)).toBe('dark');
  });

  it('resolves system to the operating system setting', () => {
    mockSystemDark(true);

    render(<PaletteCommand />);

    expect(screen.getByText('Choice system, applied dark')).toBeInTheDocument();
  });

  it('works where matchMedia does not exist', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('matchMedia', undefined);
    render(<PaletteCommand />);

    await user.click(screen.getByRole('button', { name: 'Use dark' }));
    await user.click(screen.getByRole('button', { name: 'Use system' }));

    expect(screen.getByText('Choice system, applied light')).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
