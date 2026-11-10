import { useContext, type ReactNode } from 'react';
import {
  OverlayTriggerStateContext,
  type DialogTriggerProps,
  type ModalOverlayProps,
} from 'react-aria-components';
import { LazyDialogTrigger } from '../../internal/LazyDialogTrigger';
import { createLazyModule } from '../../internal/lazyModule';

export type DialogSize = 'sm' | 'md' | 'lg';

export interface DialogProps extends Pick<
  ModalOverlayProps,
  'isOpen' | 'defaultOpen' | 'onOpenChange' | 'isDismissable' | 'isKeyboardDismissDisabled'
> {
  /** Heading, also used as the dialog's accessible name. */
  title: ReactNode;
  description?: ReactNode;
  /** Body content, or a function that receives `close`. */
  children?: ReactNode | ((options: { close: () => void }) => ReactNode);
  /** Action buttons, rendered in the footer. Also accepts a function that receives `close`. */
  footer?: ReactNode | ((options: { close: () => void }) => ReactNode);
  size?: DialogSize;
  /** Role "alertdialog" for destructive confirmations that need an explicit choice. */
  role?: 'dialog' | 'alertdialog';
  /** Controls in the header next to the title, such as a button to open the item in a page. They come before the close button. */
  headerActions?: ReactNode;
  /** Hide the close button in the header. */
  hideCloseButton?: boolean;
  closeLabel?: string;
  className?: string;
}

const overlay = /*#__PURE__*/ createLazyModule(() => import('./DialogOverlay'));

/**
 * A modal dialog. Focus moves into the dialog when it opens, is trapped while
 * open and returns to the trigger on close. Place it inside a DialogTrigger
 * next to the button that opens it, or control it with isOpen.
 *
 * The modal's code loads the first time it opens, or earlier when the trigger
 * is hovered or focused, so the very first open can take a moment on a slow
 * connection.
 */
export function Dialog(props: DialogProps) {
  const triggerState = useContext(OverlayTriggerStateContext);
  const isWanted = props.isOpen ?? props.defaultOpen ?? triggerState?.isOpen ?? false;
  const loaded = overlay.useModule(isWanted);
  return loaded ? <loaded.DialogOverlay {...props} /> : null;
}

/** Wraps a trigger button and its Dialog, and preloads the dialog on hover or focus of the trigger. */
export function DialogTrigger(props: DialogTriggerProps) {
  return <LazyDialogTrigger module={overlay} {...props} />;
}
