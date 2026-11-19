import { useId, useState, type ReactNode } from 'react';
import { useFocusRing } from 'react-aria/useFocusRing';
import { focusRing } from '../../internal/focusRing';
import { cx } from '../../utils/cxLite';
import { ChartTable } from './ChartTable';
import { chartLabels } from './labels';
import type { ChartBaseProps } from './types';
import { useElementWidth } from './useElementWidth';

const card = 'rounded-xl border border-subtle bg-elevated p-card shadow-xs';
const toggle =
  'inline-flex h-control-sm cursor-pointer items-center rounded-md px-3 text-sm font-semibold text-secondary transition-colors hover:bg-hover hover:text-primary';

export interface ChartTableData {
  head: string[];
  rows: string[][];
}

interface ChartFrameProps extends Pick<
  ChartBaseProps,
  'title' | 'hideTitle' | 'labels' | 'isCard' | 'className'
> {
  /** The text for assistive technology. */
  summary: string;
  legend?: ReactNode;
  table: ChartTableData;
  isEmpty: boolean;
  /** Width used before the first measurement, and on the server. */
  fallbackWidth?: number;
  /** Receives the measured plot width. Render the plot, and any tooltip, inside. */
  children: (width: number) => ReactNode;
}

/**
 * The parts every chart shares: a named figure, the generated summary, an optional legend, the
 * plot at the measured width, and a "Show table" toggle that reveals the data as a real table.
 *
 * The table is a toggle rather than a hidden table. A visually hidden table serves screen reader
 * users only; the toggle also serves people who want exact values, who zoom in, or who find a dense
 * plot hard to read. The button is in the tab order and states whether the table is open.
 */
export function ChartFrame({
  title,
  hideTitle = false,
  summary,
  labels,
  isCard = false,
  className,
  legend,
  table,
  isEmpty,
  fallbackWidth = 480,
  children,
}: ChartFrameProps) {
  const text = chartLabels(labels);
  const id = useId();
  const [isOpen, setOpen] = useState(false);
  const [ref, width] = useElementWidth<HTMLDivElement>(fallbackWidth);
  const { focusProps, isFocusVisible } = useFocusRing();

  function toggleTable() {
    setOpen((open) => !open);
  }

  return (
    <figure
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-summary`}
      className={cx(
        'm-0 flex min-w-0 flex-col gap-3',
        isCard
          ? [card, '[--chart-surface:var(--ui-bg-elevated)]']
          : '[--chart-surface:var(--ui-bg-primary)]',
        className,
      )}
    >
      <figcaption
        id={`${id}-title`}
        className={hideTitle ? 'sr-only' : 'text-sm font-semibold text-primary'}
      >
        {title}
      </figcaption>
      <p id={`${id}-summary`} className="sr-only">
        {isEmpty ? text.empty : summary}
      </p>
      {isEmpty ? (
        <p className="py-8 text-center text-sm text-tertiary">{text.empty}</p>
      ) : (
        <>
          {legend}
          <div ref={ref} className="relative min-w-0">
            {children(width)}
          </div>
          <div className="-ml-3">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${id}-table`}
              data-focus-visible={isFocusVisible || undefined}
              className={cx(toggle, focusRing)}
              onClick={toggleTable}
              {...focusProps}
            >
              {isOpen ? text.hideTable : text.showTable}
            </button>
          </div>
          {isOpen && (
            <ChartTable id={`${id}-table`} caption={title} head={table.head} rows={table.rows} />
          )}
        </>
      )}
    </figure>
  );
}
