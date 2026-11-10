import { X } from 'lucide-react';
import { useId } from 'react';
import { Dialog as AriaDialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { cx } from '../../utils/cx';
import { IconButton } from '../IconButton/IconButton';
import type { DialogProps, DialogSize } from './Dialog';

const sizes: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

/** The modal behind Dialog. Dialog loads this module the first time it opens. */
export function DialogOverlay({
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
