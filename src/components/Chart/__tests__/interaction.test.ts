import { describe, expect, it } from 'vitest';
import { nextIndex } from '../interaction';

describe('nextIndex in one line', () => {
  it.each([
    { key: 'ArrowRight', from: 1, to: 2 },
    { key: 'ArrowDown', from: 1, to: 2 },
    { key: 'ArrowLeft', from: 1, to: 0 },
    { key: 'ArrowUp', from: 1, to: 0 },
    { key: 'ArrowLeft', from: 0, to: -1 },
    { key: 'ArrowRight', from: 4, to: -1 },
    { key: 'Home', from: 3, to: 0 },
    { key: 'End', from: 1, to: 4 },
    { key: 'a', from: 1, to: -1 },
  ])('$key from $from goes to $to', ({ key, from, to }) => {
    expect(nextIndex(key, false, from, 5)).toBe(to);
  });
});

describe('nextIndex in a grid of 3 columns and 3 rows', () => {
  it.each([
    { key: 'ArrowRight', ctrl: false, from: 4, to: 5 },
    { key: 'ArrowRight', ctrl: false, from: 5, to: -1 },
    { key: 'ArrowLeft', ctrl: false, from: 3, to: -1 },
    { key: 'ArrowDown', ctrl: false, from: 4, to: 7 },
    { key: 'ArrowDown', ctrl: false, from: 7, to: -1 },
    { key: 'ArrowUp', ctrl: false, from: 1, to: -1 },
    { key: 'Home', ctrl: false, from: 5, to: 3 },
    { key: 'End', ctrl: false, from: 3, to: 5 },
    { key: 'Home', ctrl: true, from: 7, to: 0 },
    { key: 'End', ctrl: true, from: 1, to: 8 },
  ])('$key (ctrl $ctrl) from $from goes to $to', ({ key, ctrl, from, to }) => {
    expect(nextIndex(key, ctrl, from, 9, 3)).toBe(to);
  });
});
