import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Link,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  type LinkProps,
} from 'react-aria-components';
import { focusRing } from '../../internal/focusRing';

export interface BreadcrumbsProps<T extends object> extends Omit<
  AriaBreadcrumbsProps<T>,
  'className'
> {
  /** Accessible name of the navigation landmark. */
  'aria-label'?: string;
  className?: string;
}

const list = 'flex flex-wrap items-center gap-1 text-sm';

const link = [
  'rounded-xs font-medium text-tertiary data-hovered:text-secondary data-hovered:underline data-current:font-semibold data-current:text-primary data-current:no-underline',
  focusRing,
].join(' ');

/**
 * The trail of pages above the current one, in a navigation landmark. The
 * last item is the current page and is marked with aria-current.
 */
export function Breadcrumbs<T extends object>({
  'aria-label': ariaLabel = 'Breadcrumbs',
  className,
  ...props
}: BreadcrumbsProps<T>) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <AriaBreadcrumbs {...props} className={list} />
    </nav>
  );
}

export interface BreadcrumbItemProps extends Pick<
  LinkProps,
  'href' | 'target' | 'rel' | 'routerOptions'
> {
  id?: string;
  children: ReactNode;
}

/** One level of the trail. Pass `href` for every item except the current page. */
export function BreadcrumbItem({ id, children, ...linkProps }: BreadcrumbItemProps) {
  return (
    <AriaBreadcrumb id={id} className='flex items-center gap-1'>
      {({ isCurrent }) => (
        <>
          <Link {...linkProps} className={link}>
            {children}
          </Link>
          {!isCurrent && (
            <ChevronRight aria-hidden='true' className='size-4 shrink-0 text-fg-tertiary' />
          )}
        </>
      )}
    </AriaBreadcrumb>
  );
}
