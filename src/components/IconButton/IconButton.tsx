import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components';
import { Spinner } from '../../internal/Spinner';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';
import { buttonBase, buttonVariants, type ButtonVariant } from '../Button/Button';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<AriaButtonProps, 'children' | 'isPending'> {
  /** The icon to render. */
  icon: IconComponent;
  /** Required: an icon alone has no accessible name. */
  'aria-label': string;
  variant?: ButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
}

const sizes: Record<IconButtonSize, { button: string; icon: string }> = {
  sm: { button: 'size-control-sm', icon: 'size-4' },
  md: { button: 'size-control-md', icon: 'size-5' },
  lg: { button: 'size-control-lg', icon: 'size-5' },
};

export function IconButton({
  icon: Icon,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  className,
  ...props
}: IconButtonProps) {
  return (
    <AriaButton
      {...props}
      isPending={isLoading}
      data-variant={variant}
      className={composeRenderProps(className, (consumer) =>
        cx(buttonBase, buttonVariants[variant], 'p-0', sizes[size].button, consumer),
      )}
    >
      {({ isPending }) =>
        isPending ? (
          <Spinner className={sizes[size].icon} />
        ) : (
          <Icon aria-hidden="true" className={sizes[size].icon} />
        )
      }
    </AriaButton>
  );
}
