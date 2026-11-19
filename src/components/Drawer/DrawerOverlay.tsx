import { X } from 'lucide-react';
import { useId } from 'react';
import { Dialog as AriaDialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { cx } from '../../utils/cx';
import { IconButton } from '../IconButton/IconButton';
import type { DrawerProps, DrawerSide, DrawerSize } from './Drawer';

const panel: Record<DrawerSide, string> = {
  right:
    'inset-y-0 right-0 h-full w-full border-l data-entering:translate-x-full data-exiting:translate-x-full',
  left: 'inset-y-0 left-0 h-full w-full border-r data-entering:-translate-x-full data-exiting:-translate-x-full',
  bottom:
    'inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-2xl border-t data-entering:translate-y-full data-exiting:translate-y-full',
};

const overlay =
  'fixed inset-0 z-50 bg-overlay transition-opacity duration-200 data-entering:opacity-0 data-exiting:opacity-0 motion-reduce:transition-none';

const widths: Record<DrawerSize, string> = {
  sm: 'max-w-xs',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

/** The panel behind Drawer. Drawer loads this module the first time it opens. */
export function DrawerOverlay({
  title,
  hideTitle = false,
  description,
  children,
  footer,
  side = 'right',
  size = 'md',
  closeLabel = 'Close',
  isDismissable = true,
  className,
  ...overlayProps
}: DrawerProps) {
  const descriptionId = useId();
  return (
    <ModalOverlay {...overlayProps} isDismissable={isDismissable} className={overlay}>
      <Modal
        data-side={side}
        className={cx(
          'fixed flex flex-col border-subtle bg-elevated text-primary shadow-xl outline-none',
          'transition-transform duration-200 ease-out motion-reduce:transition-none',
          panel[side],
          side !== 'bottom' && widths[size],
          className,
        )}
      >
        <AriaDialog
          aria-describedby={description ? descriptionId : undefined}
          className='flex min-h-0 flex-1 flex-col outline-none'
        >
          {({ close }) => (
            <>
              <div className='flex items-start gap-3 border-b border-subtle p-card pb-4'>
                <div className='flex min-w-0 flex-1 flex-col gap-1'>
                  <Heading
                    slot='title'
                    className={cx(
                      'font-display text-lg font-semibold text-primary',
                      hideTitle && 'sr-only',
                    )}
                  >
                    {title}
                  </Heading>
                  {description && (
                    <p id={descriptionId} className='text-sm text-tertiary'>
                      {description}
                    </p>
                  )}
                </div>
                <IconButton
                  icon={X}
                  aria-label={closeLabel}
                  variant='tertiary'
                  size='sm'
                  onPress={close}
                  className='-mt-1 -mr-1 shrink-0'
                />
              </div>
              <div className='min-h-0 flex-1 overflow-auto p-card text-sm text-secondary'>
                {typeof children === 'function' ? children({ close }) : children}
              </div>
              {footer && (
                <div className='flex flex-col-reverse gap-3 border-t border-subtle p-card pt-4 sm:flex-row sm:justify-end'>
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
