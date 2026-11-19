import { afterEach, describe, expect, it, vi } from 'vitest';
import { textSizeStorageKey, themeInitScript, themeStorageKey } from '../themeScript';

function run() {
  // The script is shipped as a string for an inline <script>; evaluate it the same way.
  new Function(themeInitScript)();
}

function mockSystemDark(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches } as MediaQueryList);
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark-mode');
  document.documentElement.removeAttribute('data-ui-text');
});

describe('themeInitScript', () => {
  it.each([
    { stored: 'dark', system: false, dark: true },
    { stored: 'light', system: true, dark: false },
    { stored: null, system: true, dark: true },
    { stored: null, system: false, dark: false },
  ])('stored $stored with system dark $system gives dark $dark', ({ stored, system, dark }) => {
    mockSystemDark(system);
    if (stored) window.localStorage.setItem(themeStorageKey, stored);

    run();

    expect(document.documentElement.classList.contains('dark-mode')).toBe(dark);
  });

  it('applies a stored text size before first paint', () => {
    mockSystemDark(false);
    window.localStorage.setItem(textSizeStorageKey, 'compact');

    run();

    expect(document.documentElement).toHaveAttribute('data-ui-text', 'compact');
  });

  it('does not throw when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(run).not.toThrow();
  });
});
