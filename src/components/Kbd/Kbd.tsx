import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Keys of a combination, such as ['⌘', 'K']. Each renders as its own key. */
  keys?: string[];
}

const key =
  'inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-default bg-secondary px-1 font-mono text-xs font-medium text-secondary';

const group = 'inline-flex items-center gap-1 font-mono text-xs';

/**
 * A keyboard key or combination. Pass `keys` for a combination: the keys are
 * nested in an outer kbd, as the HTML spec describes for key sequences.
 */
export function Kbd({ keys, children, className, ...props }: KbdProps) {
  if (keys) {
    return (
      <kbd {...props} className={cx(group, className)}>
        {keys.map((item) => (
          <kbd key={item} className={key}>
            {item}
          </kbd>
        ))}
      </kbd>
    );
  }
  return (
    <kbd {...props} className={cx(key, className)}>
      {children}
    </kbd>
  );
}
