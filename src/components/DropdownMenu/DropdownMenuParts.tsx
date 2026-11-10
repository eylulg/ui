import { Check, ChevronRight } from 'lucide-react';
import {
  Header,
  Keyboard,
  Menu,
  MenuItem,
  MenuSection,
  Popover,
  Separator,
  SubmenuTrigger,
  Text,
  composeRenderProps,
} from 'react-aria-components';
import {
  listItem,
  listSectionHeader,
  listSeparator,
  popoverSurface,
} from '../../internal/surfaces';
import { cx } from '../../utils/cx';
import type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuSectionProps,
} from './DropdownMenu';

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

export const DropdownSubmenu = SubmenuTrigger;
