import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { BarChart, type BarChartProps } from '../BarChart';

const props: BarChartProps = {
  title: 'Outcomes by feature',
  categories: ['Chat', 'Search'],
  series: [
    { id: 'passed', label: 'Passed', values: [30, 12] },
    { id: 'failed', label: 'Failed', values: [4, 9] },
  ],
};

describe('BarChart', () => {
  it('visits every bar in turn and shows its group in the tooltip', async () => {
    const user = userEvent.setup();
    render(<BarChart {...props} />);

    await user.tab();

    expect(screen.getByRole('img', { name: 'Chat, Passed: 30' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Chat30Passed4Failed');

    await user.keyboard('{ArrowRight}{ArrowRight}');

    expect(screen.getByRole('img', { name: 'Search, Passed: 12' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Search12Passed9Failed');
  });

  it('adds a total to the tooltip and the table of a stack', async () => {
    const user = userEvent.setup();
    render(<BarChart {...props} grouping='stacked' orientation='horizontal' />);

    await user.hover(screen.getByRole('img', { name: 'Search, Failed: 9' }));
    expect(screen.getByRole('tooltip')).toHaveTextContent('21Total');

    await user.click(screen.getByRole('button', { name: 'Show table' }));

    expect(screen.getAllByRole('row').map((row) => row.textContent)).toEqual([
      'CategoryPassedFailedTotal',
      'Chat30434',
      'Search12921',
    ]);
  });

  it.each([
    {
      name: 'a negative value',
      values: [40, -25, 10],
      mark: 'Search, Profit: -25',
      absent: undefined,
      row: 'Search-25',
    },
    {
      name: 'a missing value',
      values: [40, null, 10],
      mark: 'Chat, Profit: 40',
      absent: 'Search, Profit: 0',
      row: 'Search',
    },
  ])('never shows $name as another number', async ({ values, mark, absent, row }) => {
    const user = userEvent.setup();
    render(
      <BarChart
        title='Profit'
        categories={['Chat', 'Search', 'Review']}
        series={[{ id: 'profit', label: 'Profit', values }]}
      />,
    );

    expect(screen.getByRole('img', { name: mark })).toBeInTheDocument();
    if (absent) expect(screen.queryByRole('img', { name: absent })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show table' }));

    expect(screen.getAllByRole('row').map((r) => r.textContent)).toContain(row);
  });

  it('says No data in the tooltip for a series without a value', async () => {
    const user = userEvent.setup();
    render(
      <BarChart
        {...props}
        series={[
          { id: 'passed', label: 'Passed', values: [30, 12] },
          { id: 'failed', label: 'Failed', values: [null, 9] },
        ]}
      />,
    );

    await user.hover(screen.getByRole('img', { name: 'Chat, Passed: 30' }));

    expect(screen.getByRole('tooltip')).toHaveTextContent('No dataFailed');
  });

  it.each([
    { name: 'all zero', values: [0, 0], absent: '-1' },
    { name: 'whole numbers', values: [0, 1], absent: '0.5' },
  ])('draws no impossible tick for $name data', ({ values, absent }) => {
    render(
      <BarChart
        title='Errors'
        categories={['Chat', 'Search']}
        series={[{ id: 'e', label: 'Errors', values }]}
      />,
    );

    expect(screen.queryByText(absent)).not.toBeInTheDocument();
  });

  it('shows a message and no table when there are no bars', () => {
    render(<BarChart {...props} categories={[]} series={[]} />);

    expect(screen.getAllByText('No data to show.').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Show table' })).not.toBeInTheDocument();
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectNoA11yViolations(() => <BarChart {...props} grouping='stacked' />);
  });
});
