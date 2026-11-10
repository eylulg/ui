import { X } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
} from 'react-aria-components';
import { cx } from '../../utils/cx';
import { IconButton } from '../IconButton/IconButton';

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

const sizes: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

/**
 * A modal dialog. Focus moves into the dialog when it opens, is trapped while
 * open and returns to the trigger on close. Place it inside a DialogTrigger
 * next to the button that opens it, or control it with isOpen.
 */
export function Dialog({
  title,
  description,
  children,
  footer,
  headerActions,
  size = 'md',
  role = 'dialog',
  hideCloseButton = false,
  closeLabel = 'Close',
  isDismissable = true,
  className,
  ...overlayProps
}: DialogProps) {
  const descriptionId = useId();
  return (
    <ModalOverlay
      {...overlayProps}
      isDismissable={isDismissable}
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
    >
      <Modal className={cx('w-full', sizes[size])}>
        <AriaDialog
          role={role}
          aria-describedby={description ? descriptionId : undefined}
          className={cx(
            'flex max-h-[85vh] flex-col gap-4 overflow-auto rounded-xl bg-elevated p-card text-primary shadow-xl outline-none',
            className,
          )}
        >
          {({ close }) => (
            <>
              <div className="flex items-start gap-2">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Heading slot="title" className="font-display text-lg font-semibold text-primary">
                    {title}
                  </Heading>
                  {description && (
                    <p id={descriptionId} className="text-sm text-tertiary">
                      {description}
                    </p>
                  )}
                </div>
                {headerActions && (
                  <div className="flex shrink-0 items-center gap-1">{headerActions}</div>
                )}
                {!hideCloseButton && (
                  <IconButton
                    icon={X}
                    aria-label={closeLabel}
                    variant="tertiary"
                    size="sm"
                    onPress={close}
                    className="-mt-1 -mr-1 shrink-0"
                  />
                )}
              </div>
              {children && (
                <div className="text-sm text-secondary">
                  {typeof children === 'function' ? children({ close }) : children}
                </div>
              )}
              {footer && (
                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  {typeof footer === 'function' ? footer({ close }) : footer}
                </div>
              )}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

export { DialogTrigger };
