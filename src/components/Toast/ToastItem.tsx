import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import type { ToastRecord, ToastVariant } from './Toast';

const variantStyles: Record<ToastVariant, { icon: IconComponent; className: string }> = {
  info: { icon: Info, className: 'text-fg-brand' },
  success: { icon: CircleCheck, className: 'text-fg-success' },
  warning: { icon: TriangleAlert, className: 'text-fg-warning' },
  error: { icon: CircleAlert, className: 'text-fg-error' },
};

/** One toast. ToastProvider loads this module when the first toast is added. */
export function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastRecord;
  onDismiss: (id: string) => void;
}) {
  const [paused, setPaused] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const remaining = useRef(toast.duration);
  const startedAt = useRef(0);

  useEffect(() => {
    if (paused || remaining.current === null) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      if (remaining.current !== null) {
        remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
      }
    };
  }, [paused, onDismiss, toast.id]);

  // Runs before the element leaves the DOM, while focus can still be seen inside it.
  useLayoutEffect(() => {
    const item = itemRef.current;
    return () => {
      const target = returnFocusTo.current;
      if (item?.contains(document.activeElement) && target?.isConnected) target.focus();
    };
  }, []);

  const { icon: Icon, className } = variantStyles[toast.variant];

  function handlePause() {
    setPaused(true);
  }

  function handleResume() {
    setPaused(false);
  }

  function handleFocus(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      returnFocusTo.current =
        event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
    }
    setPaused(true);
  }

  function handleBlur(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === 'Escape') onDismiss(toast.id);
  }

  function handleAction() {
    toast.action?.onPress();
    onDismiss(toast.id);
  }

  function handleClose() {
    onDismiss(toast.id);
  }

  return (
    // Escape on a focused toast closes it, as on other transient surfaces; the toast is not a control.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      ref={itemRef}
      data-variant={toast.variant}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="pointer-events-auto flex w-full animate-toast-in items-start gap-3 rounded-lg border border-subtle bg-elevated p-4 shadow-lg motion-reduce:animate-none"
    >
      <Icon aria-hidden="true" className={cx('mt-0.5 size-5 shrink-0', className)} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-primary">{toast.title}</p>
        {toast.description && <p className="text-sm text-tertiary">{toast.description}</p>}
        {toast.action && (
          <div className="mt-1">
            <Button variant="secondary" size="sm" onPress={handleAction}>
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>
      <IconButton
        icon={X}
        aria-label="Dismiss notification"
        variant="tertiary"
        size="sm"
        className="-mt-1 -mr-1"
        onPress={handleClose}
      />
    </li>
  );
}
