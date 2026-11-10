import { useContext, type ReactElement, type ReactNode } from 'react';
import {
  TooltipTrigger,
  TooltipTriggerStateContext,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps,
} from 'react-aria-components';
import { createLazyModule } from '../../internal/lazyModule';
import { PreloadOnIntent } from '../../internal/PreloadOnIntent';

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

const overlay = /*#__PURE__*/ createLazyModule(() => import('./TooltipOverlay'));

/**
 * Shows a short description on hover and on keyboard focus. Opens after a
 * delay on hover, immediately on focus, and closes on Escape.
 *
 * The tooltip's code loads when the trigger is hovered or focused, ahead of
 * the delay, so it is ready when the tooltip opens.
 */
export function Tooltip({
  content,
  children,
  placement,
  offset,
  delay = 500,
  className,
  ...triggerProps
}: TooltipProps) {
  return (
    <PreloadOnIntent module={overlay}>
      <TooltipTrigger delay={delay} {...triggerProps}>
        {children}
        <TooltipContent
          content={content}
          placement={placement}
          offset={offset}
          className={className}
        />
      </TooltipTrigger>
    </PreloadOnIntent>
  );
}

function TooltipContent(
  props: Pick<TooltipProps, 'content' | 'placement' | 'offset' | 'className'>,
) {
  const triggerState = useContext(TooltipTriggerStateContext);
  const loaded = overlay.useModule(triggerState?.isOpen ?? false);
  return loaded ? <loaded.TooltipOverlay {...props} /> : null;
}
