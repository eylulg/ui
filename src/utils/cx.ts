import { twMerge, type ClassNameValue } from 'tailwind-merge';
import { composeRenderProps } from 'react-aria-components';

/**
 * Joins class names and resolves Tailwind conflicts so the last one wins.
 * Falsy values are ignored, which keeps conditional classes readable:
 *
 *   cx('px-4 py-2', isLarge && 'px-6', className)
 */
export function cx(...inputs: ClassNameValue[]): string {
  return twMerge(...inputs);
}

/**
 * Merges a component's own classes with a consumer `className` that may be a
 * string or a React Aria render-prop function.
 */
export function composeClassName<T>(
  className:
    string | ((values: T & { defaultClassName: string | undefined }) => string) | undefined,
  base: string | ((values: T) => string),
): string | ((values: T & { defaultClassName: string | undefined }) => string) {
  return composeRenderProps(className, (consumer, values) =>
    cx(typeof base === 'function' ? base(values) : base, consumer),
  );
}
