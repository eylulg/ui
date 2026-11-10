import { useEffect, useState, type KeyboardEvent, type RefObject } from 'react';
import type { LazyModule } from './lazyModule';

/**
 * State for a menu trigger drawn as a plain button until the menu's code has
 * loaded. It preloads on hover and focus, and asks for the real menu on a
 * press or an arrow key. `loaded` is the module once it is both wanted and ready.
 */
export function useLazyMenuTrigger<M>(module: LazyModule<M>) {
  const [isRequested, setIsRequested] = useState(false);
  const loaded = module.useModule(isRequested);

  function handleClick() {
    setIsRequested(true);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    setIsRequested(true);
  }

  return {
    loaded: isRequested ? loaded : undefined,
    triggerProps: {
      'aria-haspopup': 'menu',
      'aria-expanded': isRequested,
      onPointerEnter: module.preload,
      onFocus: module.preload,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    } as const,
  };
}

/**
 * For the real menu that replaces the plain button: puts focus on its trigger
 * first, so closing the menu returns focus there, and then opens the menu.
 */
export function useOpenAfterFocus(triggerRef: RefObject<HTMLElement | null>) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    triggerRef.current?.focus();
    // One frame later, so the menu mounts after focus is on its trigger and can restore it on close.
    const frame = window.requestAnimationFrame(() => setIsOpen(true));
    return () => window.cancelAnimationFrame(frame);
  }, [triggerRef]);

  return [isOpen, setIsOpen] as const;
}
