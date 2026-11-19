import { useEffect, useSyncExternalStore } from 'react';
import type { TextSize } from '../styles/themes/variants';
import { textSizeStorageKey } from './themeScript';

export interface UseTextSize {
  /** The size in use: the visitor's choice, or the theme variant's default. */
  size: TextSize;
  /** Applies and remembers a choice. Every TextSizeToggle and useTextSize in the page updates. */
  setSize: (size: TextSize) => void;
}

const listeners = new Set<() => void>();
/** Holds the choice for this page when storage is blocked (private mode, sandboxed iframes). */
let unsaved: TextSize | null = null;

function isTextSize(value: unknown): value is TextSize {
  return value === 'compact' || value === 'default';
}

function readStored(): TextSize | null {
  if (unsaved) return unsaved;
  try {
    const stored = window.localStorage.getItem(textSizeStorageKey);
    return isTextSize(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** The variant's default, which its CSS file declares as --ui-text-size. */
function variantDefault(): TextSize {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--ui-text-size');
  return value.trim() === 'compact' ? 'compact' : 'default';
}

function readSize(): TextSize {
  return readStored() ?? variantDefault();
}

function serverSize(): TextSize {
  return 'default';
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function writeSize(size: TextSize) {
  try {
    window.localStorage.setItem(textSizeStorageKey, size);
    unsaved = null;
  } catch {
    unsaved = size;
  }
  document.documentElement.setAttribute('data-ui-text', size);
  for (const listener of listeners) listener();
}

/**
 * The page's text size: compact or default. Until the visitor chooses, it is
 * the default of the theme variant. A choice writes `data-ui-text` on <html>,
 * which theme.css turns into the matching type scale, and is remembered in
 * localStorage. Pair it with themeInitScript in <head> so the first paint
 * already has the stored size.
 */
export function useTextSize(): UseTextSize {
  const size = useSyncExternalStore(subscribe, readSize, serverSize);

  useEffect(() => {
    const stored = readStored();
    if (stored) document.documentElement.setAttribute('data-ui-text', stored);
  }, [size]);

  return { size, setSize: writeSize };
}
