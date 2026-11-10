import { describe, expect, it } from 'vitest';
import { cx } from '../cxLite';

describe('cx-lite', () => {
  it('joins strings and nested arrays, skips falsy values and keeps conflicting classes', () => {
    const isLarge = Boolean(0);

    expect(cx('px-4 py-2', isLarge && 'px-6', undefined, ['a', [null, 'b']], 'px-8')).toBe(
      'px-4 py-2 a b px-8',
    );
  });
});
