import { focusRing } from '../../internal/focusRing';
import { cx } from '../../utils/cx';

export type ButtonVariant =
  'primary' | 'secondary' | 'tertiary' | 'destructive' | 'destructive-outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-solid text-on-solid shadow-xs data-hovered:bg-brand-solid-hover data-pressed:bg-brand-solid-hover',
  secondary:
    'bg-primary text-secondary border border-default shadow-xs data-hovered:bg-hover data-hovered:text-primary data-pressed:bg-tertiary',
  tertiary:
    'bg-transparent text-secondary data-hovered:bg-hover data-hovered:text-primary data-pressed:bg-tertiary',
  destructive:
    'bg-error-solid text-on-solid shadow-xs data-hovered:bg-error-solid-hover data-pressed:bg-error-solid-hover',
  'destructive-outline':
    'bg-primary text-error border border-error shadow-xs data-hovered:bg-error-subtle data-pressed:bg-error-subtle',
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-control-sm gap-1.5 px-3 text-sm',
  md: 'h-control-md gap-2 px-control-x text-sm',
  lg: 'h-control-lg gap-2.5 px-5 text-md',
};

export const buttonBase = cx(
  'relative inline-flex touch-target cursor-pointer items-center justify-center rounded-md font-semibold whitespace-nowrap transition-colors select-none',
  'data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled data-disabled:shadow-none',
  focusRing,
);

export interface ButtonStylesOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Extra classes, merged so they win over the defaults. */
  className?: string;
}

/**
 * The class string of a Button, for a custom element that must look like one,
 * such as a framework link component that cannot be wrapped:
 *
 *   <Link href="/new" className={buttonStyles({ variant: 'secondary' })}>New</Link>
 *
 * The hover, pressed and disabled states key off React Aria's data attributes,
 * so use it on a React Aria element; on a plain element only the resting state shows.
 */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStylesOptions = {}): string {
  return cx(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}
