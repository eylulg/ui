import type { ComponentProps, ReactNode } from 'react';
import { RouterProvider } from 'react-aria-components';

type RouterProviderProps = ComponentProps<typeof RouterProvider>;

/** True for hrefs with a scheme, such as https: or mailto:, and for protocol-relative ones. */
export const isAbsoluteHref = (href: string): boolean => /^([a-z][a-z\d+.-]*:|\/\/)/i.test(href);

export interface LinkRouterProps {
  /** The router's navigate function, for example React Router's `useNavigate()`. */
  navigate: RouterProviderProps['navigate'];
  /** The router's href hook, for example React Router's `useHref`. */
  useHref?: RouterProviderProps['useHref'];
  children: ReactNode;
}

/**
 * Connects React Aria links to the app's router. Absolute URLs always load as a
 * new page: the projects share one origin, so React Aria would otherwise hand a
 * link to another project to this app's router.
 */
export function LinkRouter({ navigate, useHref, children }: LinkRouterProps) {
  const routerUseHref = useHref;

  return (
    <RouterProvider
      navigate={(href, options) => {
        if (isAbsoluteHref(href)) window.location.assign(href);
        else navigate(href, options);
      }}
      useHref={
        routerUseHref &&
        ((href) => {
          const routed = routerUseHref(isAbsoluteHref(href) ? '/' : href);
          return isAbsoluteHref(href) ? href : routed;
        })
      }
    >
      {children}
    </RouterProvider>
  );
}
