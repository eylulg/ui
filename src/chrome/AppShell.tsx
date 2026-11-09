import type { ReactNode } from 'react';

export interface AppShellProps {
  /** Usually a TopNav. */
  header?: ReactNode;
  /** Optional app sidebar, usually a SidebarNav. Shown from the md breakpoint. */
  sidebar?: ReactNode;
  /** Usually a SiteFooter. */
  footer?: ReactNode;
  children: ReactNode;
  /** Text of the skip link, the first tab stop on the page. */
  skipLinkLabel?: string;
  /** id of the main landmark, the skip link's target. */
  mainId?: string;
}

const root = 'flex min-h-dvh flex-col bg-primary font-sans text-primary';
const skipLink =
  'sr-only rounded-md bg-elevated px-4 py-2 text-sm font-semibold text-brand shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:outline-2 focus:outline-offset-2 focus:outline-focus';
const body = 'flex min-h-0 w-full flex-1';
const sidebarColumn = 'hidden w-64 shrink-0 border-r border-subtle md:block';
const main = 'min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8';

/**
 * Page frame shared by every project: a skip link, the header, an optional
 * sidebar, the main landmark and the footer. It has no hooks, so it renders
 * on the server. The 16px gutter keeps 375px screens free of sideways scroll.
 */
export function AppShell({
  header,
  sidebar,
  footer,
  children,
  skipLinkLabel = 'Skip to content',
  mainId = 'main',
}: AppShellProps) {
  return (
    <div className={root}>
      <a href={`#${mainId}`} className={skipLink}>
        {skipLinkLabel}
      </a>
      {header}
      <div className={body}>
        {sidebar && <div className={sidebarColumn}>{sidebar}</div>}
        <main id={mainId} tabIndex={-1} className={main}>
          {children}
        </main>
      </div>
      {footer}
    </div>
  );
}
