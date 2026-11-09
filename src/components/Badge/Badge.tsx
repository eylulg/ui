import type { HTMLAttributes, ReactNode } from 'react';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';

export type BadgeColor = 'gray' | 'brand' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: BadgeSize;
  /** Shows a status dot before the label. */
  dot?: boolean;
  icon?: IconComponent;
  children: ReactNode;
}

const colors: Record<BadgeColor, { badge: string; dot: string }> = {
  gray: { badge: 'bg-tertiary text-secondary ring-default', dot: 'bg-fg-tertiary' },
  brand: {
    badge: 'bg-brand-subtle text-brand ring-brand-200 dark:ring-brand-800',
    dot: 'bg-fg-brand',
  },
  success: {
    badge: 'bg-success-subtle text-success ring-success-200 dark:ring-success-800',
    dot: 'bg-fg-success',
  },
  warning: {
    badge: 'bg-warning-subtle text-warning ring-warning-200 dark:ring-warning-800',
    dot: 'bg-fg-warning',
  },
  error: {
    badge: 'bg-error-subtle text-error ring-error-200 dark:ring-error-800',
    dot: 'bg-fg-error',
  },
};

const sizes: Record<BadgeSize, string> = {
  sm: 'h-5 gap-1 px-2 text-xs',
  md: 'h-6 gap-1.5 px-2.5 text-sm',
};

/** A static, non-interactive status label. */
export function Badge({
  color = 'gray',
  size = 'md',
  dot = false,
  icon: Icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      data-color={color}
      className={cx(
        'inline-flex items-center rounded-full font-medium whitespace-nowrap ring-1 ring-inset',
        colors[color].badge,
        sizes[size],
        className,
      )}
    >
      {dot && (
        <span aria-hidden="true" className={cx('size-1.5 rounded-full', colors[color].dot)} />
      )}
      {Icon && <Icon aria-hidden="true" className="size-3 shrink-0" />}
      {children}
    </span>
  );
}
