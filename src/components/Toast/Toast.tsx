import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createLazyModule } from '../../internal/lazyModule';
import { cx } from '../../utils/cx';

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

const items = /*#__PURE__*/ createLazyModule(() => import('./ToastItem'));

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
  const loaded = items.useModule(toasts.length > 0);

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

  // The code for a toast downloads once the page is idle, so a toast about a lost connection can still show.
  useEffect(() => {
    const handle = window.setTimeout(items.preload, 2000);
    return () => window.clearTimeout(handle);
  }, []);

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
          {loaded &&
            toasts.map((item) => (
              <loaded.ToastItem key={item.id} toast={item} onDismiss={dismiss} />
            ))}
        </ol>
      </section>
    </ToastContext.Provider>
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
