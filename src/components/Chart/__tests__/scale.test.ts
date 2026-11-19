import { describe, expect, it } from 'vitest';
import { niceTicks, sampleIndexes } from '../scale';

describe('niceTicks', () => {
  it.each([
    { min: 0, max: 1496, count: 5, ticks: [0, 500, 1000, 1500] },
    { min: 0, max: 0.93, count: 5, ticks: [0, 0.25, 0.5, 0.75, 1] },
    { min: 3, max: 97, count: 4, ticks: [0, 50, 100] },
    { min: -40, max: 60, count: 5, ticks: [-50, -25, 0, 25, 50, 75] },
    { min: 0, max: 0, count: 5, ticks: [0, 0.25, 0.5, 0.75, 1] },
    { min: 0, max: 1, count: 5, ticks: [0, 1], isInteger: true },
    { min: 0, max: 3, count: 5, ticks: [0, 1, 2, 3], isInteger: true },
    { min: 0, max: 0, count: 5, ticks: [0, 1], isInteger: true },
  ])('covers $min to $max with round steps', ({ min, max, count, ticks, isInteger }) => {
    expect(niceTicks(min, max, count, isInteger).ticks).toEqual(ticks);
  });

  it('never goes below zero when every value is zero', () => {
    expect(niceTicks(0, 0, 4).min).toBe(0);
  });

  it('opens a range around a single value', () => {
    const { ticks } = niceTicks(5, 5, 4);

    expect(ticks[0]).toBeLessThan(5);
    expect(ticks[ticks.length - 1]).toBeGreaterThan(5);
  });
});

describe('sampleIndexes', () => {
  it.each([
    { length: 5, limit: 10, expected: [0, 1, 2, 3, 4] },
    { length: 30, limit: 7, expected: [0, 5, 10, 15, 20, 25] },
    { length: 3, limit: 0, expected: [0] },
  ])('keeps $limit of $length labels at most', ({ length, limit, expected }) => {
    expect(sampleIndexes(length, limit)).toEqual(expected);
  });
});
