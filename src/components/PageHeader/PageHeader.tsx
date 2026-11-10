import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Page level actions, such as a primary Button. Wrap below the title on small screens. */
  actions?: ReactNode;
  /** Usually a Breadcrumbs element, rendered above the title. */
  breadcrumbs?: ReactNode;
  /** Short label above the title, such as a section or an item type. Text, not a heading. */
  eyebrow?: ReactNode;
  /** Extra context under the description, such as badges or an updated time. */
  meta?: ReactNode;
  /** Use 2 when the page already has an h1, for example inside a tab. */
  headingLevel?: 1 | 2;
  className?: string;
}

const headings = { 1: 'h1', 2: 'h2' } as const;

/** The top of a page: where you are, what it is, and the main actions. */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  eyebrow,
  meta,
  headingLevel = 1,
  className,
}: PageHeaderProps) {
  const Heading = headings[headingLevel];
  return (
    <header className={cx('flex flex-col gap-stack', className)}>
      {breadcrumbs}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow && <p className="text-sm font-semibold text-brand">{eyebrow}</p>}
          <Heading className="font-display text-2xl font-semibold break-words text-primary sm:text-3xl">
            {title}
          </Heading>
          {description && <p className="text-md text-tertiary">{description}</p>}
          {meta && (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-tertiary">
              {meta}
            </div>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
