import type { ReactNode } from 'react';
import {
  Label,
  ProgressBar as AriaProgressBar,
  composeRenderProps,
  type ProgressBarProps as AriaProgressBarProps,
} from 'react-aria-components';
import { cx } from '../../utils/cx';

export type ProgressBarTone = 'brand' | 'success' | 'warning' | 'error';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps extends Omit<AriaProgressBarProps, 'children'> {
  /** Visible label. If omitted, pass `aria-label` instead. */
  label?: ReactNode;
  /** Hide the value text, for example "40%". */
  hideValue?: boolean;
  tone?: ProgressBarTone;
  size?: ProgressBarSize;
}

const tones: Record<ProgressBarTone, string> = {
  brand: 'bg-brand-solid',
  success: 'bg-fg-success',
  warning: 'bg-fg-warning',
  error: 'bg-fg-error',
};

const sizes: Record<ProgressBarSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const track = 'relative w-full overflow-hidden rounded-full bg-tertiary';
const indeterminateFill = 'h-full w-full animate-pulse rounded-full motion-reduce:animate-none';
const fill = 'h-full rounded-full transition-[width] motion-reduce:transition-none';
const root = 'flex w-full flex-col gap-1.5';
const header = 'flex items-center justify-between gap-3 text-sm';

/**
 * Shows progress of a task. React Aria sets role="progressbar" and the value
 * attributes; `valueLabel` overrides the announced and visible value text.
 * Indeterminate bars omit the value. Tone is a colour hint only, so state
 * the outcome in the label too.
 */
export function ProgressBar({
  label,
  hideValue = false,
  tone = 'brand',
  size = 'md',
  className,
  ...props
}: ProgressBarProps) {
  return (
    <AriaProgressBar
      {...props}
      className={composeRenderProps(className, (consumer) => cx(root, consumer))}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          {(label || (!hideValue && !isIndeterminate)) && (
            <div className={header}>
              {label && <Label className="font-medium text-secondary">{label}</Label>}
              {!hideValue && !isIndeterminate && (
                <span className="ml-auto font-data text-tertiary tabular-nums">{valueText}</span>
              )}
            </div>
          )}
          <div className={cx(track, sizes[size])}>
            {isIndeterminate ? (
              <div className={cx(indeterminateFill, tones[tone])} />
            ) : (
              <div className={cx(fill, tones[tone])} style={{ width: `${percentage ?? 0}%` }} />
            )}
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
