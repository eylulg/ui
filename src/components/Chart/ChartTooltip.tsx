import type { ReactNode } from 'react';
import { cx } from '../../utils/cxLite';
import { SeriesKey, type ChartKeyVariant } from './ChartLegend';

export interface TooltipRow {
  id: string;
  label: string;
  value: string;
  /** Series position, for the key. Leave out for a row without a key, such as a total. */
  index?: number;
  isEmphasised?: boolean;
  /** Replaces the series key, for example a state icon. */
  marker?: ReactNode;
}

interface ChartTooltipProps {
  /** Position in the plot area, in pixels. */
  x: number;
  y: number;
  /** Width of the plot area, to pick the side with room. */
  containerWidth: number;
  title: string;
  rows: TooltipRow[];
  variant: ChartKeyVariant;
  /**
   * `above` and `below` centre on the point in proportion to its position, so the tooltip stays
   * inside the plot; `beside` sits to the left or right and centres vertically.
   */
  placement?: 'above' | 'below' | 'beside';
}

/**
 * The readout for one x position or one mark. It lists every series, values first, and sits on
 * whichever side of the point has more room. It never takes the pointer.
 */
export function ChartTooltip({
  x,
  y,
  containerWidth,
  title,
  rows,
  variant,
  placement = 'beside',
}: ChartTooltipProps) {
  const isRight = x > containerWidth / 2;
  const vertical = {
    beside: '-translate-y-1/2',
    above: '-translate-y-full -mt-2',
    below: 'mt-2',
  }[placement];
  const horizontal =
    placement === 'beside' ? (isRight ? '-ml-3 -translate-x-full' : 'ml-3') : undefined;
  return (
    <div
      role='tooltip'
      style={{
        left: x,
        top: y,
        transform:
          placement === 'beside' ? undefined : `translateX(-${(x / containerWidth) * 100}%)`,
      }}
      className={cx(
        'pointer-events-none absolute z-10 w-max max-w-56 rounded-md border border-subtle bg-elevated px-3 py-2 text-xs shadow-lg',
        horizontal,
        vertical,
      )}
    >
      <p className='mb-1 font-medium text-tertiary'>{title}</p>
      <ul className='flex flex-col gap-1'>
        {rows.map((row) => (
          <li key={row.id} className='flex items-center gap-2'>
            {row.marker ? (
              row.marker
            ) : row.index === undefined ? (
              <span aria-hidden='true' className='w-3 shrink-0' />
            ) : (
              <SeriesKey index={row.index} variant={variant} />
            )}
            <span
              className={cx(
                'font-data text-primary tabular-nums',
                row.isEmphasised ? 'font-bold' : 'font-semibold',
              )}
            >
              {row.value}
            </span>
            <span className='text-secondary'>{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
