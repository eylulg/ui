export type ClassValue = string | number | false | null | undefined | ClassValue[];

/**
 * Joins class names and skips falsy values, without resolving Tailwind
 * conflicts. About 8 kB gzip lighter than `cx`, which carries tailwind-merge:
 *
 *   cx('px-4 py-2', isLarge && 'px-6')   // both px classes stay
 *
 * Use it for your own markup where no two classes compete. Use `cx` when a
 * later class must override an earlier one, for example when merging a
 * `className` prop into a component's defaults.
 */
export function cx(...inputs: ClassValue[]): string {
  let result = '';
  for (const input of inputs) {
    const value = Array.isArray(input) ? cx(...input) : input;
    if (value === false || value === null || value === undefined || value === 0 || value === '') {
      continue;
    }
    result += result ? ` ${value}` : `${value}`;
  }
  return result;
}
