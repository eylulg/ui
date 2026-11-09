import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';

export type StatTrend = 'up' | 'down' | 'neutral';

export interface StatDelta {
  /** The change, as shown, for example "12%" or "+3". */
  value: ReactNode;
  trend: StatTrend;
  /** Context after the change, for example "vs last week". */
  label?: ReactNode;
  /**
   * Whether the trend is good news. Defaults to up being positive; set it for
   * metrics where a fall is good, such as error rate or latency.
   */
  isPositive?: boolean;
}

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  delta?: StatDelta;
  /** Inline chart slot, usually a Sparkline. */
  sparkline?: ReactNode;
  /** Draws the stat on a bordered card surface. */
  isCard?: boolean;
  /** Words announced before the delta value, so the trend never relies on colour or the icon. */
  trendLabels?: Record<StatTrend, string>;
}

const defaultTrendLabels: Record<StatTrend, string> = {
  up: 'Up',
  down: 'Down',
  neutral: 'No change',
};

const trendIcons: Record<StatTrend, IconComponent> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
};

const tone = {
  positive: 'text-success',
  negative: 'text-error',
  neutral: 'text-tertiary',
} as const;

const card = 'rounded-xl border border-subtle bg-elevated p-card shadow-xs';

function toneFor({ trend, isPositive }: StatDelta): keyof typeof tone {
  if (trend === 'neutral') return 'neutral';
  const positive = isPositive ?? trend === 'up';
  return positive ? 'positive' : 'negative';
}

/** A single metric: label, value, an optional change and an optional sparkline. */
export function Stat({
  label,
  value,
  delta,
  sparkline,
  isCard = false,
  trendLabels = defaultTrendLabels,
  className,
  ...props
}: StatProps) {
  const TrendIcon = delta ? trendIcons[delta.trend] : null;

  return (
    <div {...props} className={cx('flex flex-col gap-2', isCard && card, className)}>
      <p className="text-sm font-medium text-tertiary">{label}</p>
      <div className="flex items-end justify-between gap-4">
        <p className="font-data text-3xl font-semibold text-primary tabular-nums">{value}</p>
        {sparkline && <div className="shrink-0 text-fg-brand">{sparkline}</div>}
      </div>
      {delta && TrendIcon && (
        <p className="flex flex-wrap items-center gap-1 text-sm">
          <span
            className={cx('inline-flex items-center gap-0.5 font-medium', tone[toneFor(delta)])}
          >
            <TrendIcon aria-hidden="true" className="size-4" />
            <span className="sr-only">{trendLabels[delta.trend]}</span>
            {delta.value}
          </span>
          {delta.label && <span className="text-tertiary">{delta.label}</span>}
        </p>
      )}
    </div>
  );
}

export interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  /** Gives the chart role="img" with this name. Without it the chart is decorative. */
  'aria-label'?: string;
  className?: string;
}

/** Builds the SVG points for a line through `values`, scaled to the box with a 1px inset. */
export function sparklinePoints(values: number[], width: number, height: number): string {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const step = values.length > 1 ? (width - 2) / (values.length - 1) : 0;
  return values
    .map((value, index) => {
      const x = 1 + index * step;
      const y = span === 0 ? height / 2 : 1 + (1 - (value - min) / span) * (height - 2);
      return `${Number(x.toFixed(2))},${Number(y.toFixed(2))}`;
    })
    .join(' ');
}

/** A tiny line chart in the current text colour. */
export function Sparkline({
  values,
  width = 96,
  height = 32,
  'aria-label': ariaLabel,
  className,
}: SparklineProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={className}
    >
      <polyline
        points={sparklinePoints(values, width, height)}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
