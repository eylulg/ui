import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { focusRing } from '../../internal/focusRing';
import { cx } from '../../utils/cx';

export type PageRangeItem = number | 'ellipsis';

export interface PaginationProps {
  /** Total number of pages. */
  totalPages: number;
  /** Current page (1 based) when controlled. */
  page?: number;
  /** Initial page when uncontrolled. */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current page before an ellipsis. */
  siblingCount?: number;
  /** Renders links instead of buttons, for pagination through URLs. */
  getPageHref?: (page: number) => string;
  /** Accessible name of the navigation landmark. */
  'aria-label'?: string;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

const item = [
  'inline-flex h-control-sm min-w-control-sm cursor-pointer items-center justify-center gap-1 rounded-md px-2 text-sm font-medium text-secondary data-hovered:bg-hover data-hovered:text-primary data-pressed:bg-tertiary data-disabled:cursor-not-allowed data-disabled:text-disabled data-disabled:bg-transparent',
  focusRing,
].join(' ');
const current = 'bg-brand-subtle text-brand data-hovered:bg-brand-subtle data-hovered:text-brand';

/**
 * The pages to show for a pagination control: the first and last page, the
 * current page with `siblingCount` neighbours on each side, and an ellipsis
 * for each gap. A gap of a single page shows that page instead of an
 * ellipsis, so the number of slots stays constant while paging.
 */
export function getPageRange(page: number, totalPages: number, siblingCount = 1): PageRangeItem[] {
  const total = Math.max(0, Math.floor(totalPages));
  const slots = siblingCount * 2 + 5;
  if (total <= slots) return Array.from({ length: total }, (_, index) => index + 1);

  const currentPage = Math.min(Math.max(1, page), total);
  const left = Math.max(currentPage - siblingCount, 1);
  const right = Math.min(currentPage + siblingCount, total);
  const showLeftEllipsis = left > 3;
  const showRightEllipsis = right < total - 2;
  const edge = siblingCount * 2 + 3;

  if (!showLeftEllipsis) {
    return [...Array.from({ length: edge }, (_, index) => index + 1), 'ellipsis', total];
  }
  if (!showRightEllipsis) {
    return [1, 'ellipsis', ...Array.from({ length: edge }, (_, index) => total - edge + index + 1)];
  }
  const middle = Array.from({ length: right - left + 1 }, (_, index) => left + index);
  return [1, 'ellipsis', ...middle, 'ellipsis', total];
}

/**
 * Page navigation in a labelled nav landmark. The current page carries
 * aria-current="page". Pass `getPageHref` to render links for URL based
 * paging; otherwise pages are buttons that call `onPageChange`.
 */
export function Pagination({
  totalPages,
  page,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  getPageHref,
  'aria-label': ariaLabel = 'Pagination',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const currentPage = page ?? internalPage;
  const range = getPageRange(currentPage, totalPages, siblingCount);

  function goTo(target: number) {
    setInternalPage(target);
    onPageChange?.(target);
  }

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className='flex flex-wrap items-center gap-1'>
        <li>
          <PageControl
            target={currentPage - 1}
            isDisabled={currentPage <= 1}
            getPageHref={getPageHref}
            onSelect={goTo}
          >
            <ChevronLeft aria-hidden='true' className='size-4' />
            {previousLabel}
          </PageControl>
        </li>
        {range.map((entry, index) =>
          entry === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} aria-hidden='true' className='px-1 text-fg-tertiary'>
              <Ellipsis className='size-4' />
            </li>
          ) : (
            <li key={entry}>
              <PageControl
                target={entry}
                isCurrent={entry === currentPage}
                getPageHref={getPageHref}
                onSelect={goTo}
                aria-label={`Page ${entry}`}
              >
                {entry}
              </PageControl>
            </li>
          ),
        )}
        <li>
          <PageControl
            target={currentPage + 1}
            isDisabled={currentPage >= totalPages}
            getPageHref={getPageHref}
            onSelect={goTo}
          >
            {nextLabel}
            <ChevronRight aria-hidden='true' className='size-4' />
          </PageControl>
        </li>
      </ul>
    </nav>
  );
}

interface PageControlProps {
  target: number;
  isCurrent?: boolean;
  isDisabled?: boolean;
  getPageHref?: (page: number) => string;
  onSelect: (page: number) => void;
  'aria-label'?: string;
  children: ReactNode;
}

function PageControl({
  target,
  isCurrent = false,
  isDisabled = false,
  getPageHref,
  onSelect,
  'aria-label': ariaLabel,
  children,
}: PageControlProps) {
  const className = cx(item, isCurrent && current);

  function handlePress() {
    onSelect(target);
  }

  if (getPageHref) {
    return (
      <AriaLink
        href={isDisabled ? undefined : getPageHref(target)}
        isDisabled={isDisabled}
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={ariaLabel}
        onPress={handlePress}
        className={className}
      >
        {children}
      </AriaLink>
    );
  }

  return (
    <AriaButton
      isDisabled={isDisabled}
      aria-current={isCurrent ? 'page' : undefined}
      aria-label={ariaLabel}
      onPress={handlePress}
      className={className}
    >
      {children}
    </AriaButton>
  );
}
