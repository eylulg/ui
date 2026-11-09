import { Check, Minus } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Checkbox as AriaCheckbox,
  composeRenderProps,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components';
import { cx } from '../../utils/cx';

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'children'> {
  /** Visible label. If omitted, pass `aria-label`. */
  children?: ReactNode;
  /** Supporting text under the label. */
  hint?: ReactNode;
}

export function Checkbox({ children, hint, className, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox
      {...props}
      className={composeRenderProps(className, (consumer) =>
        cx(
          'group flex cursor-pointer items-start gap-2.5 text-sm text-secondary',
          'data-disabled:cursor-not-allowed data-disabled:text-disabled',
          consumer,
        ),
      )}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          <span
            className={cx(
              'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-xs border border-control bg-primary text-fg-on-solid transition-colors',
              'group-data-selected:border-brand group-data-selected:bg-brand-solid',
              'group-data-indeterminate:border-brand group-data-indeterminate:bg-brand-solid',
              'group-data-invalid:border-error',
              'group-data-disabled:border-disabled group-data-disabled:bg-disabled group-data-disabled:text-fg-disabled',
              'group-data-focus-visible:outline-2 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-focus',
            )}
          >
            {isIndeterminate ? (
              <Minus aria-hidden="true" className="size-3" strokeWidth={3} />
            ) : isSelected ? (
              <Check aria-hidden="true" className="size-3" strokeWidth={3} />
            ) : null}
          </span>
          {(children || hint) && (
            <span className="flex flex-col">
              {children && <span className="font-medium">{children}</span>}
              {hint && <span className="text-tertiary">{hint}</span>}
            </span>
          )}
        </>
      )}
    </AriaCheckbox>
  );
}
