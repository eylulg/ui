import type { ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  OverlayArrow,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components';
import { cx } from '../../utils/cx';

export interface PopoverProps extends Pick<
  AriaPopoverProps,
  'placement' | 'offset' | 'isOpen' | 'onOpenChange' | 'triggerRef' | 'shouldFlip' | 'isNonModal'
> {
  /** Visible heading, also used as the accessible name. */
  title?: ReactNode;
  /** Accessible name when there is no visible title. */
  'aria-label'?: string;
  /** Shows a small arrow pointing at the trigger. */
  showArrow?: boolean;
  /** Content, or a function that receives `close`. */
  children: ReactNode | ((options: { close: () => void }) => ReactNode);
  className?: string;
}

/**
 * A non modal floating panel anchored to its trigger, for rich content such
 * as filters or details. Focus moves into the panel, Escape and clicking
 * outside close it, and focus returns to the trigger. Place it inside a
 * PopoverTrigger next to the button that opens it.
 */
export function Popover({
  title,
  'aria-label': ariaLabel,
  showArrow = false,
  placement = 'bottom',
  offset = 8,
  children,
  className,
  ...props
}: PopoverProps) {
  return (
    <AriaPopover
      {...props}
      placement={placement}
      offset={offset}
      className={cx(
        'max-w-[calc(100vw-2rem)] min-w-48 rounded-lg border border-subtle bg-elevated text-primary shadow-lg outline-none',
        className,
      )}
    >
      {showArrow && (
        <OverlayArrow className="group">
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            aria-hidden="true"
            className="block fill-(--ui-bg-elevated) stroke-(--ui-border-subtle) group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90"
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
      )}
      <AriaDialog aria-label={ariaLabel} className="flex flex-col gap-2 p-4 outline-none">
        {({ close }) => (
          <>
            {title && (
              <Heading slot="title" className="text-sm font-semibold text-primary">
                {title}
              </Heading>
            )}
            <div className="text-sm text-secondary">
              {typeof children === 'function' ? children({ close }) : children}
            </div>
          </>
        )}
      </AriaDialog>
    </AriaPopover>
  );
}

/** Wraps a trigger button and its Popover. Alias of React Aria's DialogTrigger. */
export const PopoverTrigger = DialogTrigger;
