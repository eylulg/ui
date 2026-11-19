import type { ReactNode, Ref } from 'react';
import {
  Switch as AriaSwitch,
  composeRenderProps,
  type SwitchProps as AriaSwitchProps,
} from 'react-aria-components';
import { cx } from '../../utils/cx';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends Omit<AriaSwitchProps, 'children'> {
  children?: ReactNode;
  hint?: ReactNode;
  size?: SwitchSize;
  /** Ref to the native checkbox input that holds focus. Same as `inputRef`, which still works. */
  ref?: Ref<HTMLInputElement>;
}

const sizes: Record<SwitchSize, { track: string; thumb: string }> = {
  sm: { track: 'h-5 w-9', thumb: 'size-4 group-data-selected:translate-x-4' },
  md: { track: 'h-6 w-11', thumb: 'size-5 group-data-selected:translate-x-5' },
};

export function Switch({
  children,
  hint,
  size = 'md',
  ref,
  inputRef,
  className,
  ...props
}: SwitchProps) {
  return (
    <AriaSwitch
      {...props}
      inputRef={ref ?? inputRef}
      className={composeRenderProps(className, (consumer) =>
        cx(
          'group flex cursor-pointer items-start gap-3 text-sm text-secondary',
          'data-disabled:cursor-not-allowed data-disabled:text-disabled',
          consumer,
        ),
      )}
    >
      <span
        aria-hidden='true'
        className={cx(
          'flex shrink-0 items-center rounded-full bg-tertiary p-0.5 transition-colors',
          'group-data-selected:bg-brand-solid',
          'group-data-disabled:bg-disabled',
          'group-data-focus-visible:outline-2 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-focus',
          'ring-1 ring-control ring-inset group-data-selected:ring-transparent',
          sizes[size].track,
        )}
      >
        <span
          className={cx(
            'rounded-full bg-white shadow-sm transition-transform group-data-selected:bg-fg-on-solid motion-reduce:transition-none',
            sizes[size].thumb,
          )}
        />
      </span>
      {(children || hint) && (
        <span className='flex flex-col'>
          {children && <span className='font-medium'>{children}</span>}
          {hint && <span className='text-tertiary'>{hint}</span>}
        </span>
      )}
    </AriaSwitch>
  );
}
