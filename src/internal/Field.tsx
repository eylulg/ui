import type { ReactNode } from 'react';
import { FieldError, Label, Text } from 'react-aria-components';
import { cx } from '../utils/cx';

export function FieldLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <Label className={cx('text-sm font-medium text-secondary', className)}>{children}</Label>;
}

export function FieldHint({ children }: { children: ReactNode }) {
  return (
    <Text slot="description" className="text-sm text-tertiary">
      {children}
    </Text>
  );
}

export function FieldErrorMessage({ children }: { children: ReactNode }) {
  return <FieldError className="text-sm text-error">{children}</FieldError>;
}

/** Shared control surface for text inputs, textareas and select triggers. */
export const controlBase = cx(
  'w-full rounded-md border border-control bg-primary text-md text-primary shadow-xs transition-shadow',
  'placeholder:text-placeholder',
  'data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled',
  'data-invalid:border-error',
  'outline-none data-focused:border-brand data-focused:ring-4 data-focused:ring-focus/25',
  'data-invalid:data-focused:border-error data-invalid:data-focused:ring-error/25',
);
