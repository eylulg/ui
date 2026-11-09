import type { ReactNode } from 'react';
import {
  TextArea as AriaTextArea,
  TextField,
  composeRenderProps,
  type TextFieldProps,
} from 'react-aria-components';
import { FieldErrorMessage, FieldHint, FieldLabel, controlBase } from '../../internal/Field';
import { cx } from '../../utils/cx';

export interface TextareaProps extends Omit<TextFieldProps, 'children'> {
  label?: ReactNode;
  hint?: ReactNode;
  errorMessage?: string;
  placeholder?: string;
  /** Visible rows before scrolling. */
  rows?: number;
  /** Allow the user to resize vertically. */
  resizable?: boolean;
  textareaClassName?: string;
}

export function Textarea({
  label,
  hint,
  errorMessage,
  placeholder,
  rows = 4,
  resizable = true,
  textareaClassName,
  className,
  isInvalid,
  ...props
}: TextareaProps) {
  return (
    <TextField
      {...props}
      isInvalid={isInvalid ?? Boolean(errorMessage)}
      className={composeRenderProps(className, (consumer) => cx('flex flex-col gap-1.5', consumer))}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <AriaTextArea
        rows={rows}
        placeholder={placeholder}
        className={composeRenderProps(textareaClassName, (consumer) =>
          cx(controlBase, 'px-3 py-2', resizable ? 'resize-y' : 'resize-none', consumer),
        )}
      />
      {hint && !errorMessage && <FieldHint>{hint}</FieldHint>}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
    </TextField>
  );
}
