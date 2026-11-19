import {
  Dialog as AriaDialog,
  Heading,
  OverlayArrow,
  Popover as AriaPopover,
} from 'react-aria-components';
import { cx } from '../../utils/cx';
import type { PopoverProps } from './Popover';

/** The floating panel behind Popover. Popover loads this module the first time it opens. */
export function PopoverOverlay({
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
        <OverlayArrow className='group'>
          <svg
            width={12}
            height={12}
            viewBox='0 0 12 12'
            aria-hidden='true'
            className='block fill-(--ui-bg-elevated) stroke-(--ui-border-subtle) group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90'
          >
            <path d='M0 0 L6 6 L12 0' />
          </svg>
        </OverlayArrow>
      )}
      <AriaDialog aria-label={ariaLabel} className='flex flex-col gap-2 p-4 outline-none'>
        {({ close }) => (
          <>
            {title && (
              <Heading slot='title' className='text-sm font-semibold text-primary'>
                {title}
              </Heading>
            )}
            <div className='text-sm text-secondary'>
              {typeof children === 'function' ? children({ close }) : children}
            </div>
          </>
        )}
      </AriaDialog>
    </AriaPopover>
  );
}
