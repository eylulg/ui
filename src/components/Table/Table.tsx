import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Cell as AriaCell,
  Collection,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  composeRenderProps,
  useTableOptions,
  type CellProps as AriaCellProps,
  type ColumnProps as AriaColumnProps,
  type RowProps as AriaRowProps,
  type TableBodyProps as AriaTableBodyProps,
  type TableHeaderProps as AriaTableHeaderProps,
  type TableProps as AriaTableProps,
} from 'react-aria-components';
import { focusRing } from '../../internal/focusRing';
import { cx } from '../../utils/cx';
import { Checkbox } from '../Checkbox/Checkbox';

export type CellAlign = 'start' | 'end';

export interface TableProps extends AriaTableProps {
  /**
   * Height limit of the scroll container, for example "24rem". The header
   * stays visible while the body scrolls.
   */
  maxHeight?: string;
  /** Class for the scroll container around the table. */
  containerClassName?: string;
}

const container = 'w-full overflow-auto rounded-lg border border-subtle bg-primary';
const table = 'w-full border-separate border-spacing-0 text-sm text-primary outline-none';
const headerCell =
  'sticky top-0 z-10 border-b border-subtle bg-secondary px-cell-x py-cell-y text-left text-xs font-semibold whitespace-nowrap text-tertiary';
const sortableHeader = 'cursor-pointer data-hovered:text-secondary';
const bodyCell = 'border-b border-subtle px-cell-x py-cell-y font-data text-secondary';
const rowBase =
  'cursor-default outline-none data-hovered:bg-hover data-selected:bg-brand-subtle data-focus-visible:outline-2 data-focus-visible:outline-solid data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus';
const selectionCell = 'w-10 px-cell-x';
const emptyState = 'px-cell-x py-10 text-center text-sm text-tertiary';

const align: Record<CellAlign, string> = {
  start: 'text-left',
  end: 'text-right tabular-nums',
};

/**
 * A data table on React Aria's Table: arrow keys move between cells, Space
 * toggles selection, and pressing a sortable column header sorts it. The
 * header is sticky inside the scroll container. No virtualisation, so keep it
 * to a few hundred rows.
 */
export function Table({ maxHeight, containerClassName, className, ...props }: TableProps) {
  return (
    <div className={cx(container, containerClassName)} style={{ maxHeight }}>
      <AriaTable
        {...props}
        className={composeRenderProps(className, (consumer) => cx(table, consumer))}
      />
    </div>
  );
}

export interface TableHeaderProps<T extends object> extends AriaTableHeaderProps<T> {
  /** Accessible name of the selection column in single selection mode. */
  selectionLabel?: string;
}

/** Adds a selection column with a select all checkbox when the table is selectable. */
export function TableHeader<T extends object>({
  columns,
  children,
  selectionLabel = 'Selection',
  ...props
}: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode } = useTableOptions();
  const hasSelectionColumn = selectionBehavior === 'toggle' && selectionMode !== 'none';

  return (
    <AriaTableHeader {...props} columns={columns}>
      {hasSelectionColumn && (
        <AriaColumn className={cx(headerCell, selectionCell)}>
          {selectionMode === 'multiple' ? (
            <Checkbox slot="selection" />
          ) : (
            <span className="sr-only">{selectionLabel}</span>
          )}
        </AriaColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  );
}

export interface ColumnProps extends Omit<AriaColumnProps, 'children'> {
  children: ReactNode;
  /** Right aligns the header, for numeric columns. Pair with `align="end"` on cells. */
  align?: CellAlign;
}

export function Column({ children, align: alignment = 'start', className, ...props }: ColumnProps) {
  return (
    <AriaColumn
      {...props}
      className={composeRenderProps(className, (consumer, { allowsSorting }) =>
        cx(headerCell, align[alignment], allowsSorting && sortableHeader, focusRing, consumer),
      )}
    >
      {({ allowsSorting, sortDirection }) => (
        <span
          className={cx(
            'inline-flex items-center gap-1',
            alignment === 'end' && 'flex-row-reverse',
          )}
        >
          {children}
          {allowsSorting && <SortIcon direction={sortDirection} />}
        </span>
      )}
    </AriaColumn>
  );
}

function SortIcon({ direction }: { direction: 'ascending' | 'descending' | undefined }) {
  if (direction === 'ascending') return <ArrowUp aria-hidden="true" className="size-3.5" />;
  if (direction === 'descending') return <ArrowDown aria-hidden="true" className="size-3.5" />;
  return <ChevronsUpDown aria-hidden="true" className="size-3.5 text-fg-disabled" />;
}

export interface TableBodyProps<T extends object> extends AriaTableBodyProps<T> {
  /** Text or element shown when there are no rows. */
  emptyState?: ReactNode;
}

export function TableBody<T extends object>({ emptyState: empty, ...props }: TableBodyProps<T>) {
  function renderEmptyState() {
    return <div className={emptyState}>{empty}</div>;
  }

  return <AriaTableBody {...props} renderEmptyState={empty ? renderEmptyState : undefined} />;
}

export function Row<T extends object>({
  id,
  columns,
  children,
  className,
  ...props
}: AriaRowProps<T>) {
  const { selectionBehavior, selectionMode } = useTableOptions();
  const hasSelectionCell = selectionBehavior === 'toggle' && selectionMode !== 'none';

  return (
    <AriaRow
      {...props}
      id={id}
      columns={columns}
      className={composeRenderProps(className, (consumer) => cx(rowBase, consumer))}
    >
      {hasSelectionCell && (
        <AriaCell className={cx(bodyCell, selectionCell)}>
          <Checkbox slot="selection" />
        </AriaCell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

export interface CellProps extends AriaCellProps {
  align?: CellAlign;
}

export function Cell({ align: alignment = 'start', className, ...props }: CellProps) {
  return (
    <AriaCell
      {...props}
      className={composeRenderProps(className, (consumer) =>
        cx(bodyCell, align[alignment], consumer),
      )}
    />
  );
}
