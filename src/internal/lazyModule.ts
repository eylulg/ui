import { useEffect, useSyncExternalStore } from 'react';

export interface LazyModule<M> {
  /** Starts loading the module. Safe to call again, and after a failure it retries. */
  preload: () => void;
  /** The loaded module, or undefined until it has loaded. Starts loading once `isWanted` is true. */
  useModule: (isWanted: boolean) => M | undefined;
  /** The module if it has loaded already. For parts that only render inside the loaded overlay. */
  get: () => M | undefined;
}

function ignoreFailure() {
  // A failed preload is retried the next time the overlay is wanted.
}

/**
 * Loads the code behind an overlay once and shares it between every instance
 * on the page. `useModule` reads the shared result without Suspense, so the
 * trigger never flashes a fallback and a failed download leaves the page as it
 * was instead of reaching an error boundary.
 */
export function createLazyModule<M>(importer: () => Promise<M>): LazyModule<M> {
  const listeners = new Set<() => void>();
  let loaded: M | undefined;
  let pending: Promise<M> | undefined;

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function get() {
    return loaded;
  }

  function getServerSnapshot() {
    return undefined;
  }

  function load(): Promise<M> {
    pending ??= importer().then(
      (module) => {
        loaded = module;
        for (const listener of listeners) listener();
        return module;
      },
      (error: unknown) => {
        pending = undefined;
        throw error;
      },
    );
    return pending;
  }

  function preload() {
    load().catch(ignoreFailure);
  }

  function useModule(isWanted: boolean) {
    const module = useSyncExternalStore(subscribe, get, getServerSnapshot);

    useEffect(() => {
      if (isWanted && !module) preload();
    }, [isWanted, module]);

    return module;
  }

  return { preload, useModule, get };
}
