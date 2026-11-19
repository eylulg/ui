import { ChartFrame } from './ChartFrame';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip, type TooltipRow } from './ChartTooltip';
import {
  createValueFormat,
  createXFormat,
  textWidth,
  truncate,
  xKind,
  xNumbers,
  type ValueFormat,
  type XFormat,
} from './format';
import { markerPath } from './geometry';
import { ChartMark, useChartInteraction } from './interaction';
import { linearScale, niceTicks, sampleIndexes } from './scale';
import { seriesStyle } from './series';
import { describeAll, plural } from './summary';
import type { ChartBaseProps, ChartSeries, XValue } from './types';

export interface LineChartProps extends ChartBaseProps {
  /** The x position of every point: dates, numbers or names. Shared by all series. */
  x: XValue[];
  /** Up to six series get a colour each; more are drawn in a muted colour and told apart by shape. */
  series: ChartSeries[];
  /** Header of the first table column. Defaults to Date, Value or Category by the kind of x. */
  xLabel?: string;
  /** Intl options for values in the axis, tooltip and table, for example `{ style: 'percent' }`. */
  valueFormat?: Intl.NumberFormatOptions;
  /** Intl options for date ticks. Include `timeZone` to read dates in a fixed zone. */
  xFormat?: Intl.DateTimeFormatOptions;
  /** The y range. Defaults to zero up to the largest value, rounded to a tick. */
  yDomain?: [number, number];
  /** Names each line at its right end when there are four or fewer and the chart is wide enough. */
  hasDirectLabels?: boolean;
}

const margin = { top: 12, bottom: 28 };
const edge = 6;
const labelGap = 14;

function isNumber(value: number | null | undefined): value is number {
  return typeof value === 'number';
}

const defaultXLabel = { time: 'Date', number: 'Value', category: 'Category' } as const;

/**
 * One or more series over a time or ordered x axis. Hover or focus shows every series at that x;
 * Tab enters the plot and the arrow keys move along it. Each series has its own colour and marker
 * shape, a legend entry and, where there is room, a label at the line end.
 */
export function LineChart({
  x,
  series,
  xLabel,
  valueFormat,
  xFormat,
  yDomain,
  hasDirectLabels = true,
  title,
  hideTitle,
  summary,
  locale,
  labels,
  height = 240,
  isCard,
  className,
}: LineChartProps) {
  const values = series.flatMap((s) => s.values.filter(isNumber));
  const fx = createXFormat(x, locale, xFormat);
  const vf = createValueFormat(Math.max(0, ...values), locale, valueFormat);
  const positions = x.map((_, index) => fx.full(index));
  const headline = `Line chart with ${plural(series.length, 'series', 'series')} and ${plural(x.length, 'point', 'points')}, from ${positions[0]} to ${positions[positions.length - 1]}.`;
  const colors = series.map((s, index) => s.colorIndex ?? index);

  return (
    <ChartFrame
      title={title}
      hideTitle={hideTitle}
      labels={labels}
      isCard={isCard}
      className={className}
      isEmpty={x.length === 0 || values.length === 0}
      summary={summary ?? describeAll(headline, series, positions, vf.full)}
      legend={
        series.length > 1 && (
          <ChartLegend
            variant="line"
            items={series.map((s, index) => ({ id: s.id, label: s.label, index: colors[index] }))}
          />
        )
      }
      table={{
        head: [xLabel ?? defaultXLabel[xKind(x)], ...series.map((s) => s.label)],
        rows: x.map((_, index) => [
          positions[index] ?? '',
          ...series.map((s) => {
            const value = s.values[index];
            return isNumber(value) ? vf.full(value) : '';
          }),
        ]),
      }}
    >
      {(width) => (
        <LinePlot
          width={width}
          height={height}
          x={x}
          series={series}
          colors={colors}
          fx={fx}
          vf={vf}
          yDomain={yDomain}
          hasDirectLabels={hasDirectLabels}
        />
      )}
    </ChartFrame>
  );
}

interface LinePlotProps extends Pick<
  LineChartProps,
  'x' | 'series' | 'yDomain' | 'hasDirectLabels'
> {
  width: number;
  height: number;
  colors: number[];
  fx: XFormat;
  vf: ValueFormat;
}

function LinePlot({
  width,
  height,
  x,
  series,
  colors,
  fx,
  vf,
  yDomain,
  hasDirectLabels,
}: LinePlotProps) {
  const interaction = useChartInteraction(x.length);

  const known = series.flatMap((s) => s.values.filter(isNumber));
  const [low, high] = yDomain ?? [Math.min(0, ...known), Math.max(...known)];
  const plotHeight = height - margin.top - margin.bottom;
  const ticks = niceTicks(low, high, Math.max(2, Math.floor(plotHeight / 48) + 1));
  const domain: [number, number] = yDomain ?? [ticks.min, ticks.max];
  const yTicks = yDomain ? ticks.ticks.filter((t) => t >= low && t <= high) : ticks.ticks;
  const y = linearScale(domain, [plotHeight, 0]);

  const ends = series.flatMap((s, index) => {
    const at = s.values.findLastIndex(isNumber);
    const value = s.values[at];
    return isNumber(value) ? [{ index, at, y: y(value), label: truncate(s.label, 16) }] : [];
  });
  const sorted = ends.map((end) => end.y).sort((a, b) => a - b);
  const hasRoom = sorted.every(
    (value, index) => index === 0 || value - (sorted[index - 1] ?? 0) >= labelGap,
  );
  const showLabels = hasDirectLabels && series.length <= 4 && width >= 480 && hasRoom;

  const left = Math.max(...yTicks.map((tick) => textWidth(vf.axis(tick)))) + 12;
  const right = showLabels ? Math.max(...ends.map((end) => textWidth(end.label))) + 18 : 14;
  const plotWidth = Math.max(40, width - left - right);

  const numbers = xNumbers(x);
  const xScale = linearScale(
    [Math.min(...numbers), Math.max(...numbers)],
    [edge, plotWidth - edge],
  );
  const at = (index: number) => xScale(numbers[index] ?? 0);

  const tickWidth = Math.max(...x.map((_, index) => textWidth(fx.tick(index)))) + 16;
  const xTicks = sampleIndexes(x.length, Math.floor(plotWidth / tickWidth));
  const showAllMarkers = x.length <= 12 && plotWidth / x.length >= 24;
  const active = interaction.active;

  const rows = (index: number): TooltipRow[] =>
    series.flatMap((s, position) => {
      const value = s.values[index];
      return isNumber(value)
        ? [{ id: s.id, label: s.label, value: vf.full(value), index: colors[position] ?? position }]
        : [];
    });

  return (
    <>
      <svg width={width} height={height} aria-hidden="true" className="block">
        <g transform={`translate(${left} ${margin.top})`}>
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={0}
                x2={plotWidth}
                y1={y(tick)}
                y2={y(tick)}
                className={
                  tick === 0 ? 'stroke-(--ui-border-default)' : 'stroke-(--ui-border-subtle)'
                }
              />
              <text
                x={-8}
                y={y(tick)}
                dy="0.32em"
                textAnchor="end"
                className="fill-(--ui-text-tertiary) text-xs"
              >
                {vf.axis(tick)}
              </text>
            </g>
          ))}
          {xTicks.map((index) => {
            const position = at(index);
            const anchor =
              position < tickWidth / 2
                ? 'start'
                : position > plotWidth - tickWidth / 2
                  ? 'end'
                  : 'middle';
            return (
              <text
                key={index}
                x={position}
                y={plotHeight + 18}
                textAnchor={anchor}
                className="fill-(--ui-text-tertiary) text-xs"
              >
                {fx.tick(index)}
              </text>
            );
          })}
          {active !== null && (
            <line
              x1={at(active)}
              x2={at(active)}
              y1={0}
              y2={plotHeight}
              className="stroke-(--ui-border-strong)"
            />
          )}
          {series.map((s, position) => {
            const style = seriesStyle(colors[position] ?? position);
            const points = s.values.map((value, index) =>
              isNumber(value) ? { index, x: at(index), y: y(value) } : null,
            );
            const path = points
              .map((point, index) =>
                point
                  ? `${points[index - 1] ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`
                  : '',
              )
              .join('');
            const lastAt = s.values.findLastIndex(isNumber);
            return (
              <g key={s.id}>
                <path
                  d={path}
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={style.dash}
                  className={style.stroke}
                />
                {points.map((point, index) => {
                  if (!point) return null;
                  const isAlone = !points[index - 1] && !points[index + 1];
                  const isActive = index === active;
                  if (!(showAllMarkers || isAlone || isActive || index === lastAt)) return null;
                  const r = isActive ? 5 : 4;
                  return (
                    <g key={index}>
                      <path
                        d={markerPath(style.shape, point.x, point.y, r + 2)}
                        className="fill-(--chart-surface)"
                      />
                      <path
                        d={markerPath(style.shape, point.x, point.y, r)}
                        className={style.fill}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
          {showLabels &&
            ends.map((end) => (
              <text
                key={end.index}
                x={at(end.at) + 12}
                y={end.y}
                dy="0.32em"
                className="fill-(--ui-text-secondary) text-xs"
              >
                {end.label}
              </text>
            ))}
        </g>
      </svg>
      {x.map((_, index) => {
        const from = index === 0 ? 0 : (at(index - 1) + at(index)) / 2;
        const to = index === x.length - 1 ? plotWidth : (at(index) + at(index + 1)) / 2;
        return (
          <ChartMark
            key={index}
            index={index}
            interaction={interaction}
            label={`${fx.full(index)}: ${rows(index)
              .map((row) => `${row.label} ${row.value}`)
              .join(', ')}`}
            style={{
              left: left + from,
              top: margin.top,
              width: Math.max(2, to - from),
              height: plotHeight,
            }}
          />
        );
      })}
      {active !== null && (
        <ChartTooltip
          x={left + at(active)}
          y={margin.top + plotHeight / 2}
          containerWidth={width}
          title={fx.full(active)}
          rows={rows(active)}
          variant="line"
        />
      )}
    </>
  );
}
