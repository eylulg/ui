import { cx } from '../../utils/cxLite';
import { ChartFrame } from './ChartFrame';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip, type TooltipRow } from './ChartTooltip';
import { createValueFormat, fitText, textWidth, truncate, type ValueFormat } from './format';
import { barPath, type BarEnd } from './geometry';
import { ChartMark, useChartInteraction } from './interaction';
import { chartLabels } from './labels';
import { linearScale, niceTicks, sampleIndexes } from './scale';
import { seriesStyle } from './series';
import { describeBars, plural } from './summary';
import type { ChartBaseProps, ChartLabels, ChartSeries } from './types';

export interface BarChartProps extends ChartBaseProps {
  /** One name per bar group. */
  categories: string[];
  /**
   * Up to six series get a colour each. Negative values grow down or to the left of zero; `null`
   * leaves the bar out and reads as "No data".
   */
  series: ChartSeries[];
  orientation?: 'vertical' | 'horizontal';
  grouping?: 'grouped' | 'stacked';
  /** Header of the first table column. Defaults to `labels.category`. */
  categoryLabel?: string;
  /** Intl options for values in the axis, tooltip and table. */
  valueFormat?: Intl.NumberFormatOptions;
  /** Prints the value at the end of each bar when it fits. Not used for stacks. */
  hasValueLabels?: boolean;
}

const gap = 2;

function isNumber(value: number | null | undefined): value is number {
  return typeof value === 'number';
}

function amount(value: number | null | undefined): number {
  return isNumber(value) ? value : 0;
}

interface Extent {
  low: number;
  high: number;
  isInteger: boolean;
}

/** The range the value axis must cover: stacks add up per sign, groups are single bars. */
function extentOf(categories: string[], series: ChartSeries[], isStacked: boolean): Extent {
  const known = series.flatMap((s) => s.values.filter(isNumber));
  if (!isStacked) {
    return {
      low: Math.min(0, ...known),
      high: Math.max(0, ...known),
      isInteger: known.every(Number.isInteger),
    };
  }
  const sums = categories.map((_, index) => {
    const values = series.map((s) => amount(s.values[index]));
    return {
      up: values.filter((value) => value > 0).reduce((sum, value) => sum + value, 0),
      down: values.filter((value) => value < 0).reduce((sum, value) => sum + value, 0),
    };
  });
  return {
    low: Math.min(0, ...sums.map((sum) => sum.down)),
    high: Math.max(0, ...sums.map((sum) => sum.up)),
    isInteger: known.every(Number.isInteger),
  };
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
  categoryLabel,
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
  const text = chartLabels(labels);
  const isStacked = grouping === 'stacked' && series.length > 1;
  const totals = categories.map((_, index) =>
    series.reduce((sum, s) => sum + amount(s.values[index]), 0),
  );
  const extent = extentOf(categories, series, isStacked);
  const hasValues = series.some((s) => s.values.some(isNumber));
  const vf = createValueFormat(Math.max(-extent.low, extent.high), locale, valueFormat);
  const colors = series.map((s, index) => s.colorIndex ?? index);
  const headline = `${orientation === 'vertical' ? 'Vertical' : 'Horizontal'} ${isStacked ? 'stacked' : 'grouped'} bar chart of ${plural(categories.length, 'category', 'categories')} and ${plural(series.length, 'series', 'series')}.`;

  return (
    <ChartFrame
      title={title}
      hideTitle={hideTitle}
      labels={labels}
      isCard={isCard}
      className={className}
      isEmpty={categories.length === 0 || series.length === 0 || !hasValues}
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
        head: [
          categoryLabel ?? text.category,
          ...series.map((s) => s.label),
          ...(isStacked ? [text.total] : []),
        ],
        rows: categories.map((name, index) => [
          name,
          ...series.map((s) => {
            const value = s.values[index];
            return isNumber(value) ? vf.full(value) : '';
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
          extent={extent}
          totals={totals}
          words={text}
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
  extent: Extent;
  totals: number[];
  words: ChartLabels;
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
  extent,
  totals,
  words,
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
    extent.low,
    extent.high,
    Math.max(2, Math.floor((isVertical ? plotHeight : width / 3) / (isVertical ? 48 : 70))),
    extent.isInteger,
  );
  const widest = Math.max(...ticks.ticks.map((tick) => textWidth(vf.axis(tick))));
  const left = isVertical ? widest + 12 : sideLabels + 12;
  const valueLabelRoom = Math.max(
    !isVertical && hasValueLabels && !isStacked ? textWidth(vf.full(extent.high)) + 12 : 0,
    isVertical ? 14 : widest / 2 + 4,
  );
  const plotWidth = Math.max(40, width - left - valueLabelRoom);

  const valueExtent = isVertical ? plotHeight : plotWidth;
  const scale = linearScale([ticks.min, ticks.max], [0, valueExtent]);
  const zero = scale(0);
  const slot = (isVertical ? plotWidth : plotHeight) / count;
  const thickness = isStacked
    ? Math.min(28, slot * 0.6)
    : Math.max(2, Math.min(24, (slot * 0.72 - gap * (perGroup - 1)) / perGroup));
  const groupSize = perGroup * thickness + (perGroup - 1) * gap;

  const bars: Bar[] = categories.flatMap((_, category) => {
    const start = category * slot + (slot - groupSize) / 2;
    const values = series.map((s) => s.values[category]);
    const firstUp = values.findIndex((value) => isNumber(value) && value > 0);
    const lastUp = values.findLastIndex((value) => isNumber(value) && value > 0);
    const firstDown = values.findIndex((value) => isNumber(value) && value < 0);
    const lastDown = values.findLastIndex((value) => isNumber(value) && value < 0);
    let up = 0;
    let down = 0;
    return series.flatMap((_, index): Bar[] => {
      const value = values[index];
      if (!isNumber(value)) return [];
      const isDown = value < 0;
      let from = Math.min(zero, scale(value));
      let to = Math.max(zero, scale(value));
      if (isStacked) {
        const before = isDown ? down : up;
        const after = before + value;
        if (isDown) down = after;
        else up = after;
        [from, to] = [Math.min(scale(before), scale(after)), Math.max(scale(before), scale(after))];
        const isFirst = index === (isDown ? firstDown : firstUp);
        const isLast = index === (isDown ? lastDown : lastUp);
        const innerInset = isFirst ? 0 : gap / 2;
        const outerInset = isLast ? 0 : gap / 2;
        if (isDown) [from, to] = [from + outerInset, to - innerInset];
        else [from, to] = [from + innerInset, to - outerInset];
        to = Math.max(from, to);
      }
      const isEnd = !isStacked || index === (isDown ? lastDown : lastUp);
      const end: BarEnd = !isEnd
        ? 'none'
        : isVertical
          ? isDown
            ? 'bottom'
            : 'top'
          : isDown
            ? 'left'
            : 'right';
      const offset = isStacked ? 0 : index * (thickness + gap);
      return [
        {
          key: `${category}-${series[index]?.id}`,
          category,
          series: index,
          value,
          x: isVertical ? start + offset : from,
          y: isVertical ? plotHeight - to : start + offset,
          w: isVertical ? thickness : to - from,
          h: isVertical ? to - from : thickness,
          end,
        },
      ];
    });
  });

  const interaction = useChartInteraction(bars.length);
  const active = interaction.active === null ? null : (bars[interaction.active] ?? null);
  const activeCategory = active?.category ?? null;

  const rowsFor = (category: number, emphasised?: number): TooltipRow[] => [
    ...series.map((s, index) => {
      const value = s.values[category];
      return {
        id: s.id,
        label: s.label,
        value: isNumber(value) ? vf.full(value) : words.noData,
        index: colors[index] ?? index,
        isEmphasised: index === emphasised,
      };
    }),
    ...(isStacked
      ? [{ id: 'total', label: words.total, value: vf.full(totals[category] ?? 0) }]
      : []),
  ];

  const tickLabels = isVertical
    ? slot >= 60 || textWidth('x'.repeat(longest)) + 8 <= slot
      ? categories.map((c, index) => ({ index, text: fitText(c, Math.max(3 * 6.6, slot - 8)) }))
      : sampleIndexes(count, Math.floor(plotWidth / (textWidth('x'.repeat(12)) + 12))).map(
          (index) => ({
            index,
            text: truncate(categories[index] ?? '', 12),
          }),
        )
    : categories.map((c, index) => ({ index, text: fitText(c, sideLabels) }));

  const tooltipPlacement = !isVertical
    ? 'beside'
    : active && (active.value < 0 || active.y + top < 96)
      ? 'below'
      : 'above';

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
              const label = vf.full(bar.value);
              const isDown = bar.value < 0;
              if (bar.value === 0) return null;
              if (isVertical) {
                const y = isDown ? bar.y + bar.h + 14 : bar.y - 6;
                if (textWidth(label) > Math.max(bar.w + gap, (slot * 0.9) / perGroup)) return null;
                if (y > plotHeight) return null;
                return (
                  <text
                    key={bar.key}
                    x={bar.x + bar.w / 2}
                    y={y}
                    textAnchor="middle"
                    className="fill-(--ui-text-secondary) text-xs"
                  >
                    {label}
                  </text>
                );
              }
              if (isDown && bar.x - 6 - textWidth(label) < 0) return null;
              return (
                <text
                  key={bar.key}
                  x={isDown ? bar.x - 6 : bar.x + bar.w + 6}
                  y={bar.y + bar.h / 2}
                  dy="0.32em"
                  textAnchor={isDown ? 'end' : 'start'}
                  className="fill-(--ui-text-secondary) text-xs"
                >
                  {label}
                </text>
              );
            })}
        </g>
      </svg>
      {bars.map((bar, index) => {
        const minimum = 12;
        const long = Math.max(isVertical ? bar.h : bar.w, minimum);
        const isDown = bar.value < 0;
        const box = isVertical
          ? {
              left: bar.x - 1,
              top: isDown ? bar.y : bar.y + bar.h - long,
              width: bar.w + 2,
              height: long,
            }
          : {
              left: isDown ? bar.x + bar.w - long - 1 : bar.x - 1,
              top: bar.y - 1,
              width: long + 2,
              height: bar.h + 2,
            };
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
          x={
            left +
            (isVertical
              ? active.x + active.w / 2
              : active.value < 0
                ? active.x
                : active.x + active.w)
          }
          y={
            top +
            (isVertical
              ? active.value < 0
                ? active.y + active.h
                : active.y
              : active.y + active.h / 2)
          }
          containerWidth={width}
          title={categories[activeCategory] ?? ''}
          rows={rowsFor(activeCategory, active.series)}
          variant="bar"
          placement={tooltipPlacement}
        />
      )}
    </>
  );
}
