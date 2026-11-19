import type { ReactNode } from 'react';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';

export type EmptyStateSize = 'sm' | 'md';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** Decorative icon, for example from lucide-react. */
  icon?: IconComponent;
  /** The main way forward, usually a primary Button. */
  primaryAction?: ReactNode;
  /** An alternative, usually a secondary Button or a link. */
  secondaryAction?: ReactNode;
  /** Use 1 when the empty state is the whole page, such as a 404. */
  headingLevel?: 1 | 2 | 3 | 4;
  size?: EmptyStateSize;
  className?: string;
}

const headings = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' } as const;

const sizes: Record<EmptyStateSize, { root: string; icon: string; title: string }> = {
  sm: { root: 'gap-2 py-6', icon: 'size-10 [&>svg]:size-5', title: 'text-md' },
  md: { root: 'gap-3 py-12', icon: 'size-12 [&>svg]:size-6', title: 'text-lg' },
};

const iconFrame =
  'flex items-center justify-center rounded-xl border border-subtle bg-primary text-fg-secondary shadow-xs';

/** What to show when a list, search or view has nothing in it yet, and what to do next. */
export function EmptyState({
  title,
  description,
  icon: Icon,
  primaryAction,
  secondaryAction,
  headingLevel = 2,
  size = 'md',
  className,
}: EmptyStateProps) {
  const Heading = headings[headingLevel];
  return (
    <div
      className={cx(
        'mx-auto flex max-w-md flex-col items-center px-4 text-center',
        sizes[size].root,
        className,
      )}
    >
      {Icon && (
        <div className={cx(iconFrame, sizes[size].icon)}>
          <Icon aria-hidden='true' />
        </div>
      )}
      <Heading className={cx('font-display font-semibold text-primary', sizes[size].title)}>
        {title}
      </Heading>
      {description && <p className='text-sm text-tertiary'>{description}</p>}
      {(primaryAction ?? secondaryAction) && (
        <div className='mt-2 flex flex-wrap items-center justify-center gap-3'>
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
}
