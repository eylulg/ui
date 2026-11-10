import { useContext, type ReactNode } from 'react';
import {
  OverlayTriggerStateContext,
  type DialogTriggerProps,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components';
import { LazyDialogTrigger } from '../../internal/LazyDialogTrigger';
import { createLazyModule } from '../../internal/lazyModule';

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

const overlay = /*#__PURE__*/ createLazyModule(() => import('./PopoverOverlay'));

/**
 * A non modal floating panel anchored to its trigger, for rich content such
 * as filters or details. Focus moves into the panel, Escape and clicking
 * outside close it, and focus returns to the trigger. Place it inside a
 * PopoverTrigger next to the button that opens it.
 *
 * The panel's code loads the first time it opens, or earlier when the trigger
 * is hovered or focused.
 */
export function Popover(props: PopoverProps) {
  const triggerState = useContext(OverlayTriggerStateContext);
  const isWanted = props.isOpen ?? triggerState?.isOpen ?? false;
  const loaded = overlay.useModule(isWanted);
  return loaded ? <loaded.PopoverOverlay {...props} /> : null;
}

/** Wraps a trigger button and its Popover, and preloads the popover on hover or focus of the trigger. */
export function PopoverTrigger(props: DialogTriggerProps) {
  return <LazyDialogTrigger module={overlay} {...props} />;
}
