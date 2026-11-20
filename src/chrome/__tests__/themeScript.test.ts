import { afterEach, describe, expect, it, vi } from 'vitest';
import { themeInitScript, themeStorageKey } from '../themeScript';

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

  it('does not throw when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(run).not.toThrow();
  });
});
