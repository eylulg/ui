import { OverlayArrow, Tooltip as AriaTooltip } from 'react-aria-components';
import { cx } from '../../utils/cx';
import type { TooltipProps } from './Tooltip';

type TooltipOverlayProps = Pick<TooltipProps, 'content' | 'placement' | 'offset' | 'className'>;

/** The floating label behind Tooltip. Tooltip loads this module when the tooltip is about to show. */
export function TooltipOverlay({
  content,
  placement = 'top',
  offset = 8,
  className,
}: TooltipOverlayProps) {
  return (
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
  );
}
