import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export type SkeletonShape = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
  /** Number of text lines. Only used with shape="text". */
  lines?: number;
}

const shapes: Record<SkeletonShape, string> = {
  text: 'h-4 w-full rounded-xs',
  circle: 'size-10 rounded-full',
  rect: 'h-24 w-full rounded-md',
};

const block = 'animate-pulse bg-tertiary motion-reduce:animate-none';

/**
 * Placeholder shown while content loads. It is hidden from assistive
 * technology; mark the loading region with aria-busy and announce progress
 * there instead.
 */
export function Skeleton({ shape = 'text', lines = 1, className, ...props }: SkeletonProps) {
  if (shape === 'text' && lines > 1) {
    return (
      <div
        {...props}
        aria-hidden="true"
        data-shape={shape}
        className={cx('flex flex-col gap-2', className)}
      >
        {Array.from({ length: lines }, (_, index) => (
          <div key={index} className={cx(block, shapes.text, index === lines - 1 && 'w-3/5')} />
        ))}
      </div>
    );
  }
  return (
    <div
      {...props}
      aria-hidden="true"
      data-shape={shape}
      className={cx(block, shapes[shape], className)}
    />
  );
}
