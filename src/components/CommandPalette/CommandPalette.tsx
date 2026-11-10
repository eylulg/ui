import { Search } from 'lucide-react';
import { useEffect, useRef, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import {
  Autocomplete,
  Dialog,
  Header,
  Input,
  Menu,
  MenuItem,
  MenuSection,
  Modal,
  ModalOverlay,
  SearchField,
  Text,
  composeRenderProps,
  useFilter,
  type Key,
  type MenuItemProps,
  type MenuSectionProps,
} from 'react-aria-components';
import { listItem, listSectionHeader } from '../../internal/surfaces';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';
import { Kbd } from '../Kbd/Kbd';

export interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** Called with the id of the chosen command, after which the palette closes. */
  onAction?: (key: Key) => void;
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

const overlay =
  'fixed inset-0 z-50 flex items-start justify-center bg-overlay p-4 pt-[12vh] transition-opacity duration-150 data-entering:opacity-0 data-exiting:opacity-0 motion-reduce:transition-none';
const modal =
  'w-full max-w-xl overflow-hidden rounded-xl border border-subtle bg-elevated text-primary shadow-xl';
const searchRow =
  'flex h-control-lg items-center gap-2 border-b border-subtle px-4 data-focus-within:bg-secondary';
const searchInput =
  'min-w-0 flex-1 bg-transparent text-md text-primary outline-none placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden';
const list = 'max-h-[min(24rem,60vh)] overflow-auto p-1 outline-none';
const empty = 'px-4 py-8 text-center text-sm text-tertiary';

/**
 * A searchable list of commands in a modal, opened with Cmd or Ctrl and K
 * through useCommandPaletteShortcut. Focus starts in the search field, typing
 * filters every group, arrow keys move through matches, Enter runs a command
 * and closes the palette, and Escape closes it. Focus then returns to where it
 * was before opening.
 */
export function CommandPalette({
  isOpen,
  onOpenChange,
  onAction,
  label = 'Command palette',
  searchLabel = 'Search commands',
  placeholder = 'Type a command or search',
  emptyState = 'No results',
  children,
}: CommandPaletteProps) {
  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className={overlay}>
      <Modal className={modal}>
        <Dialog aria-label={label} className="outline-none">
          {({ close }) => (
            <CommandSearch
              close={close}
              onAction={onAction}
              searchLabel={searchLabel}
              placeholder={placeholder}
              emptyState={emptyState}
            >
              {children}
            </CommandSearch>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

interface CommandSearchProps extends Pick<
  CommandPaletteProps,
  'onAction' | 'searchLabel' | 'placeholder' | 'emptyState' | 'children'
> {
  close: () => void;
}

function CommandSearch({
  close,
  onAction,
  searchLabel,
  placeholder,
  emptyState,
  children,
}: CommandSearchProps) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const inputRef = useRef<HTMLInputElement>(null);

  // The search field, not the dialog, receives focus on open, as in the WAI combobox pattern.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleAction(key: Key) {
    onAction?.(key);
    close();
  }

  function renderEmptyState() {
    return <div className={empty}>{emptyState}</div>;
  }

  return (
    <Autocomplete filter={contains}>
      <SearchField aria-label={searchLabel} className={searchRow}>
        <Search aria-hidden="true" className="size-5 shrink-0 text-fg-tertiary" />
        <Input ref={inputRef} placeholder={placeholder} className={searchInput} />
      </SearchField>
      <Menu onAction={handleAction} renderEmptyState={renderEmptyState} className={list}>
        {children}
      </Menu>
    </Autocomplete>
  );
}

export interface CommandGroupProps extends Omit<MenuSectionProps<object>, 'children'> {
  /** Visible heading, also the group's accessible name. */
  heading: ReactNode;
  children: ReactNode;
}

export function CommandGroup({ heading, children, className, ...props }: CommandGroupProps) {
  return (
    <MenuSection {...props} className={cx('flex flex-col', className)}>
      <Header className={listSectionHeader}>{heading}</Header>
      {children}
    </MenuSection>
  );
}

export interface CommandItemProps extends Omit<MenuItemProps, 'children'> {
  children: ReactNode;
  icon?: IconComponent;
  /** Secondary line. It joins the accessible name after the label, so the name contains the visible text. */
  description?: ReactNode;
  /** Keys of the shortcut that runs this command outside the palette, such as ['⌘', 'N']. */
  shortcut?: string[];
}

export function CommandItem({
  children,
  icon: Icon,
  description,
  shortcut,
  className,
  ...props
}: CommandItemProps) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <MenuItem
      {...props}
      textValue={textValue}
      className={composeRenderProps(className, (consumer) => cx(listItem, consumer))}
    >
      {Icon && <Icon aria-hidden="true" className="size-4 shrink-0 text-fg-tertiary" />}
      {description ? (
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate">{children}</span>
          <span className="truncate text-xs text-tertiary">{description}</span>
        </span>
      ) : (
        <Text slot="label" className="min-w-0 flex-1 truncate">
          {children}
        </Text>
      )}
      {shortcut && <Kbd keys={shortcut} aria-hidden="true" className="ml-4" />}
    </MenuItem>
  );
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
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== key.toLowerCase()) {
        return;
      }
      event.preventDefault();
      setOpen(toggle);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setOpen, key]);
}
