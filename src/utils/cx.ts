import { twMerge, type ClassNameValue } from 'tailwind-merge';

/**
 * Joins class names and resolves Tailwind conflicts so the last one wins.
 * Falsy values are ignored, which keeps conditional classes readable:
 *
 *   cx('px-4 py-2', isLarge && 'px-6', className)
 *
 * This module imports nothing but tailwind-merge, so it is safe to use in a
 * React Server Component.
 */
export function cx(...inputs: ClassNameValue[]): string {
  return twMerge(...inputs);
}

type ClassNameProp<T> =
  string | ((values: T & { defaultClassName: string | undefined }) => string) | undefined;

/**
 * Merges a component's own classes with a consumer `className` that may be a
 * string or a React Aria render-prop function. Same result as React Aria's
 * `composeRenderProps`, without importing it.
 */
export function composeClassName<T>(
  className: ClassNameProp<T>,
  base: string | ((values: T) => string),
): (values: T & { defaultClassName: string | undefined }) => string {
  return (values) =>
    cx(
      typeof base === 'function' ? base(values) : base,
      typeof className === 'function' ? className(values) : className,
    );
}
