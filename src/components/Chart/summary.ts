import type { ChartSeries } from './types';

const maxDescribed = 3;

function indexOfValue(values: Array<number | null>, target: number): number {
  return values.findIndex((value) => value === target);
}

/** One sentence about a series: where it starts and ends, and its lowest and highest points. */
export function describeSeries(
  series: ChartSeries,
  positions: string[],
  format: (value: number) => string,
): string {
  const known = series.values.flatMap((value, index) => (value === null ? [] : [{ value, index }]));
  const first = known[0];
  const last = known[known.length - 1];
  if (!first || !last) return `${series.label}: no values.`;
  if (known.length === 1)
    return `${series.label}: ${format(first.value)} at ${positions[first.index]}.`;
  const numbers = known.map((point) => point.value);
  const low = Math.min(...numbers);
  const high = Math.max(...numbers);
  const at = (value: number) => positions[indexOfValue(series.values, value)] ?? '';
  return `${series.label}: from ${format(first.value)} to ${format(last.value)}, lowest ${format(low)} at ${at(low)}, highest ${format(high)} at ${at(high)}.`;
}

/** Describes the first few series in full and counts the rest. */
export function describeAll(
  headline: string,
  series: ChartSeries[],
  positions: string[],
  format: (value: number) => string,
): string {
  const described = series.slice(0, maxDescribed).map((s) => describeSeries(s, positions, format));
  const rest = series.length - described.length;
  if (rest > 0)
    described.push(`${rest} more ${rest === 1 ? 'series is' : 'series are'} in the table.`);
  return [headline, ...described].join(' ');
}

export function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

/** One sentence per series about its highest and lowest category, for the first few series. */
export function describeBars(
  headline: string,
  categories: string[],
  series: ChartSeries[],
  format: (value: number) => string,
): string {
  const described = series.slice(0, maxDescribed).map((s) => {
    const known = s.values.flatMap((value, index) => (value === null ? [] : [{ value, index }]));
    const sorted = known.toSorted((a, b) => b.value - a.value);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];
    if (!top || !bottom) return `${s.label}: no values.`;
    const name = (point: { index: number }) => categories[point.index] ?? '';
    if (known.length === 1) return `${s.label}: ${format(top.value)} for ${name(top)}.`;
    return `${s.label}: highest ${name(top)} at ${format(top.value)}, lowest ${name(bottom)} at ${format(bottom.value)}.`;
  });
  const rest = series.length - described.length;
  if (rest > 0)
    described.push(`${rest} more ${rest === 1 ? 'series is' : 'series are'} in the table.`);
  return [headline, ...described].join(' ');
}
