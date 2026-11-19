import type { ReactNode } from 'react';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from 'react-aria-components';
import { FieldErrorMessage, FieldHint, FieldLabel } from '../../internal/Field';
import { cx } from '../../utils/cx';

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children'> {
  label?: ReactNode;
  hint?: ReactNode;
  errorMessage?: string;
  children: ReactNode;
}

export function RadioGroup({
  label,
  hint,
  errorMessage,
  children,
  className,
  isInvalid,
  orientation = 'vertical',
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup
      {...props}
      orientation={orientation}
      isInvalid={isInvalid ?? Boolean(errorMessage)}
      className={composeRenderProps(className, (consumer) => cx('flex flex-col gap-2', consumer))}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <div
        className={cx('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}
      >
        {children}
      </div>
      {hint && !errorMessage && <FieldHint>{hint}</FieldHint>}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
    </AriaRadioGroup>
  );
}

export interface RadioProps extends Omit<AriaRadioProps, 'children'> {
  children?: ReactNode;
  hint?: ReactNode;
}

export function Radio({ children, hint, className, ...props }: RadioProps) {
  return (
    <AriaRadio
      {...props}
      className={composeRenderProps(className, (consumer) =>
        cx(
          'group flex cursor-pointer items-start gap-2.5 text-sm text-secondary',
          'data-disabled:cursor-not-allowed data-disabled:text-disabled',
          consumer,
        ),
      )}
    >
      <span
        aria-hidden='true'
        className={cx(
          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-control bg-primary transition-colors',
          'group-data-selected:border-brand group-data-selected:bg-brand-solid',
          'group-data-invalid:border-error',
          'group-data-disabled:border-disabled group-data-disabled:bg-disabled',
          'group-data-focus-visible:outline-2 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-focus',
        )}
      >
        <span className='size-1.5 rounded-full bg-white opacity-0 group-data-selected:opacity-100' />
      </span>
      {(children || hint) && (
        <span className='flex flex-col'>
          {children && <span className='font-medium'>{children}</span>}
          {hint && <span className='text-tertiary'>{hint}</span>}
        </span>
      )}
    </AriaRadio>
  );
}
