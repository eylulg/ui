import { useContext, type ReactNode } from 'react';
import {
  MenuTrigger,
  OverlayTriggerStateContext,
  type MenuItemProps,
  type MenuProps,
  type MenuSectionProps,
  type MenuTriggerProps,
  type PopoverProps,
  type SubmenuTriggerProps,
} from 'react-aria-components';
import { createLazyModule } from '../../internal/lazyModule';
import { PreloadOnIntent } from '../../internal/PreloadOnIntent';
import type { IconComponent } from '../../internal/types';

export type DropdownMenuProps = MenuTriggerProps;

export interface DropdownMenuContentProps<T extends object> extends MenuProps<T> {
  placement?: PopoverProps['placement'];
  /** Class for the floating surface. */
  popoverClassName?: string;
}

export interface DropdownMenuItemProps<T extends object = object> extends Omit<
  MenuItemProps<T>,
  'children'
> {
  children: ReactNode;
  /** Leading icon component, for example from lucide-react. */
  icon?: IconComponent;
  /**
   * Secondary line under the label. It becomes part of the item's accessible
   * name, which then starts with the label, so the name always contains the
   * visible text (WCAG 2.5.3).
   */
  description?: ReactNode;
  /** Keyboard shortcut hint, such as "⌘K". Display only. */
  shortcut?: string;
  /** Destructive styling, for delete and similar actions. */
  isDanger?: boolean;
}

export interface DropdownMenuSectionProps<T extends object> extends Omit<
  MenuSectionProps<T>,
  'children'
> {
  /** Visible group heading, also the group's accessible name. */
  title?: ReactNode;
  children: ReactNode;
}

const menu = /*#__PURE__*/ createLazyModule(() => import('./DropdownMenuParts'));

/**
 * Wraps a trigger and a DropdownMenuContent. Opens on press, Enter, Space or
 * the arrow keys. Inside, arrow keys move, typing jumps to a matching item,
 * Enter activates and Escape closes and returns focus to the trigger.
 *
 * The menu's code loads the first time it opens, or earlier when the trigger
 * is hovered or focused, so the very first open can take a moment on a slow
 * connection. The trigger works at once.
 */
export function DropdownMenu(props: DropdownMenuProps) {
  return (
    <PreloadOnIntent module={menu}>
      <MenuTrigger {...props} />
    </PreloadOnIntent>
  );
}

export function DropdownMenuContent<T extends object>(props: DropdownMenuContentProps<T>) {
  const triggerState = useContext(OverlayTriggerStateContext);
  const parts = menu.useModule(triggerState?.isOpen ?? false);
  return parts ? <parts.DropdownMenuContent {...props} /> : null;
}

export function DropdownMenuItem<T extends object = object>(props: DropdownMenuItemProps<T>) {
  const parts = menu.get();
  return parts ? <parts.DropdownMenuItem {...props} /> : null;
}

/**
 * Groups items under an optional heading. Set `selectionMode="multiple"` for
 * checkbox items or `"single"` for a radio style group.
 */
export function DropdownMenuSection<T extends object>(props: DropdownMenuSectionProps<T>) {
  const parts = menu.get();
  return parts ? <parts.DropdownMenuSection {...props} /> : null;
}

export function DropdownMenuSeparator() {
  const parts = menu.get();
  return parts ? <parts.DropdownMenuSeparator /> : null;
}

/** Nests a submenu: pass a DropdownMenuItem and a DropdownMenuContent. */
export function DropdownSubmenu(props: SubmenuTriggerProps) {
  const parts = menu.get();
  return parts ? <parts.DropdownSubmenu {...props} /> : null;
}
