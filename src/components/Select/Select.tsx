import { Check, ChevronDown } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import {
  Button as AriaButton,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  composeRenderProps,
  type ListBoxItemProps,
  type SelectProps as AriaSelectProps,
} from 'react-aria-components';
import { FieldErrorMessage, FieldHint, FieldLabel } from '../../internal/Field';
import { focusRing } from '../../internal/focusRing';
import { cx } from '../../utils/cx';

export interface SelectProps<T extends object> extends Omit<
  AriaSelectProps<T, 'single'>,
  'children' | 'selectionMode'
> {
  label?: ReactNode;
  hint?: ReactNode;
  errorMessage?: string;
  placeholder?: string;
  /** Items for dynamic collections. Pair with a render function as children. */
  items?: Iterable<T>;
  children: ReactNode | ((item: T) => ReactNode);
  /** Ref to the trigger button, for example to move focus to the select. */
  ref?: Ref<HTMLButtonElement>;
}

export function Select<T extends object>({
  label,
  hint,
  errorMessage,
  placeholder = 'Select an option',
  items,
  children,
  ref,
  className,
  isInvalid,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      placeholder={placeholder}
      isInvalid={isInvalid ?? Boolean(errorMessage)}
      className={composeRenderProps(className, (consumer) =>
        cx('group flex flex-col gap-1.5', consumer),
      )}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <AriaButton
        ref={ref}
        className={cx(
          'flex h-control-md w-full cursor-pointer items-center gap-2 rounded-md border border-control bg-primary px-3 text-left text-md text-primary shadow-xs',
          'data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled',
          'group-data-invalid:border-error',
          focusRing,
        )}
      >
        <SelectValue className="flex-1 truncate data-placeholder:text-placeholder" />
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-fg-tertiary" />
      </AriaButton>
      {hint && !errorMessage && <FieldHint>{hint}</FieldHint>}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
      <Popover
        offset={4}
        className="w-(--trigger-width) overflow-auto rounded-md border border-subtle bg-elevated p-1 shadow-lg outline-none"
      >
        <ListBox items={items} className="max-h-72 outline-none">
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export type SelectItemProps = ListBoxItemProps;

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <ListBoxItem
      {...props}
      textValue={textValue}
      className={composeRenderProps(className, (consumer) =>
        cx(
          'flex cursor-pointer items-center gap-2 rounded-sm px-item-x py-item-y text-md text-primary outline-none',
          'data-disabled:cursor-not-allowed data-disabled:text-disabled data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus data-focused:bg-hover',
          consumer,
        ),
      )}
    >
      {composeRenderProps(children, (content, { isSelected }) => (
        <>
          <span className="flex-1 truncate">{content}</span>
          {isSelected && <Check aria-hidden="true" className="size-4 shrink-0 text-fg-brand" />}
        </>
      ))}
    </ListBoxItem>
  );
}
