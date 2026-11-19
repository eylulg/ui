import { cx } from '../../utils/cxLite';
import { ChartFrame } from './ChartFrame';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip, type TooltipRow } from './ChartTooltip';
import { createValueFormat, textWidth, truncate, type ValueFormat } from './format';
import { barPath, type BarEnd } from './geometry';
import { ChartMark, useChartInteraction } from './interaction';
import { linearScale, niceTicks, sampleIndexes } from './scale';
import { seriesStyle } from './series';
import { describeBars, plural } from './summary';
import type { ChartBaseProps, ChartSeries } from './types';

export interface BarChartProps extends ChartBaseProps {
  /** One name per bar group. */
  categories: string[];
  /** Up to six series get a colour each. Values are zero or more; `null` leaves the bar out. */
  series: ChartSeries[];
  orientation?: 'vertical' | 'horizontal';
  grouping?: 'grouped' | 'stacked';
  /** Header of the first table column. */
  categoryLabel?: string;
  /** Intl options for values in the axis, tooltip and table. */
  valueFormat?: Intl.NumberFormatOptions;
  /** Prints the value at the end of each bar when it fits. Not used for stacks. */
  hasValueLabels?: boolean;
}

const gap = 2;
const rowHeight = 28;

function amount(value: number | null | undefined): number {
  return typeof value === 'number' ? Math.max(0, value) : 0;
}

/**
 * Bars for comparing categories: vertical or horizontal, grouped or stacked. Bars are at most 24
 * pixels thick with a rounded end and a square base, and stacked segments are 2 pixels apart.
 * Every bar can take focus and shows its group in the tooltip.
 */
export function BarChart({
  categories,
  series,
  orientation = 'vertical',
  grouping = 'grouped',
  categoryLabel = 'Category',
  valueFormat,
  hasValueLabels = false,
  title,
  hideTitle,
  summary,
  locale,
  labels,
  height,
  isCard,
  className,
}: BarChartProps) {
  const isStacked = grouping === 'stacked' && series.length > 1;
  const totals = categories.map((_, index) =>
    series.reduce((sum, s) => sum + amount(s.values[index]), 0),
  );
  const peak = isStacked
    ? Math.max(0, ...totals)
    : Math.max(0, ...series.flatMap((s) => s.values.map(amount)));
  const vf = createValueFormat(peak, locale, valueFormat);
  const colors = series.map((s, index) => s.colorIndex ?? index);
  const headline = `${orientation === 'vertical' ? 'Vertical' : 'Horizontal'} ${isStacked ? 'stacked' : 'grouped'} bar chart of ${plural(categories.length, 'category', 'categories')} and ${plural(series.length, 'series', 'series')}.`;

  return (
    <ChartFrame
      title={title}
      hideTitle={hideTitle}
      labels={labels}
      isCard={isCard}
      className={className}
      isEmpty={categories.length === 0 || series.length === 0}
      summary={summary ?? describeBars(headline, categories, series, vf.full)}
      legend={
        series.length > 1 && (
          <ChartLegend
            variant="bar"
            items={series.map((s, index) => ({ id: s.id, label: s.label, index: colors[index] }))}
          />
        )
      }
      table={{
        head: [categoryLabel, ...series.map((s) => s.label), ...(isStacked ? ['Total'] : [])],
        rows: categories.map((name, index) => [
          name,
          ...series.map((s) => {
            const value = s.values[index];
            return typeof value === 'number' ? vf.full(value) : '';
          }),
          ...(isStacked ? [vf.full(totals[index] ?? 0)] : []),
        ]),
      }}
    >
      {(width) => (
        <BarPlot
          width={width}
          height={height}
          categories={categories}
          series={series}
          colors={colors}
          orientation={orientation}
          isStacked={isStacked}
          vf={vf}
          peak={peak}
          totals={totals}
          hasValueLabels={hasValueLabels}
        />
      )}
    </ChartFrame>
  );
}

interface Bar {
  key: string;
  category: number;
  series: number;
  value: number;
  /** Box of the bar in plot coordinates. */
  x: number;
  y: number;
  w: number;
  h: number;
  end: BarEnd;
}

interface BarPlotProps extends Pick<BarChartProps, 'categories' | 'series' | 'hasValueLabels'> {
  width: number;
  height?: number;
  colors: number[];
  orientation: 'vertical' | 'horizontal';
  isStacked: boolean;
  vf: ValueFormat;
  peak: number;
  totals: number[];
}

function BarPlot({
  width,
  height,
  categories,
  series,
  colors,
  orientation,
  isStacked,
  vf,
  peak,
  totals,
  hasValueLabels,
}: BarPlotProps) {
  const isVertical = orientation === 'vertical';
  const count = categories.length;
  const perGroup = isStacked ? 1 : series.length;
  const total = height ?? (isVertical ? 240 : Math.max(120, count * (perGroup * 18 + 14) + 40));
  const top = isVertical ? 20 : 4;
  const bottom = 28;
  const plotHeight = total - top - bottom;

  const longest = Math.max(...categories.map((c) => c.length));
  const sideLabels = isVertical
    ? 0
    : Math.min(textWidth('x'.repeat(longest)), Math.max(60, width * 0.35));
  const ticks = niceTicks(
    0,
    peak,
    Math.max(2, Math.floor((isVertical ? plotHeight : width / 3) / (isVertical ? 48 : 70))),
  );
  const widest = Math.max(...ticks.ticks.map((tick) => textWidth(vf.axis(tick))));
  const left = isVertical ? widest + 12 : sideLabels + 12;
  const valueLabelRoom =
    !isVertical && hasValueLabels && !isStacked ? textWidth(vf.full(peak)) + 12 : 14;
  const plotWidth = Math.max(40, width - left - valueLabelRoom);

  const valueExtent = isVertical ? plotHeight : plotWidth;
  const scale = linearScale([0, ticks.max], [0, valueExtent]);
  const slot = (isVertical ? plotWidth : plotHeight) / count;
  const thickness = isStacked
    ? Math.min(28, slot * 0.6)
    : Math.max(2, Math.min(24, (slot * 0.72 - gap * (perGroup - 1)) / perGroup));
  const groupSize = perGroup * thickness + (perGroup - 1) * gap;

  const bars: Bar[] = categories.flatMap((_, category) => {
    const start = category * slot + (slot - groupSize) / 2;
    let used = 0;
    const lastSegment = series.findLastIndex((s) => amount(s.values[category]) > 0);
    return series.map((s, index): Bar => {
      const value = amount(s.values[category]);
      const length = Math.max(0, scale(value));
      const offset = isStacked ? 0 : index * (thickness + gap);
      let from = 0;
      let size = length;
      if (isStacked) {
        from = scale(used);
        used += value;
        size = scale(used) - from;
        if (index !== 0 && from > 0) {
          from += gap / 2;
          size -= gap / 2;
        }
        if (index !== lastSegment) size -= gap / 2;
        size = Math.max(0, size);
      }
      const end: BarEnd =
        isStacked && index !== lastSegment ? 'none' : isVertical ? 'top' : 'right';
      return {
        key: `${category}-${s.id}`,
        category,
        series: index,
        value,
        x: isVertical ? start + offset : from,
        y: isVertical ? plotHeight - from - size : start + offset,
        w: isVertical ? thickness : size,
        h: isVertical ? size : thickness,
        end,
      };
    });
  });

  const interaction = useChartInteraction(bars.length);
  const active = interaction.active === null ? null : (bars[interaction.active] ?? null);
  const activeCategory = active?.category ?? null;

  const rowsFor = (category: number, emphasised?: number): TooltipRow[] => [
    ...series.map((s, index) => ({
      id: s.id,
      label: s.label,
      value: vf.full(amount(s.values[category])),
      index: colors[index] ?? index,
      isEmphasised: index === emphasised,
    })),
    ...(isStacked ? [{ id: 'total', label: 'Total', value: vf.full(totals[category] ?? 0) }] : []),
  ];

  const fullLabelWidth = textWidth('x'.repeat(longest));
  const showAll = fullLabelWidth + 8 <= slot;
  const fitChars = Math.max(3, Math.floor((slot - 8) / 6.6));
  const tickLabels = isVertical
    ? showAll || slot >= 60
      ? categories.map((c, index) => ({ index, text: truncate(c, fitChars) }))
      : sampleIndexes(count, Math.floor(plotWidth / (textWidth('x'.repeat(12)) + 12))).map(
          (index) => ({
            index,
            text: truncate(categories[index] ?? '', 12),
          }),
        )
    : categories.map((c, index) => ({ index, text: truncate(c, Math.floor(sideLabels / 6.6)) }));

  return (
    <>
      <svg width={width} height={total} aria-hidden="true" className="block">
        <g transform={`translate(${left} ${top})`}>
          {ticks.ticks.map((tick) => {
            const at = scale(tick);
            return isVertical ? (
              <g key={tick}>
                <line
                  x1={0}
                  x2={plotWidth}
                  y1={plotHeight - at}
                  y2={plotHeight - at}
                  className={
                    tick === 0 ? 'stroke-(--ui-border-default)' : 'stroke-(--ui-border-subtle)'
                  }
                />
                <text
                  x={-8}
                  y={plotHeight - at}
                  dy="0.32em"
                  textAnchor="end"
                  className="fill-(--ui-text-tertiary) text-xs"
                >
                  {vf.axis(tick)}
                </text>
              </g>
            ) : (
              <g key={tick}>
                <line
                  x1={at}
                  x2={at}
                  y1={0}
                  y2={plotHeight}
                  className={
                    tick === 0 ? 'stroke-(--ui-border-default)' : 'stroke-(--ui-border-subtle)'
                  }
                />
                <text
                  x={at}
                  y={plotHeight + 18}
                  textAnchor="middle"
                  className="fill-(--ui-text-tertiary) text-xs"
                >
                  {vf.axis(tick)}
                </text>
              </g>
            );
          })}
          {tickLabels.map(({ index, text }) =>
            isVertical ? (
              <text
                key={index}
                x={index * slot + slot / 2}
                y={plotHeight + 18}
                textAnchor="middle"
                className="fill-(--ui-text-tertiary) text-xs"
              >
                {text}
              </text>
            ) : (
              <text
                key={index}
                x={-8}
                y={index * slot + slot / 2}
                dy="0.32em"
                textAnchor="end"
                className="fill-(--ui-text-secondary) text-xs"
              >
                {text}
              </text>
            ),
          )}
          {bars.map((bar) => {
            if (bar.value === 0) return null;
            const style = seriesStyle(colors[bar.series] ?? bar.series);
            const isDimmed = active !== null && active.key !== bar.key;
            return (
              <path
                key={bar.key}
                d={barPath(bar.x, bar.y, bar.w, bar.h, bar.end)}
                className={cx(
                  style.fill,
                  'motion-safe:transition-opacity',
                  isDimmed && 'opacity-70',
                )}
              />
            );
          })}
          {hasValueLabels &&
            !isStacked &&
            bars.map((bar) => {
              const text = vf.full(bar.value);
              const room = isVertical ? bar.w + gap : rowHeight / 2;
              if (
                bar.value === 0 ||
                (isVertical && textWidth(text) > Math.max(room, (slot * 0.9) / perGroup))
              )
                return null;
              return isVertical ? (
                <text
                  key={bar.key}
                  x={bar.x + bar.w / 2}
                  y={bar.y - 6}
                  textAnchor="middle"
                  className="fill-(--ui-text-secondary) text-xs"
                >
                  {text}
                </text>
              ) : (
                <text
                  key={bar.key}
                  x={bar.x + bar.w + 6}
                  y={bar.y + bar.h / 2}
                  dy="0.32em"
                  className="fill-(--ui-text-secondary) text-xs"
                >
                  {text}
                </text>
              );
            })}
        </g>
      </svg>
      {bars.map((bar, index) => {
        const minimum = 12;
        const long = Math.max(isVertical ? bar.h : bar.w, minimum);
        const box = isVertical
          ? { left: bar.x - 1, top: bar.y + bar.h - long, width: bar.w + 2, height: long }
          : { left: bar.x - 1, top: bar.y - 1, width: long + 2, height: bar.h + 2 };
        const category = categories[bar.category] ?? '';
        const name = series[bar.series]?.label ?? '';
        return (
          <ChartMark
            key={bar.key}
            index={index}
            interaction={interaction}
            label={`${category}, ${name}: ${vf.full(bar.value)}`}
            style={{
              left: left + box.left,
              top: top + box.top,
              width: box.width,
              height: box.height,
            }}
          />
        );
      })}
      {active && activeCategory !== null && (
        <ChartTooltip
          x={left + (isVertical ? active.x + active.w / 2 : active.x + active.w)}
          y={top + (isVertical ? active.y : active.y + active.h / 2)}
          containerWidth={width}
          title={categories[activeCategory] ?? ''}
          rows={rowsFor(activeCategory, active.series)}
          variant="bar"
          placement={isVertical ? (active.y + top < 96 ? 'below' : 'above') : 'beside'}
        />
      )}
    </>
  );
}
