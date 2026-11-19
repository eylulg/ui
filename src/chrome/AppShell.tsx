import type { ReactNode } from 'react';

export type AppShellMaxWidth = 'none' | '4xl' | '5xl' | '6xl' | '7xl';

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
  /**
   * Widest the content gets, centred. `6xl` lines the content up with TopNav
   * and SiteFooter, which are 6xl wide. The default `none` fills the page.
   */
  maxWidth?: AppShellMaxWidth;
  /** Extra layout classes for the content wrapper inside main, such as `space-y-8`. They add to the default padding and do not replace it. */
  contentClassName?: string;
}

const root = 'flex min-h-dvh flex-col bg-secondary font-sans text-primary';
const skipLink =
  'sr-only rounded-md bg-elevated px-4 py-2 text-sm font-semibold text-brand shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:outline-2 focus:outline-offset-2 focus:outline-focus';
const body = 'flex min-h-0 w-full flex-1';
const sidebarColumn = 'hidden w-64 shrink-0 border-r border-subtle md:block';
const main = 'min-w-0 flex-1';
const content = 'mx-auto w-full px-4 py-6 sm:px-6 lg:px-8';
const widths: Record<AppShellMaxWidth, string | undefined> = {
  none: undefined,
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

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
  maxWidth = 'none',
  contentClassName,
}: AppShellProps) {
  const contentClasses = [content, widths[maxWidth], contentClassName].filter(Boolean).join(' ');
  return (
    <div className={root}>
      <a href={`#${mainId}`} className={skipLink}>
        {skipLinkLabel}
      </a>
      {header}
      <div className={body}>
        {sidebar && <div className={sidebarColumn}>{sidebar}</div>}
        <main id={mainId} tabIndex={-1} className={main}>
          <div className={contentClasses}>{children}</div>
        </main>
      </div>
      {footer}
    </div>
  );
}
