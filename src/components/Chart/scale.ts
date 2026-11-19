export interface NiceScale {
  ticks: number[];
  min: number;
  max: number;
}

const steps = [1, 2, 2.5, 5, 10];

function decimals(step: number): number {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

/**
 * Round tick values that cover `min` to `max`, about `count` of them. The domain is widened to the
 * first and last tick, so a bar chart can start at a clean zero and end at a clean top.
 */
export function niceTicks(min: number, max: number, count: number): NiceScale {
  if (min === max) {
    const pad = min === 0 ? 1 : Math.abs(min) * 0.1;
    return niceTicks(min - pad, max + pad, count);
  }
  const raw = (max - min) / Math.max(1, count - 1);
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = (steps.find((s) => s * magnitude >= raw) ?? 10) * magnitude;
  const first = Math.floor(min / step) * step;
  const last = Math.ceil(max / step) * step;
  const places = decimals(step);
  const ticks: number[] = [];
  for (let value = first; value <= last + step / 2; value += step) {
    ticks.push(Number(value.toFixed(places)));
  }
  return { ticks, min: first, max: last };
}

/** A linear map from a domain to a range. A zero width domain maps to the middle of the range. */
export function linearScale(
  [d0, d1]: [number, number],
  [r0, r1]: [number, number],
): (value: number) => number {
  if (d0 === d1) return () => (r0 + r1) / 2;
  const ratio = (r1 - r0) / (d1 - d0);
  return (value) => r0 + (value - d0) * ratio;
}

/** Evenly spaced indexes, starting at 0, so that at most `limit` labels are drawn. */
export function sampleIndexes(length: number, limit: number): number[] {
  const step = Math.max(1, Math.ceil(length / Math.max(1, limit)));
  return Array.from({ length: Math.ceil(length / step) }, (_, index) => index * step);
}
