import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { mergeProps } from 'react-aria/mergeProps';
import { useFocusRing } from 'react-aria/useFocusRing';
import { focusRing } from '../../internal/focusRing';
import { cx } from '../../utils/cxLite';

/**
 * Where the arrow keys lead from `index`, or -1 to stay put. With `columns` the marks form a grid
 * (left and right along a row, up and down across rows, Ctrl with Home or End for the corners);
 * without it they form one line that every arrow key walks.
 */
export function nextIndex(
  key: string,
  ctrl: boolean,
  index: number,
  count: number,
  columns = 0,
): number {
  const last = count - 1;
  const rowStart = columns ? index - (index % columns) : 0;
  let target = -1;
  if (key === 'Home') target = ctrl ? 0 : rowStart;
  else if (key === 'End') target = ctrl ? last : columns ? rowStart + columns - 1 : last;
  else if (columns === 0) {
    if (key === 'ArrowRight' || key === 'ArrowDown') target = index + 1;
    if (key === 'ArrowLeft' || key === 'ArrowUp') target = index - 1;
  } else {
    const column = index % columns;
    if (key === 'ArrowRight' && column < columns - 1) target = index + 1;
    if (key === 'ArrowLeft' && column > 0) target = index - 1;
    if (key === 'ArrowDown') target = index + columns;
    if (key === 'ArrowUp') target = index - columns;
  }
  return target < 0 || target > last || target === index ? -1 : target;
}

interface MarkHandlers {
  ref: (element: HTMLElement | null) => void;
  tabIndex: number;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export interface Interaction {
  /** The mark whose tooltip is showing, from the pointer or the keyboard. */
  active: number | null;
  markProps: (index: number) => MarkHandlers;
}

/**
 * Pointer and keyboard state shared by the charts: one tab stop that moves with the arrow keys
 * (roving tabindex), hover and focus both open the tooltip, and Escape closes it until the next
 * move. Escape is only consumed while a tooltip is open, so a second press reaches a dialog around
 * the chart. `onActivate` receives the element of the mark that was just hovered or focused.
 */
export function useChartInteraction(
  count: number,
  columns = 0,
  onActivate?: (element: HTMLElement | null) => void,
): Interaction {
  const [roving, setRoving] = useState(0);
  const [focused, setFocused] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const marks = useRef(new Map<number, HTMLElement>());
  const current = Math.min(roving, Math.max(0, count - 1));
  const isOpen = !dismissed && (hovered ?? focused) !== null;

  function activate(index: number) {
    setDismissed(false);
    onActivate?.(marks.current.get(index) ?? null);
  }

  function markProps(index: number): MarkHandlers {
    return {
      ref: (element) => {
        if (element) marks.current.set(index, element);
        else marks.current.delete(index);
      },
      tabIndex: index === current ? 0 : -1,
      onFocus: () => {
        setRoving(index);
        setFocused(index);
        activate(index);
      },
      onBlur: () => setFocused(null),
      onKeyDown: (event) => {
        if (event.key === 'Escape') {
          if (!isOpen) return;
          event.stopPropagation();
          setDismissed(true);
          return;
        }
        const target = nextIndex(event.key, event.ctrlKey || event.metaKey, index, count, columns);
        if (target === -1) return;
        event.preventDefault();
        marks.current.get(target)?.focus();
      },
      onPointerEnter: () => {
        setHovered(index);
        activate(index);
      },
      onPointerLeave: () => setHovered(null),
    };
  }

  return { active: isOpen ? (hovered ?? focused) : null, markProps };
}

interface ChartMarkProps {
  index: number;
  interaction: Interaction;
  /** The full description, read by a screen reader when the mark takes focus. */
  label: string;
  style: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/**
 * An invisible, focusable hit area laid over the plot. It is bigger than the mark it stands for,
 * shows the library focus ring for keyboard focus and opens the tooltip.
 */
export function ChartMark({
  index,
  interaction,
  label,
  style,
  className,
  children,
}: ChartMarkProps) {
  const { focusProps, isFocusVisible } = useFocusRing();
  const props = mergeProps(interaction.markProps(index), focusProps);

  return (
    <div
      role="img"
      aria-label={label}
      data-focus-visible={isFocusVisible || undefined}
      className={cx('absolute rounded-xs', focusRing, className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
