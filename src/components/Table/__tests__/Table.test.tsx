import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { Selection, SortDescriptor } from 'react-aria-components';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../Table';

interface Issue {
  id: string;
  title: string;
  points: number;
}

const issues: Issue[] = [
  { id: 'a', title: 'Theme variants', points: 5 },
  { id: 'b', title: 'Command palette', points: 8 },
  { id: 'c', title: 'Breadcrumbs', points: 2 },
];

function compareIssues(column: keyof Issue, left: Issue, right: Issue) {
  return String(left[column]).localeCompare(String(right[column]), undefined, { numeric: true });
}

function IssueTable({
  rows = issues,
  selectionMode = 'none',
}: {
  rows?: Issue[];
  selectionMode?: 'none' | 'single' | 'multiple';
}) {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'title', direction: 'ascending' });
  const [selected, setSelected] = useState<Selection>(new Set());
  const column = sort.column as keyof Issue;
  const sorted = [...rows].sort((left, right) =>
    sort.direction === 'ascending'
      ? compareIssues(column, left, right)
      : compareIssues(column, right, left),
  );

  return (
    <Table
      aria-label='Issues'
      sortDescriptor={sort}
      onSortChange={setSort}
      selectionMode={selectionMode}
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <TableHeader>
        <Column id='title' isRowHeader allowsSorting>
          Title
        </Column>
        <Column id='points' allowsSorting align='end'>
          Points
        </Column>
      </TableHeader>
      <TableBody items={sorted} emptyState='No issues match these filters.'>
        {(issue) => (
          <Row id={issue.id}>
            <Cell>{issue.title}</Cell>
            <Cell align='end'>{issue.points}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

function rowHeaders() {
  return screen.getAllByRole('rowheader').map((cell) => cell.textContent);
}

describe('Table', () => {
  it('reorders rows when a sortable column header is pressed', async () => {
    const user = userEvent.setup();
    render(<IssueTable />);

    await user.click(screen.getByRole('columnheader', { name: 'Points' }));

    expect(rowHeaders()).toEqual(['Breadcrumbs', 'Theme variants', 'Command palette']);
  });

  it('shows the empty state when there are no rows', () => {
    render(<IssueTable rows={[]} />);

    expect(screen.getByText('No issues match these filters.')).toBeInTheDocument();
  });

  it.each([
    { selectionMode: 'multiple' as const, header: 'Select All' },
    { selectionMode: 'single' as const, header: 'Selection' },
  ])('adds a named selection column in $selectionMode mode', ({ selectionMode, header }) => {
    render(<IssueTable selectionMode={selectionMode} />);

    const columns = screen.getAllByRole('columnheader');
    expect(columns[0]).toHaveAccessibleName(header);
  });

  it('selects a row with its checkbox', async () => {
    const user = userEvent.setup();
    render(<IssueTable selectionMode='multiple' />);
    const row = screen.getByRole('row', { name: /Command palette/ });

    await user.click(within(row).getByRole('checkbox'));

    expect(row).toHaveAttribute('aria-selected', 'true');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <IssueTable selectionMode='multiple' />);
  });

  it('adopts the server markup on hydration instead of recreating the header and body', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    container.innerHTML = renderToString(<IssueTable selectionMode='multiple' />);
    const header = container.querySelector('thead');
    const body = container.querySelector('tbody');

    await act(async () => {
      hydrateRoot(container, <IssueTable selectionMode='multiple' />);
    });

    expect(container.querySelector('thead')).toBe(header);
    expect(container.querySelector('tbody')).toBe(body);
    container.remove();
  });
});
