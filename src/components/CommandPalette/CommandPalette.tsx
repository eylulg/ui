import { useEffect, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { Key, MenuItemProps, MenuSectionProps } from 'react-aria-components';
import { createLazyModule } from '../../internal/lazyModule';
import type { IconComponent } from '../../internal/types';

export interface CommandPalettePage {
  /** Identifies the page. The search text resets when it changes. */
  id: string;
  /** Shown before the search field and announced when the page opens, such as "Change status". */
  title: string;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** Called with the id of the chosen command. The palette closes afterwards unless `closeOnAction` is false. */
  onAction?: (key: Key) => void;
  /**
   * Whether choosing a command closes the palette. Set it to false when some
   * commands open a sub page: keep the page in your state, render its commands
   * as `children`, and call `onOpenChange(false)` yourself after a final command.
   */
  closeOnAction?: boolean;
  /** Called with the search text as the user types. */
  onSearchChange?: (value: string) => void;
  /**
   * The sub page being shown, or nothing for the top level. While it is set the
   * palette shows its title and a back button, and Backspace in an empty
   * search field calls `onBack`.
   */
  page?: CommandPalettePage;
  /** Go up one level: Backspace in an empty search field, or the back button. */
  onBack?: () => void;
  /** Accessible name of the back button. */
  backLabel?: string;
  /** Accessible name of the dialog. */
  label?: string;
  /** Accessible name and placeholder of the search field. */
  searchLabel?: string;
  placeholder?: string;
  /** Shown when nothing matches the search. */
  emptyState?: ReactNode;
  /** CommandGroup and CommandItem elements. */
  children: ReactNode;
}

export interface CommandGroupProps extends Omit<MenuSectionProps<object>, 'children'> {
  /** Visible heading, also the group's accessible name. */
  heading: ReactNode;
  children: ReactNode;
}

export interface CommandItemProps extends Omit<MenuItemProps, 'children'> {
  children: ReactNode;
  /** A lucide-react style component, or an element such as `<Inbox />`. */
  icon?: IconComponent | ReactNode;
  /** Secondary line. It joins the accessible name after the label, so the name contains the visible text. */
  description?: ReactNode;
  /** Keys of the shortcut that runs this command outside the palette, such as ['⌘', 'N']. */
  shortcut?: string[];
}

const palette = /*#__PURE__*/ createLazyModule(() => import('./CommandPaletteOverlay'));

/**
 * A searchable list of commands in a modal, opened with Cmd or Ctrl and K
 * through useCommandPaletteShortcut. Focus starts in the search field, typing
 * filters every group, arrow keys move through matches, Enter runs a command
 * and closes the palette, and Escape closes it. Focus then returns to where it
 * was before opening.
 *
 * The palette's code loads the first time `isOpen` becomes true. Pressing Cmd
 * or Ctrl with useCommandPaletteShortcut starts the download ahead of the K.
 */
export function CommandPalette(props: CommandPaletteProps) {
  const loaded = palette.useModule(props.isOpen);
  return loaded ? <loaded.CommandPalette {...props} /> : null;
}

export function CommandGroup(props: CommandGroupProps) {
  const loaded = palette.get();
  return loaded ? <loaded.CommandGroup {...props} /> : null;
}

export function CommandItem(props: CommandItemProps) {
  const loaded = palette.get();
  return loaded ? <loaded.CommandItem {...props} /> : null;
}

/**
 * Toggles the palette with Cmd+K on macOS or Ctrl+K elsewhere. Pass the state
 * setter of `isOpen`. `key` changes the letter.
 */
export function useCommandPaletteShortcut(setOpen: Dispatch<SetStateAction<boolean>>, key = 'k') {
  useEffect(() => {
    function toggle(open: boolean) {
      return !open;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey)) return;
      palette.preload();
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      event.preventDefault();
      setOpen(toggle);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setOpen, key]);
}
