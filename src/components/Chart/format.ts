import type { XValue } from './types';

export type XKind = 'time' | 'number' | 'category';

const day = 24 * 60 * 60 * 1000;

export function xKind(xs: XValue[]): XKind {
  const first = xs[0];
  if (first instanceof Date) return 'time';
  return typeof first === 'number' ? 'number' : 'category';
}

/** Where each x sits along the axis: its time or value, or its index for categories. */
export function xNumbers(xs: XValue[]): number[] {
  return xs.map((x, index) => {
    if (x instanceof Date) return x.getTime();
    return typeof x === 'number' ? x : index;
  });
}

export interface XFormat {
  /** Short text for an axis tick. */
  tick: (index: number) => string;
  /** Full text for a tooltip, the table and accessible names. */
  full: (index: number) => string;
}

export function createXFormat(
  xs: XValue[],
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): XFormat {
  const kind = xKind(xs);
  if (kind === 'time') {
    const times = xNumbers(xs);
    const span = Math.max(...times) - Math.min(...times);
    const timeZone = options?.timeZone;
    const tickOptions: Intl.DateTimeFormatOptions =
      options ??
      (span < 2 * day
        ? { hour: 'numeric', minute: '2-digit' }
        : span > 400 * day
          ? { month: 'short', year: 'numeric' }
          : { month: 'short', day: 'numeric' });
    const tick = new Intl.DateTimeFormat(locale, tickOptions);
    const full = new Intl.DateTimeFormat(
      locale,
      span < 2 * day
        ? { dateStyle: 'medium', timeStyle: 'short', timeZone }
        : { dateStyle: 'medium', timeZone },
    );
    const pick = (format: Intl.DateTimeFormat) => (index: number) => {
      const x = xs[index];
      return x instanceof Date ? format.format(x) : '';
    };
    return { tick: pick(tick), full: pick(full) };
  }
  if (kind === 'number') {
    const format = new Intl.NumberFormat(locale);
    const text = (index: number) => {
      const x = xs[index];
      return typeof x === 'number' ? format.format(x) : '';
    };
    return { tick: text, full: text };
  }
  const text = (index: number) => String(xs[index] ?? '');
  return { tick: text, full: text };
}

export interface ValueFormat {
  full: (value: number) => string;
  /** Compact above 10,000, so axis labels stay short. */
  axis: (value: number) => string;
}

export function createValueFormat(
  max: number,
  locale?: string,
  options?: Intl.NumberFormatOptions,
): ValueFormat {
  const full = new Intl.NumberFormat(locale, options);
  const compact = max >= 10000 && options?.style !== 'percent';
  const axis = compact
    ? new Intl.NumberFormat(locale, { ...options, notation: 'compact', maximumFractionDigits: 1 })
    : full;
  return { full: (value) => full.format(value), axis: (value) => axis.format(value) };
}

/** Rough width of `text` at 12px in the UI font, for margins and tick density. */
export function textWidth(text: string): number {
  return text.length * 6.6;
}

/** Shortens text to `limit` characters with an ellipsis. */
export function truncate(text: string, limit: number): string {
  return text.length > limit ? `${text.slice(0, Math.max(1, limit - 1))}…` : text;
}
