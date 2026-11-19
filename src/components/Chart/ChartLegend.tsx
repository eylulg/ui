import type { ReactNode } from 'react';
import { cx } from '../../utils/cxLite';
import { markerPath } from './geometry';
import { seriesStyle } from './series';

export type ChartKeyVariant = 'line' | 'bar';

export interface ChartLegendItem {
  id: string;
  label: string;
  /** Series position, 0 to 5 for a hue of its own. Picks the colour and the marker shape. */
  index?: number;
  /** Replaces the series key, for example an icon for a pass or fail state. */
  marker?: ReactNode;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  /** `line` draws a short stroke with the marker shape, `bar` a square swatch. */
  variant?: ChartKeyVariant;
  className?: string;
}

interface SeriesKeyProps {
  index: number;
  variant: ChartKeyVariant;
}

/** The mark of one series, repeated in the legend and the tooltip. Never carries text. */
export function SeriesKey({ index, variant }: SeriesKeyProps) {
  const style = seriesStyle(index);
  if (variant === 'bar') {
    return <span aria-hidden='true' className={cx('size-3 shrink-0 rounded-xs', style.swatch)} />;
  }
  return (
    <svg aria-hidden='true' width='20' height='12' viewBox='0 0 20 12' className='shrink-0'>
      <line
        x1='1'
        x2='19'
        y1='6'
        y2='6'
        strokeWidth='2'
        strokeLinecap='round'
        strokeDasharray={style.dash}
        className={style.stroke}
      />
      <path d={markerPath(style.shape, 10, 6, 3.5)} className={style.fill} />
    </svg>
  );
}

/**
 * Names every series. The key beside each name carries the colour, so the text stays in the normal
 * text colour, and the marker shape tells the series apart when colour cannot.
 */
export function ChartLegend({ items, variant = 'line', className }: ChartLegendProps) {
  return (
    <ul className={cx('flex flex-wrap gap-x-4 gap-y-1 text-sm text-secondary', className)}>
      {items.map((item, position) => (
        <li key={item.id} className='inline-flex items-center gap-1.5'>
          {item.marker ?? <SeriesKey index={item.index ?? position} variant={variant} />}
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
