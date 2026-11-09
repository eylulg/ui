import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  ComboBox,
  Group,
  Header,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  Text,
  composeRenderProps,
  type ComboBoxProps,
  type ListBoxItemProps,
  type ListBoxSectionProps,
} from 'react-aria-components';
import { FieldErrorMessage, FieldHint, FieldLabel } from '../../internal/Field';
import { listItem, listSectionHeader, popoverSurface } from '../../internal/surfaces';
import { cx } from '../../utils/cx';
import { Spinner } from '../Spinner/Spinner';

export interface ComboboxProps<T extends object> extends Omit<ComboBoxProps<T>, 'children'> {
  label?: ReactNode;
  hint?: ReactNode;
  errorMessage?: string;
  placeholder?: string;
  /** Shows a spinner in the field while results load, for example from useAsyncList. */
  isLoading?: boolean;
  /** Announced while loading. */
  loadingLabel?: string;
  /** Shown in the popover when nothing matches. Defaults to "No results". */
  emptyState?: ReactNode;
  children: ReactNode | ((item: T) => ReactNode);
}

const field =
  'flex h-control-md items-center gap-2 rounded-md border border-control bg-primary pr-1 pl-3 shadow-xs transition-shadow data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-focus-within:border-brand data-focus-within:ring-4 data-focus-within:ring-focus/25 data-invalid:border-error data-invalid:data-focus-within:border-error data-invalid:data-focus-within:ring-error/25';
const input =
  'min-w-0 flex-1 bg-transparent text-md text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed disabled:text-disabled';
const toggle =
  'flex size-control-xs shrink-0 cursor-pointer items-center justify-center rounded-sm text-fg-tertiary outline-none data-focus-visible:outline-2 data-focus-visible:outline-focus data-hovered:bg-hover';
const emptyText = 'px-item-x py-item-y text-sm text-tertiary';

/**
 * A text field with a filtered list of suggestions. Works with static items,
 * with `items` and a render function, and with async data: pass `items`,
 * `inputValue` and `onInputChange` from useAsyncList and set `isLoading`
 * while a request is in flight.
 */
export function Combobox<T extends object>({
  label,
  hint,
  errorMessage,
  placeholder,
  isLoading = false,
  loadingLabel = 'Loading results',
  emptyState = 'No results',
  children,
  className,
  isInvalid,
  ...props
}: ComboboxProps<T>) {
  function renderEmptyState() {
    if (isLoading) return <div className={emptyText}>{loadingLabel}</div>;
    return <div className={emptyText}>{emptyState}</div>;
  }

  return (
    <ComboBox
      {...props}
      allowsEmptyCollection
      isInvalid={isInvalid ?? Boolean(errorMessage)}
      className={composeRenderProps(className, (consumer) => cx('flex flex-col gap-1.5', consumer))}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Group className={field}>
        <Input placeholder={placeholder} className={input} />
        {isLoading && <Spinner size="sm" label={loadingLabel} />}
        <AriaButton className={toggle}>
          <ChevronDown aria-hidden="true" className="size-4" />
        </AriaButton>
      </Group>
      {hint && !errorMessage && <FieldHint>{hint}</FieldHint>}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
      <Popover offset={4} className={cx(popoverSurface, 'w-(--trigger-width)')}>
        <ListBox renderEmptyState={renderEmptyState} className="max-h-72 outline-none">
          {children}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}

export interface ComboboxItemProps extends Omit<ListBoxItemProps, 'children'> {
  children: ReactNode;
  /** Secondary line under the label. */
  description?: ReactNode;
}

export function ComboboxItem({ children, description, className, ...props }: ComboboxItemProps) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <ListBoxItem
      {...props}
      textValue={textValue}
      className={composeRenderProps(className, (consumer) =>
        cx(listItem, 'data-selected:font-medium', consumer),
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <Text slot="label" className="truncate">
          {children}
        </Text>
        {description && (
          <Text slot="description" className="truncate text-xs text-tertiary">
            {description}
          </Text>
        )}
      </span>
    </ListBoxItem>
  );
}

export interface ComboboxSectionProps<T extends object> extends Omit<
  ListBoxSectionProps<T>,
  'children'
> {
  /** Visible group heading, also the group's accessible name. */
  title?: ReactNode;
  children: ReactNode;
}

export function ComboboxSection<T extends object>({
  title,
  children,
  className,
  ...props
}: ComboboxSectionProps<T>) {
  return (
    <ListBoxSection {...props} className={cx('flex flex-col', className)}>
      {title && <Header className={listSectionHeader}>{title}</Header>}
      {children}
    </ListBoxSection>
  );
}
