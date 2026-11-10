import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Keys of a combination, such as ['⌘', 'K']. Each renders as its own key. */
  keys?: string[];
  /**
   * Draw the keys as generated content instead of text and hide them from
   * assistive technology. Use it for a shortcut hint inside a control, so the
   * hint is not counted as the control's visible label (WCAG 2.5.3).
   */
  decorative?: boolean;
}

const key =
  'inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-default bg-secondary px-1 font-mono text-xs font-medium text-secondary';

const group = 'inline-flex items-center gap-1 font-mono text-xs';
const generated = 'after:content-[attr(data-key)]';

/**
 * A keyboard key or combination. Pass `keys` for a combination: the keys are
 * nested in an outer kbd, as the HTML spec describes for key sequences.
 */
export function Kbd({ keys, decorative = false, children, className, ...props }: KbdProps) {
  const hidden = decorative ? ({ 'aria-hidden': true } as const) : undefined;
  if (keys) {
    return (
      <kbd {...hidden} {...props} className={cx(group, className)}>
        {keys.map((item) =>
          decorative ? (
            <kbd key={item} data-key={item} className={cx(key, generated)} />
          ) : (
            <kbd key={item} className={key}>
              {item}
            </kbd>
          ),
        )}
      </kbd>
    );
  }
  return (
    <kbd {...hidden} {...props} className={cx(key, className)}>
      {children}
    </kbd>
  );
}
