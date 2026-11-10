import type { ReactNode, Ref } from 'react';
import {
  Button as AriaButton,
  Link as AriaLink,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components';
import { Spinner } from '../../internal/Spinner';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';
import { buttonStyles, type ButtonSize, type ButtonVariant } from './buttonStyles';

export {
  buttonSizes,
  buttonStyles,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from './buttonStyles';

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
