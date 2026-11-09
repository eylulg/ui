import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';
import { Spinner } from '../../internal/Spinner';
import { focusRing } from '../../internal/focusRing';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<AriaButtonProps, 'isPending'> {
  /** Visual emphasis. Use one primary button per view. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the width and announces the pending state. */
  isLoading?: boolean;
  /** Icon rendered before the label. */
  iconLeading?: IconComponent;
  /** Icon rendered after the label. */
  iconTrailing?: IconComponent;
  /** Text announced while loading. Defaults to the button label. */
  loadingLabel?: string;
}

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-solid text-on-solid shadow-xs data-hovered:bg-brand-solid-hover data-pressed:bg-brand-solid-hover',
  secondary:
    'bg-primary text-secondary border border-default shadow-xs data-hovered:bg-hover data-hovered:text-primary data-pressed:bg-tertiary',
  tertiary:
    'bg-transparent text-secondary data-hovered:bg-hover data-hovered:text-primary data-pressed:bg-tertiary',
  destructive:
    'bg-error-solid text-on-solid shadow-xs data-hovered:bg-error-solid-hover data-pressed:bg-error-solid-hover',
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-sm',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2.5 px-5 text-md',
};

export const buttonBase = cx(
  'relative inline-flex cursor-pointer items-center justify-center rounded-md font-semibold whitespace-nowrap transition-colors select-none',
  'data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled data-disabled:shadow-none',
  focusRing,
);

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  loadingLabel,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      isPending={isLoading}
      data-variant={variant}
      data-size={size}
      className={composeRenderProps(className, (consumer) =>
        cx(buttonBase, buttonVariants[variant], buttonSizes[size], consumer),
      )}
    >
      {composeRenderProps(children, (content, { isPending }): ReactNode => (
        <>
          {isPending && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Spinner />
              {loadingLabel && <span className="sr-only">{loadingLabel}</span>}
            </span>
          )}
          <span className={cx('inline-flex items-center gap-[inherit]', isPending && 'opacity-0')}>
            {IconLeading && <IconLeading aria-hidden="true" className="size-4 shrink-0" />}
            {content}
            {IconTrailing && <IconTrailing aria-hidden="true" className="size-4 shrink-0" />}
          </span>
        </>
      ))}
    </AriaButton>
  );
}
