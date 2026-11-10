import type { ReactNode, Ref } from 'react';
import {
  TextArea as AriaTextArea,
  TextField,
  composeRenderProps,
  type TextFieldProps,
} from 'react-aria-components';
import { FieldErrorMessage, FieldHint, FieldLabel, controlBase } from '../../internal/Field';
import { cx } from '../../utils/cx';

export type TextareaFont = 'sans' | 'data';

export interface TextareaProps extends Omit<
  TextFieldProps,
  'children' | 'autoCapitalize' | 'autoCorrect' | 'spellCheck'
> {
  label?: ReactNode;
  hint?: ReactNode;
  errorMessage?: string;
  placeholder?: string;
  /** Visible rows before scrolling. */
  rows?: number;
  /** Allow the user to resize vertically. */
  resizable?: boolean;
  textareaClassName?: string;
  /**
   * `data` uses the theme's data font (monospace in some variants), for code,
   * logs and generated output. The default is the interface font.
   */
  font?: TextareaFont;
  /** Turn off for identifiers, code and commands. */
  autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
  /** Turn off for code and technical text. */
  autoCorrect?: 'on' | 'off';
  /** Browser spell checking. Turn off for code. */
  spellCheck?: boolean;
  /** Ref to the native textarea element. */
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  label,
  hint,
  errorMessage,
  placeholder,
  rows = 4,
  resizable = true,
  textareaClassName,
  font = 'sans',
  autoCapitalize,
  autoCorrect,
  spellCheck,
  ref,
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
        ref={ref}
        rows={rows}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
        placeholder={placeholder}
        className={composeRenderProps(textareaClassName, (consumer) =>
          cx(
            controlBase,
            'px-3 py-2',
            font === 'data' && 'font-data',
            resizable ? 'resize-y' : 'resize-none',
            consumer,
          ),
        )}
      />
      {hint && !errorMessage && <FieldHint>{hint}</FieldHint>}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
    </TextField>
  );
}
