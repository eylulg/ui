import type { ReactNode, Ref } from 'react';
import {
  Button as AriaButton,
  Link as AriaLink,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components';
import { focusRing } from '../../internal/focusRing';
import { Spinner } from '../../internal/Spinner';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';

export type ButtonVariant =
  'primary' | 'secondary' | 'tertiary' | 'destructive' | 'destructive-outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonLookProps {
  /**
   * Visual emphasis. Use one primary button per view. `destructive-outline` is
   * the quieter choice for a delete action next to a primary one.
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon rendered before the label. */
  iconLeading?: IconComponent;
  /** Icon rendered after the label. */
  iconTrailing?: IconComponent;
}

export interface ButtonProps extends ButtonLookProps, Omit<AriaButtonProps, 'isPending'> {
  /** Shows a spinner, keeps the width and announces the pending state. */
  isLoading?: boolean;
  /** Text announced while loading. Defaults to the button label. */
  loadingLabel?: string;
  href?: undefined;
  /** Ref to the button element, for example to return focus to it. */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * A link that looks like a button: pass `href` and Button renders a React Aria
 * Link (an `<a>`), which goes through your router's navigate when the app is
 * wrapped in a React Aria `RouterProvider`. A link cannot be loading.
 */
export interface LinkButtonProps extends ButtonLookProps, Omit<AriaLinkProps, 'children'> {
  href: string;
  children?: ReactNode;
  /** Ref to the anchor element. */
  ref?: Ref<HTMLAnchorElement>;
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
  'destructive-outline':
    'bg-primary text-error border border-error shadow-xs data-hovered:bg-error-subtle data-pressed:bg-error-subtle',
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-control-sm gap-1.5 px-3 text-sm',
  md: 'h-control-md gap-2 px-control-x text-sm',
  lg: 'h-control-lg gap-2.5 px-5 text-md',
};

export const buttonBase = cx(
  'relative inline-flex cursor-pointer items-center justify-center rounded-md font-semibold whitespace-nowrap transition-colors select-none',
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

/** A button, or a link that looks like one when `href` is set. */
export function Button(props: ButtonProps | LinkButtonProps) {
  if (props.href !== undefined) return <ButtonLink {...props} />;
  return <ButtonControl {...props} />;
}

function ButtonControl({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  loadingLabel,
  ref,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      ref={ref}
      isPending={isLoading}
      data-variant={variant}
      data-size={size}
      className={composeRenderProps(className, (consumer) =>
        buttonStyles({ variant, size, className: consumer }),
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

function ButtonLink({
  variant = 'primary',
  size = 'md',
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  ref,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <AriaLink
      {...props}
      ref={ref}
      data-variant={variant}
      data-size={size}
      className={composeRenderProps(className, (consumer) =>
        buttonStyles({ variant, size, className: consumer }),
      )}
    >
      {IconLeading && <IconLeading aria-hidden="true" className="size-4 shrink-0" />}
      {children}
      {IconTrailing && <IconTrailing aria-hidden="true" className="size-4 shrink-0" />}
    </AriaLink>
  );
}
