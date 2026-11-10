import type { ReactNode, Ref } from 'react';
import {
  Group,
  Input as AriaInput,
  TextField,
  composeRenderProps,
  type TextFieldProps,
} from 'react-aria-components';
import { FieldErrorMessage, FieldHint, FieldLabel } from '../../internal/Field';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';

export type InputSize = 'sm' | 'md';

export interface InputProps extends Omit<TextFieldProps, 'children'> {
  /** Visible label. If omitted, pass `aria-label` instead. */
  label?: ReactNode;
  /** Helper text below the field, linked with aria-describedby. */
  hint?: ReactNode;
  /** Error text. Setting it also marks the field invalid. */
  errorMessage?: string;
  placeholder?: string;
  size?: InputSize;
  iconLeading?: IconComponent;
  iconTrailing?: IconComponent;
  /** Class applied to the native input element. */
  inputClassName?: string;
  /** Ref to the native input element, not the wrapper. */
  ref?: Ref<HTMLInputElement>;
}

const sizes: Record<InputSize, string> = {
  sm: 'h-control-sm text-sm',
  md: 'h-control-md text-md',
};

export function Input({
  label,
  hint,
  errorMessage,
  placeholder,
  size = 'md',
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  inputClassName,
  ref,
  className,
  isInvalid,
  ...props
}: InputProps) {
  return (
    <TextField
      {...props}
      isInvalid={isInvalid ?? Boolean(errorMessage)}
      className={composeRenderProps(className, (consumer) => cx('flex flex-col gap-1.5', consumer))}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Group
        className={cx(
          'flex items-center gap-2 rounded-md border border-control bg-primary px-3 shadow-xs transition-shadow',
          'data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled',
          'data-invalid:border-error',
          'data-focus-within:border-brand data-focus-within:ring-4 data-focus-within:ring-focus/25',
          'data-invalid:data-focus-within:border-error data-invalid:data-focus-within:ring-error/25',
          sizes[size],
        )}
      >
        {IconLeading && (
          <IconLeading aria-hidden="true" className="size-4 shrink-0 text-fg-tertiary" />
        )}
        <AriaInput
          ref={ref}
          placeholder={placeholder}
          className={cx(
            'min-w-0 flex-1 bg-transparent text-primary outline-none placeholder:text-placeholder',
            'disabled:cursor-not-allowed disabled:text-disabled',
            inputClassName,
          )}
        />
        {IconTrailing && (
          <IconTrailing aria-hidden="true" className="size-4 shrink-0 text-fg-tertiary" />
        )}
      </Group>
      {hint && !errorMessage && <FieldHint>{hint}</FieldHint>}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
    </TextField>
  );
}
