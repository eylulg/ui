import { Check, Minus, TriangleAlert, X } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import { mergeProps } from 'react-aria/mergeProps';
import { useFocusRing } from 'react-aria/useFocusRing';
import { focusRing } from '../../internal/focusRing';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cxLite';
import { ChartFrame } from './ChartFrame';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip } from './ChartTooltip';
import { createValueFormat, truncate } from './format';
import { useChartInteraction, type Interaction } from './interaction';
import type { ChartBaseProps } from './types';

export type HeatGridTone = 'success' | 'error' | 'warning' | 'neutral';

export interface HeatGridState {
  /** Shown in the legend, the tooltip, the table and to screen readers. */
  label: string;
  /** Picks the fill and the icon. Every tone has its own icon, so colour is never the only signal. */
  tone: HeatGridTone;
}

export interface HeatGridLine {
  id: string;
  label: string;
}

export interface HeatGridCell {
  /** The `id` of a row. */
  row: string;
  /** The `id` of a column. */
  column: string;
  /** In value mode, the number shown. */
  value?: number;
  /** In state mode, a key of `states`. */
  state?: string;
  /** Extra text for the tooltip, such as why a check failed. */
  detail?: string;
}

export interface HeatGridProps extends Omit<ChartBaseProps, 'height'> {
  rows: HeatGridLine[];
  columns: HeatGridLine[];
  /** Cells that are missing show as empty. */
  cells: HeatGridCell[];
  /**
   * Turns on state mode: each cell is one of these states, drawn with a fill and an icon. Without
   * it the grid is in value mode and shades each cell by its number in five steps.
   */
  states?: Record<string, HeatGridState>;
  /** Header of the first table column, and the label of the row headers. */
  rowLabel?: string;
  /** Intl options for values in value mode. */
  valueFormat?: Intl.NumberFormatOptions;
  /** Prints the number in each cell in value mode. Defaults to true. */
  hasValueLabels?: boolean;
}

const tones: Record<HeatGridTone, { cell: string; ink: string; icon: IconComponent }> = {
  success: { cell: 'bg-success-subtle text-success', ink: 'text-success', icon: Check },
  error: { cell: 'bg-error-subtle text-error', ink: 'text-error', icon: X },
  warning: { cell: 'bg-warning-subtle text-warning', ink: 'text-warning', icon: TriangleAlert },
  neutral: { cell: 'bg-tertiary text-tertiary', ink: 'text-tertiary', icon: Minus },
};

const lightInk = 'text-chart-seq-ink-dark dark:text-chart-seq-ink-light';
const darkInk = 'text-chart-seq-ink-light dark:text-chart-seq-ink-dark';
const steps = [
  cx('bg-chart-seq-1', lightInk),
  cx('bg-chart-seq-2', lightInk),
  cx('bg-chart-seq-3', lightInk),
  cx('bg-chart-seq-4', darkInk),
  cx('bg-chart-seq-5', darkInk),
];

const cell =
  'flex h-9 min-w-0 items-center justify-center rounded-xs text-xs font-medium tabular-nums';
const stateCell = 'border border-current/30';

function stepOf(value: number, min: number, max: number): number {
  if (max === min) return 2;
  return Math.min(steps.length - 1, Math.floor(((value - min) / (max - min)) * steps.length));
}

function ToneIcon({ tone, className }: { tone: HeatGridTone; className?: string }) {
  const Icon = tones[tone].icon;
  return <Icon aria-hidden="true" className={className ?? 'size-4'} strokeWidth={2.5} />;
}

/**
 * A matrix of rows by columns. In state mode each cell is a state such as pass or fail, shown with
 * a fill and an icon; in value mode each cell is shaded by its number. Arrow keys move between
 * cells, and hover or focus shows the row, the column and the detail.
 */
export function HeatGrid({
  rows,
  columns,
  cells,
  states,
  rowLabel = 'Row',
  valueFormat,
  hasValueLabels = true,
  title,
  hideTitle,
  summary,
  locale,
  labels,
  isCard,
  className,
}: HeatGridProps) {
  const byPosition = new Map(cells.map((c) => [`${c.row}\u0000${c.column}`, c]));
  const at = (row: string, column: string) => byPosition.get(`${row}\u0000${column}`);
  const numbers = cells.flatMap((c) => (c.value === undefined ? [] : [c.value]));
  const [min, max] = [Math.min(...numbers), Math.max(...numbers)];
  const vf = createValueFormat(Math.max(Math.abs(min), Math.abs(max)), locale, valueFormat);

  const describe = (c: HeatGridCell | undefined): string => {
    if (!c) return '';
    if (states) return states[c.state ?? '']?.label ?? '';
    return c.value === undefined ? '' : vf.full(c.value);
  };

  const counts = states
    ? Object.entries(states)
        .map(([key, state]) => `${cells.filter((c) => c.state === key).length} ${state.label}`)
        .join(', ')
    : numbers.length > 0
      ? `values from ${vf.full(min)} to ${vf.full(max)}`
      : '';
  const headline = `Grid of ${rows.length} rows by ${columns.length} columns: ${counts}.`;

  return (
    <ChartFrame
      title={title}
      hideTitle={hideTitle}
      labels={labels}
      isCard={isCard}
      className={className}
      isEmpty={rows.length === 0 || columns.length === 0}
      summary={summary ?? headline}
      legend={
        states ? (
          <ChartLegend
            items={Object.entries(states).map(([key, state]) => ({
              id: key,
              label: state.label,
              marker: (
                <span
                  aria-hidden="true"
                  className={cx(
                    'flex size-5 shrink-0 items-center justify-center rounded-xs',
                    stateCell,
                    tones[state.tone].cell,
                  )}
                >
                  <ToneIcon tone={state.tone} className="size-3.5" />
                </span>
              ),
            }))}
          />
        ) : (
          numbers.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-secondary">
              <span>{vf.full(min)}</span>
              <span aria-hidden="true" className="flex gap-0.5">
                {steps.map((step) => (
                  <span
                    key={step}
                    className={cx('h-3 w-6 first:rounded-l-xs last:rounded-r-xs', step)}
                  />
                ))}
              </span>
              <span>{vf.full(max)}</span>
            </div>
          )
        )
      }
      table={{
        head: [rowLabel, ...columns.map((c) => c.label)],
        rows: rows.map((row) => [
          row.label,
          ...columns.map((column) => describe(at(row.id, column.id))),
        ]),
      }}
    >
      {(width) => (
        <HeatPlot
          width={width}
          rows={rows}
          columns={columns}
          rowLabel={rowLabel}
          states={states}
          hasValueLabels={hasValueLabels}
          title={title}
          lookup={at}
          format={vf.full}
          range={[min, max]}
        />
      )}
    </ChartFrame>
  );
}

interface HeatPlotProps extends Pick<
  HeatGridProps,
  'rows' | 'columns' | 'states' | 'hasValueLabels' | 'title'
> {
  width: number;
  rowLabel: string;
  lookup: (row: string, column: string) => HeatGridCell | undefined;
  format: (value: number) => string;
  range: [number, number];
}

function HeatPlot({
  width,
  rows,
  columns,
  rowLabel,
  states,
  hasValueLabels,
  title,
  lookup,
  format,
  range,
}: HeatPlotProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, below: false });
  const interaction = useChartInteraction(
    rows.length * columns.length,
    columns.length,
    (element) => {
      const box = wrapper.current?.getBoundingClientRect();
      const target = element?.getBoundingClientRect();
      if (!box || !target) return;
      const top = target.top - box.top;
      const below = top < 96;
      setAnchor({
        x: target.left - box.left + target.width / 2,
        y: below ? top + target.height : top,
        below,
      });
    },
  );

  const headerWidth = width < 420 ? 88 : 144;
  const template = `${headerWidth}px repeat(${columns.length}, minmax(2.25rem, 1fr))`;
  const isVertical = columns.length > 6 || width < 420;
  const columnChars = Math.max(6, Math.floor((width - headerWidth) / columns.length / 6.6));
  const activeRow =
    interaction.active === null ? null : rows[Math.floor(interaction.active / columns.length)];
  const activeColumn =
    interaction.active === null ? null : columns[interaction.active % columns.length];
  const activeCell = activeRow && activeColumn ? lookup(activeRow.id, activeColumn.id) : undefined;
  const activeState = states?.[activeCell?.state ?? ''];

  return (
    <div ref={wrapper} className="relative">
      <div className="max-w-full overflow-x-auto p-1">
        <div role="grid" aria-label={title} className="flex w-max min-w-full flex-col gap-0.5">
          <div role="row" className="grid gap-0.5" style={{ gridTemplateColumns: template }}>
            <div
              role="columnheader"
              className="sticky left-0 bg-(--chart-surface) text-xs text-tertiary"
            >
              {rowLabel}
            </div>
            {columns.map((column) => (
              <div
                key={column.id}
                role="columnheader"
                className={cx(
                  'flex min-w-0 justify-center pb-1 text-xs font-medium text-secondary',
                  isVertical ? 'items-end' : 'text-center',
                )}
              >
                {isVertical ? (
                  <span className="max-h-28 rotate-180 overflow-hidden text-ellipsis whitespace-nowrap [writing-mode:vertical-rl]">
                    {column.label}
                  </span>
                ) : (
                  truncate(column.label, columnChars)
                )}
              </div>
            ))}
          </div>
          {rows.map((row, rowIndex) => (
            <div
              key={row.id}
              role="row"
              className="grid gap-0.5"
              style={{ gridTemplateColumns: template }}
            >
              <div
                role="rowheader"
                className="sticky left-0 flex items-center bg-(--chart-surface) pr-2 text-sm text-primary"
              >
                <span className="truncate">
                  {truncate(row.label, Math.floor(headerWidth / 6.6))}
                </span>
              </div>
              {columns.map((column, columnIndex) => {
                const data = lookup(row.id, column.id);
                const index = rowIndex * columns.length + columnIndex;
                const state = states?.[data?.state ?? ''];
                return (
                  <HeatCell
                    key={column.id}
                    index={index}
                    interaction={interaction}
                    className={cx(
                      cell,
                      state
                        ? [stateCell, tones[state.tone].cell]
                        : data?.value !== undefined
                          ? steps[stepOf(data.value, range[0], range[1])]
                          : 'bg-secondary',
                    )}
                  >
                    {state ? (
                      <>
                        <ToneIcon tone={state.tone} />
                        <span className="sr-only">{state.label}</span>
                      </>
                    ) : data?.value !== undefined ? (
                      <span className={hasValueLabels ? undefined : 'sr-only'}>
                        {format(data.value)}
                      </span>
                    ) : (
                      <span className="sr-only">No data</span>
                    )}
                  </HeatCell>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {activeRow && activeColumn && (
        <ChartTooltip
          x={anchor.x}
          y={anchor.y}
          containerWidth={width}
          title={`${activeRow.label}, ${activeColumn.label}`}
          variant="bar"
          placement={anchor.below ? 'below' : 'above'}
          rows={[
            {
              id: 'cell',
              value: activeState
                ? activeState.label
                : activeCell?.value === undefined
                  ? 'No data'
                  : format(activeCell.value),
              label: activeCell?.detail ?? '',
              marker: activeState ? (
                <span className={cx('shrink-0', tones[activeState.tone].ink)}>
                  <ToneIcon tone={activeState.tone} className="size-3.5" />
                </span>
              ) : undefined,
            },
          ]}
        />
      )}
    </div>
  );
}

interface HeatCellProps {
  index: number;
  interaction: Interaction;
  className: string;
  children: ReactNode;
}

function HeatCell({ index, interaction, className, children }: HeatCellProps) {
  const { focusProps, isFocusVisible } = useFocusRing();
  const props = mergeProps(interaction.markProps(index), focusProps);
  return (
    <div
      role="gridcell"
      data-focus-visible={isFocusVisible || undefined}
      className={cx(className, focusRing)}
      {...props}
    >
      {children}
    </div>
  );
}
