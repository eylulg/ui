import { ArrowLeft, Search } from 'lucide-react';
import {
  isValidElement,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type SetStateAction,
} from 'react';
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
import { IconButton } from '../IconButton/IconButton';
import { Kbd } from '../Kbd/Kbd';

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

const overlay =
  'fixed inset-0 z-50 flex items-start justify-center bg-overlay p-4 pt-[12vh] transition-opacity duration-150 data-entering:opacity-0 data-exiting:opacity-0 motion-reduce:transition-none';
const modal =
  'w-full max-w-xl overflow-hidden rounded-xl border border-subtle bg-elevated text-primary shadow-xl';
const searchRow =
  'flex h-control-lg items-center gap-2 border-b border-subtle px-4 data-focus-within:bg-secondary';
const searchInput =
  'min-w-0 flex-1 bg-transparent text-md text-primary outline-none placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden';
const list = 'max-h-[min(24rem,60vh)] overflow-auto p-1 outline-none';
const itemIcon = 'inline-flex shrink-0 text-fg-tertiary [&>svg]:size-4';
const empty = 'px-4 py-8 text-center text-sm text-tertiary';
const pageTitle = 'shrink-0 rounded-sm bg-tertiary px-2 py-0.5 text-xs font-medium text-secondary';

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
  closeOnAction = true,
  onSearchChange,
  page,
  onBack,
  backLabel = 'Back',
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
            <>
              <span role="status" className="sr-only">
                {page?.title}
              </span>
              <CommandSearch
                key={page?.id}
                close={close}
                onAction={onAction}
                closeOnAction={closeOnAction}
                onSearchChange={onSearchChange}
                page={page}
                onBack={onBack}
                backLabel={backLabel}
                searchLabel={searchLabel}
                placeholder={placeholder}
                emptyState={emptyState}
              >
                {children}
              </CommandSearch>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

interface CommandSearchProps extends Pick<
  CommandPaletteProps,
  | 'onAction'
  | 'onSearchChange'
  | 'page'
  | 'onBack'
  | 'searchLabel'
  | 'placeholder'
  | 'emptyState'
  | 'children'
> {
  close: () => void;
  closeOnAction: boolean;
  backLabel: string;
}

function CommandSearch({
  close,
  onAction,
  closeOnAction,
  onSearchChange,
  page,
  onBack,
  backLabel,
  searchLabel,
  placeholder,
  emptyState,
  children,
}: CommandSearchProps) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');

  // The search field, not the dialog, receives focus on open, as in the WAI combobox pattern.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleAction(key: Key) {
    onAction?.(key);
    if (closeOnAction) close();
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    onSearchChange?.(value);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Backspace' || search !== '' || !page) return;
    event.preventDefault();
    onBack?.();
  }

  function handleBack() {
    onBack?.();
  }

  function renderEmptyState() {
    return <div className={empty}>{emptyState}</div>;
  }

  return (
    <Autocomplete filter={contains} inputValue={search} onInputChange={handleSearchChange}>
      <SearchField aria-label={searchLabel} className={searchRow}>
        {page ? (
          <>
            <IconButton
              icon={ArrowLeft}
              aria-label={backLabel}
              variant="tertiary"
              size="sm"
              className="-ml-2 shrink-0"
              onPress={handleBack}
            />
            <span className={pageTitle}>{page.title}</span>
          </>
        ) : (
          <Search aria-hidden="true" className="size-5 shrink-0 text-fg-tertiary" />
        )}
        <Input
          ref={inputRef}
          // A combobox popup is exempt from axe scrollable-region-focusable, and keeps focus in the field.
          role="combobox"
          aria-expanded
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className={searchInput}
        />
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
  /** A lucide-react style component, or an element such as `<Inbox />`. */
  icon?: IconComponent | ReactNode;
  /** Secondary line. It joins the accessible name after the label, so the name contains the visible text. */
  description?: ReactNode;
  /** Keys of the shortcut that runs this command outside the palette, such as ['⌘', 'N']. */
  shortcut?: string[];
}

function isIconComponent(icon: IconComponent | ReactNode): icon is IconComponent {
  return (
    typeof icon === 'function' ||
    (typeof icon === 'object' && icon !== null && !isValidElement(icon) && '$$typeof' in icon)
  );
}

function renderIcon(icon: IconComponent | ReactNode) {
  if (isIconComponent(icon)) {
    const Icon = icon;
    return <Icon aria-hidden="true" className="size-4 shrink-0 text-fg-tertiary" />;
  }
  if (!icon) return null;
  return (
    <span aria-hidden="true" className={itemIcon}>
      {icon}
    </span>
  );
}

export function CommandItem({
  children,
  icon,
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
      {renderIcon(icon)}
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
      {shortcut && <Kbd keys={shortcut} decorative className="ml-4" />}
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
