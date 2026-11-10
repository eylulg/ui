import { useContext, type ReactNode } from 'react';
import {
  OverlayTriggerStateContext,
  type DialogTriggerProps,
  type ModalOverlayProps,
} from 'react-aria-components';
import { LazyDialogTrigger } from '../../internal/LazyDialogTrigger';
import { createLazyModule } from '../../internal/lazyModule';

export type DrawerSide = 'left' | 'right' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg';

export interface DrawerProps extends Pick<
  ModalOverlayProps,
  'isOpen' | 'defaultOpen' | 'onOpenChange' | 'isDismissable' | 'isKeyboardDismissDisabled'
> {
  /** Heading, also used as the accessible name. */
  title: ReactNode;
  /** Hide the heading visually but keep it as the accessible name. */
  hideTitle?: boolean;
  description?: ReactNode;
  /** Body content, or a function that receives `close`. */
  children?: ReactNode | ((options: { close: () => void }) => ReactNode);
  /** Sticky footer, usually action buttons. Also accepts a function that receives `close`. */
  footer?: ReactNode | ((options: { close: () => void }) => ReactNode);
  /** Edge the panel slides in from. */
  side?: DrawerSide;
  size?: DrawerSize;
  closeLabel?: string;
  className?: string;
}

const overlay = /*#__PURE__*/ createLazyModule(() => import('./DrawerOverlay'));

/**
 * A side panel (also called a sheet) on React Aria's Modal. It slides in from
 * an edge, traps focus while open, closes on Escape or a click on the
 * backdrop, and returns focus to the trigger. Use it for navigation on small
 * screens, filters and detail views.
 *
 * The panel's code loads the first time it opens, or earlier when the trigger
 * is hovered or focused.
 */
export function Drawer(props: DrawerProps) {
  const triggerState = useContext(OverlayTriggerStateContext);
  const isWanted = props.isOpen ?? props.defaultOpen ?? triggerState?.isOpen ?? false;
  const loaded = overlay.useModule(isWanted);
  return loaded ? <loaded.DrawerOverlay {...props} /> : null;
}

/** Wraps a trigger button and its Drawer, and preloads the drawer on hover or focus of the trigger. */
export function DrawerTrigger(props: DialogTriggerProps) {
  return <LazyDialogTrigger module={overlay} {...props} />;
}
