import { useEffect, useSyncExternalStore } from 'react';
import { darkModeClass, themeStorageKey } from './themeScript';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface UseTheme {
  /** What the user chose: light, dark or system. */
  theme: ThemePreference;
  /** What is applied right now. For system this is the operating system's setting. */
  resolved: ResolvedTheme;
  /** Applies and remembers a choice. Every ThemeToggle and useTheme in the page updates. */
  setTheme: (theme: ThemePreference) => void;
}

const darkQuery = '(prefers-color-scheme: dark)';
const listeners = new Set<() => void>();
/** Holds the choice for this page when storage is blocked (private mode, sandboxed iframes). */
let unsaved: ThemePreference | null = null;

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

/** matchMedia is missing in some test environments and embedded webviews. */
function systemMedia(): MediaQueryList | null {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(darkQuery)
    : null;
}

function readPreference(): ThemePreference {
  if (unsaved) return unsaved;
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    return isPreference(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return systemMedia()?.matches ? 'dark' : 'light';
  return preference;
}

function readResolved(): ResolvedTheme {
  return resolve(readPreference());
}

function serverPreference(): ThemePreference {
  return 'system';
}

function serverResolved(): ResolvedTheme {
  return 'light';
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  const media = systemMedia();
  media?.addEventListener('change', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
    media?.removeEventListener('change', listener);
  };
}

function writePreference(preference: ThemePreference) {
  try {
    if (preference === 'system') window.localStorage.removeItem(themeStorageKey);
    else window.localStorage.setItem(themeStorageKey, preference);
    unsaved = null;
  } catch {
    unsaved = preference;
  }
  for (const listener of listeners) listener();
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle(darkModeClass, resolved === 'dark');
  root.style.colorScheme = resolved;
}

/**
 * The page's colour theme: the user's choice, what it resolves to, and a
 * setter. Writes the `dark-mode` class on <html>, remembers the choice in
 * localStorage and follows the operating system while the choice is system.
 * ThemeToggle uses it, so a command palette or settings page can call
 * `setTheme` without touching storage itself. Pair it with themeInitScript in
 * <head> so the first paint already has the right theme.
 */
export function useTheme(): UseTheme {
  const theme = useSyncExternalStore(subscribe, readPreference, serverPreference);
  const resolved = useSyncExternalStore(subscribe, readResolved, serverResolved);

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  return { theme, resolved, setTheme: writePreference };
}
