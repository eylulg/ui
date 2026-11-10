import { Check, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Header,
  Keyboard,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Separator,
  SubmenuTrigger,
  Text,
  composeRenderProps,
  type MenuItemProps,
  type MenuProps,
  type MenuSectionProps,
  type MenuTriggerProps,
  type PopoverProps,
} from 'react-aria-components';
import {
  listItem,
  listSectionHeader,
  listSeparator,
  popoverSurface,
} from '../../internal/surfaces';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';

export type DropdownMenuProps = MenuTriggerProps;

/**
 * Wraps a trigger and a DropdownMenuContent. Opens on press, Enter, Space or
 * the arrow keys. Inside, arrow keys move, typing jumps to a matching item,
 * Enter activates and Escape closes and returns focus to the trigger.
 */
export function DropdownMenu(props: DropdownMenuProps) {
  return <MenuTrigger {...props} />;
}

export interface DropdownMenuContentProps<T extends object> extends MenuProps<T> {
  placement?: PopoverProps['placement'];
  /** Class for the floating surface. */
  popoverClassName?: string;
}

export function DropdownMenuContent<T extends object>({
  placement = 'bottom start',
  popoverClassName,
  className,
  ...props
}: DropdownMenuContentProps<T>) {
  return (
    <Popover
      placement={placement}
      offset={4}
      className={cx(popoverSurface, 'min-w-48', popoverClassName)}
    >
      <Menu
        {...props}
        className={composeRenderProps(className, (consumer) =>
          cx('max-h-[inherit] outline-none', consumer),
        )}
      />
    </Popover>
  );
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

export function DropdownMenuItem<T extends object = object>({
  children,
  icon: Icon,
  description,
  shortcut,
  isDanger = false,
  className,
  ...props
}: DropdownMenuItemProps<T>) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <MenuItem
      {...props}
      textValue={textValue}
      className={composeRenderProps(className, (consumer) =>
        cx(listItem, isDanger && 'text-error', consumer),
      )}
    >
      {({ isSelected, selectionMode, hasSubmenu }) => (
        <>
          {selectionMode !== 'none' && (
            <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
              {isSelected && <Check className="size-4 text-fg-brand" />}
            </span>
          )}
          {Icon && (
            <Icon
              aria-hidden="true"
              className={cx('size-4 shrink-0', isDanger ? 'text-fg-error' : 'text-fg-tertiary')}
            />
          )}
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
          {shortcut && (
            <Keyboard className="ml-4 font-mono text-xs text-tertiary">{shortcut}</Keyboard>
          )}
          {hasSubmenu && <ChevronRight aria-hidden="true" className="size-4 text-fg-tertiary" />}
        </>
      )}
    </MenuItem>
  );
}

export interface DropdownMenuSectionProps<T extends object> extends Omit<
  MenuSectionProps<T>,
  'children'
> {
  /** Visible group heading, also the group's accessible name. */
  title?: ReactNode;
  children: ReactNode;
}

/**
 * Groups items under an optional heading. Set `selectionMode="multiple"` for
 * checkbox items or `"single"` for a radio style group.
 */
export function DropdownMenuSection<T extends object>({
  title,
  children,
  className,
  ...props
}: DropdownMenuSectionProps<T>) {
  return (
    <MenuSection {...props} className={cx('flex flex-col', className)}>
      {title && <Header className={listSectionHeader}>{title}</Header>}
      {children}
    </MenuSection>
  );
}

export function DropdownMenuSeparator() {
  return <Separator className={listSeparator} />;
}

/** Nests a submenu: pass a DropdownMenuItem and a DropdownMenuContent. */
export const DropdownSubmenu = SubmenuTrigger;
