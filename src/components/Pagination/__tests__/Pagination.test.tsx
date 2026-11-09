import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { getPageRange, Pagination } from '../Pagination';

describe('getPageRange', () => {
  it.each([
    { page: 1, total: 5, siblings: 1, expected: [1, 2, 3, 4, 5] },
    { page: 1, total: 7, siblings: 1, expected: [1, 2, 3, 4, 5, 6, 7] },
    { page: 1, total: 20, siblings: 1, expected: [1, 2, 3, 4, 5, 'ellipsis', 20] },
    { page: 4, total: 20, siblings: 1, expected: [1, 2, 3, 4, 5, 'ellipsis', 20] },
    { page: 10, total: 20, siblings: 1, expected: [1, 'ellipsis', 9, 10, 11, 'ellipsis', 20] },
    { page: 20, total: 20, siblings: 1, expected: [1, 'ellipsis', 16, 17, 18, 19, 20] },
    {
      page: 10,
      total: 20,
      siblings: 2,
      expected: [1, 'ellipsis', 8, 9, 10, 11, 12, 'ellipsis', 20],
    },
    { page: 99, total: 20, siblings: 1, expected: [1, 'ellipsis', 16, 17, 18, 19, 20] },
    { page: 1, total: 0, siblings: 1, expected: [] },
  ])('page $page of $total with $siblings siblings', ({ page, total, siblings, expected }) => {
    expect(getPageRange(page, total, siblings)).toEqual(expected);
  });
});

describe('Pagination', () => {
  it('moves to the next page from the keyboard', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalPages={10} defaultPage={3} onPageChange={onPageChange} />);
    screen.getByRole('button', { name: 'Next' }).focus();

    await user.keyboard('{Enter}');

    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
  });

  it('disables Previous on the first page', () => {
    render(<Pagination totalPages={10} page={1} />);

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('renders page links when getPageHref is set', () => {
    render(<Pagination totalPages={10} page={2} getPageHref={(page) => `?page=${page}`} />);

    expect(screen.getByRole('link', { name: 'Page 3' })).toHaveAttribute('href', '?page=3');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <Pagination totalPages={20} defaultPage={10} />);
  });
});
