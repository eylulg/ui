import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastAction {
  /** Verb first, such as "Undo" or "Open issue". */
  label: string;
  /** Runs on press; the toast closes afterwards. */
  onPress: () => void;
}

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Milliseconds before the toast closes. Pass `null` to keep it until dismissed. */
  duration?: number | null;
  /** A button in the toast, such as Undo. Its label is its own accessible name. */
  action?: ToastAction;
}

export interface ToastRecord extends Required<Pick<ToastOptions, 'title' | 'variant'>> {
  id: string;
  description?: ReactNode;
  duration: number | null;
  action?: ToastAction;
}

export interface ToastApi {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  /** Closes one toast by id, or all of them when called without an id. */
  dismiss: (id?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export type ToastPlacement = 'top-right' | 'bottom-right' | 'bottom-center';

export interface ToastProviderProps {
  children: ReactNode;
  /** Default auto-close delay in milliseconds. */
  duration?: number;
  placement?: ToastPlacement;
  /** Accessible name for the notifications region. */
  label?: string;
  /** Upper bound on visible toasts; the oldest are dropped first. */
  maxVisible?: number;
}

const placements: Record<ToastPlacement, string> = {
  'top-right': 'top-4 right-4 items-end',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

let counter = 0;
const nextId = () => `ui-toast-${++counter}`;

/**
 * Hosts the notification region and exposes `useToast`. The region is a
 * polite live region that is always present in the DOM, so screen readers
 * announce each toast as it is added. Timers pause while a toast is hovered
 * or has focus, so nobody loses a message they are reading. A toast can carry
 * an action button, closes on Escape while it has focus, and when it closes
 * with focus inside, focus goes back to where it was before the user
 * entered the toast.
 */
export function ToastProvider({
  children,
  duration = 5000,
  placement = 'bottom-right',
  label = 'Notifications',
  maxVisible = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id?: string) => {
    setToasts((current) => (id ? current.filter((item) => item.id !== id) : []));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', duration: own, action }: ToastOptions) => {
      const id = nextId();
      const record: ToastRecord = {
        id,
        title,
        description,
        variant,
        duration: own === undefined ? duration : own,
        action,
      };
      setToasts((current) => [...current, record].slice(-maxVisible));
      return id;
    },
    [duration, maxVisible],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <section
        aria-label={label}
        className={cx('pointer-events-none fixed z-50', placements[placement])}
      >
        <ol
          aria-live="polite"
          aria-relevant="additions text"
          className="flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-2"
        >
          {toasts.map((item) => (
            <ToastItem key={item.id} toast={item} onDismiss={dismiss} />
          ))}
        </ol>
      </section>
    </ToastContext.Provider>
  );
}

const variantStyles: Record<ToastVariant, { icon: IconComponent; className: string }> = {
  info: { icon: Info, className: 'text-fg-brand' },
  success: { icon: CircleCheck, className: 'text-fg-success' },
  warning: { icon: TriangleAlert, className: 'text-fg-warning' },
  error: { icon: CircleAlert, className: 'text-fg-error' },
};

function ToastItem({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: string) => void }) {
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

/** Returns `{ toast, dismiss }`. Must be called inside a ToastProvider. */
export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a <ToastProvider>.');
  }
  return context;
}
