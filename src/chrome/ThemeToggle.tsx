import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';
import { ToggleButton, ToggleButtonGroup, type Key } from 'react-aria-components';
import { focusRing } from '../internal/focusRing';
import type { IconComponent } from '../internal/types';
import { cx } from '../utils/cx';
import { darkModeClass, themeStorageKey } from './themeScript';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface ThemeToggleProps {
  /** Accessible name of the group. */
  'aria-label'?: string;
  className?: string;
}

const options: Array<{ id: ThemePreference; label: string; icon: IconComponent }> = [
  { id: 'light', label: 'Light theme', icon: Sun },
  { id: 'dark', label: 'Dark theme', icon: Moon },
  { id: 'system', label: 'System theme', icon: Monitor },
];

const group = 'inline-flex items-center gap-0.5 rounded-md border border-default bg-primary p-0.5';
const button = [
  'inline-flex size-control-xs cursor-pointer items-center justify-center rounded-sm text-fg-tertiary transition-colors',
  'data-hovered:bg-hover data-hovered:text-fg-secondary',
  'data-selected:bg-tertiary data-selected:text-fg-primary',
  focusRing,
].join(' ');

const darkQuery = '(prefers-color-scheme: dark)';
const listeners = new Set<() => void>();
/** Holds the choice for this page when storage is blocked (private mode, sandboxed iframes). */
let unsaved: ThemePreference | null = null;

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
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

function serverPreference(): ThemePreference {
  return 'system';
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
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

function applyTheme(preference: ThemePreference) {
  const isDark =
    preference === 'dark' || (preference === 'system' && window.matchMedia(darkQuery).matches);
  const root = document.documentElement;
  root.classList.toggle(darkModeClass, isDark);
  root.style.colorScheme = isDark ? 'dark' : 'light';
}

/**
 * Light, dark and system theme switch. Writes the `dark-mode` class on
 * <html>, remembers the choice in localStorage and follows the operating
 * system while set to system. Pair it with themeInitScript in <head> so the
 * first paint already has the right theme.
 */
export function ThemeToggle({
  'aria-label': ariaLabel = 'Colour theme',
  className,
}: ThemeToggleProps) {
  const preference = useSyncExternalStore(subscribe, readPreference, serverPreference);

  useEffect(() => {
    applyTheme(preference);
    if (preference !== 'system') return;
    const media = window.matchMedia(darkQuery);
    function handleSystemChange() {
      applyTheme('system');
    }
    media.addEventListener('change', handleSystemChange);
    return () => media.removeEventListener('change', handleSystemChange);
  }, [preference]);

  function handleSelectionChange(keys: Set<Key>) {
    const [next] = keys;
    if (isPreference(next)) writePreference(next);
  }

  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[preference]}
      onSelectionChange={handleSelectionChange}
      className={cx(group, className)}
    >
      {options.map(({ id, label, icon: Icon }) => (
        <ToggleButton key={id} id={id} aria-label={label} className={button}>
          <Icon aria-hidden="true" className="size-4" />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
