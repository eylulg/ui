import { describe, expect, it, vi } from 'vitest';
import { composeClassName, cx } from '../cx';

describe('cx', () => {
  it('lets the last Tailwind class win and drops falsy values', () => {
    const isLarge = Boolean(0);

    expect(cx('px-4 py-2', isLarge && 'px-6', undefined, 'px-8')).toBe('py-2 px-8');
  });

  it('loads without react-aria-components, so server components can import it', async () => {
    vi.resetModules();
    vi.doMock('react-aria-components', () => {
      throw new Error('react-aria-components must not be imported by cx');
    });

    await expect(import('../cx')).resolves.toHaveProperty('cx');

    vi.doUnmock('react-aria-components');
  });
});

describe('composeClassName', () => {
  it('merges base classes with a string or a render prop className', () => {
    const state = { isPressed: true, defaultClassName: undefined };

    const fromString = composeClassName<{ isPressed: boolean }>('px-8', 'px-4 py-2');
    const fromFunction = composeClassName<{ isPressed: boolean }>(
      ({ isPressed }) => (isPressed ? 'bg-red-500' : ''),
      ({ isPressed }) => (isPressed ? 'p-1' : 'p-2'),
    );

    expect(fromString(state)).toBe('py-2 px-8');
    expect(fromFunction(state)).toBe('p-1 bg-red-500');
  });
});
