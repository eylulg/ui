import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { HeatGrid, type HeatGridProps } from '../HeatGrid';

const props: HeatGridProps = {
  title: 'Checks by case',
  rowLabel: 'Case',
  rows: [
    { id: 'r1', label: 'Refund' },
    { id: 'r2', label: 'Transfer' },
  ],
  columns: [
    { id: 'c1', label: 'Cites source' },
    { id: 'c2', label: 'Right clause' },
  ],
  states: {
    pass: { label: 'Pass', tone: 'success' },
    fail: { label: 'Fail', tone: 'error' },
  },
  cells: [
    { row: 'r1', column: 'c1', state: 'pass' },
    { row: 'r1', column: 'c2', state: 'fail', detail: 'Clause not found.' },
    { row: 'r2', column: 'c1', state: 'pass' },
    { row: 'r2', column: 'c2', state: 'pass' },
  ],
};

describe('HeatGrid', () => {
  it('moves across rows and columns with the arrow keys and explains a failure in the tooltip', async () => {
    const user = userEvent.setup();
    render(<HeatGrid {...props} />);

    await user.tab();
    expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    expect(screen.getAllByRole('gridcell')[0]).toHaveAttribute('data-focus-visible', 'true');

    await user.keyboard('{ArrowRight}');

    const failed = screen.getByRole('gridcell', { name: 'Fail: Clause not found.' });
    expect(failed).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'Refund, Right clauseFailClause not found.',
    );

    await user.keyboard('{ArrowDown}');

    expect(screen.getAllByRole('gridcell')[3]).toHaveFocus();
  });

  it('names every cell by its state and detail, so pass and fail never rely on colour', async () => {
    const user = userEvent.setup();
    render(<HeatGrid {...props} />);

    expect(screen.getAllByRole('gridcell').map((cell) => cell.textContent)).toEqual([
      'Pass',
      'Fail: Clause not found.',
      'Pass',
      'Pass',
    ]);

    await user.click(screen.getByRole('button', { name: 'Show table' }));

    expect(screen.getAllByRole('row').map((row) => row.textContent)).toContain(
      'RefundPassFail: Clause not found.',
    );
  });

  it('keeps the full text of long headers for screen readers', () => {
    render(
      <HeatGrid
        {...props}
        rows={[{ id: 'r1', label: 'Confidentiality term for the whole agreement' }]}
        columns={[{ id: 'c1', label: 'Cites a source for every claim' }]}
        cells={[]}
      />,
    );

    expect(
      screen.getByRole('rowheader', { name: 'Confidentiality term for the whole agreement' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Cites a source for every claim' }),
    ).toBeInTheDocument();
  });

  it('shades cells by value and lists every value in the table', async () => {
    const user = userEvent.setup();
    render(
      <HeatGrid
        {...props}
        states={undefined}
        cells={[
          { row: 'r1', column: 'c1', value: 10 },
          { row: 'r1', column: 'c2', value: 90 },
          { row: 'r2', column: 'c1', value: 50 },
        ]}
      />,
    );

    expect(screen.getByRole('gridcell', { name: '90' })).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: 'No data' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show table' }));

    expect(screen.getAllByRole('row').map((row) => row.textContent)).toContain('Transfer50');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectNoA11yViolations(() => <HeatGrid {...props} />);
  });
});
