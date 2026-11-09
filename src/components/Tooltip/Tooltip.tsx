import type { ReactElement, ReactNode } from 'react';
import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps,
} from 'react-aria-components';
import { cx } from '../../utils/cx';

export interface TooltipProps
  extends
    Omit<TooltipTriggerComponentProps, 'children'>,
    Pick<AriaTooltipProps, 'placement' | 'offset'> {
  /** Tooltip text. Keep it short; tooltips cannot contain interactive content. */
  content: ReactNode;
  /** A single focusable element, usually a Button or IconButton. */
  children: ReactElement;
  className?: string;
}

/**
 * Shows a short description on hover and on keyboard focus. Opens after a
 * delay on hover, immediately on focus, and closes on Escape.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  offset = 8,
  delay = 500,
  className,
  ...triggerProps
}: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} {...triggerProps}>
      {children}
      <AriaTooltip
        placement={placement}
        offset={offset}
        className={cx(
          'max-w-64 rounded-md bg-inverse px-3 py-2 text-xs font-medium text-inverse shadow-lg',
          className,
        )}
      >
        <OverlayArrow className="group">
          <svg
            width={8}
            height={8}
            viewBox="0 0 8 8"
            aria-hidden="true"
            className="block fill-(--ui-bg-inverse) group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90"
          >
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
