import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { LineChart, type LineChartProps } from '../LineChart';

const x = [Date.UTC(2026, 2, 1), Date.UTC(2026, 2, 2), Date.UTC(2026, 2, 3)].map(
  (time) => new Date(time),
);

const props: LineChartProps = {
  title: 'Eval results',
  x,
  xFormat: { timeZone: 'UTC', month: 'short', day: 'numeric' },
  series: [
    { id: 'passed', label: 'Passed', values: [12, 20, 31] },
    { id: 'failed', label: 'Failed', values: [3, null, 5] },
  ],
};

describe('LineChart', () => {
  it('moves through the points with the arrow keys and shows each one in the tooltip', async () => {
    const user = userEvent.setup();
    render(<LineChart {...props} />);

    await user.tab();

    const first = screen.getByRole('img', { name: 'Mar 1, 2026: Passed 12, Failed 3' });
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute('data-focus-visible', 'true');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Mar 1, 202612Passed3Failed');

    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('img', { name: 'Mar 2, 2026: Passed 20' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).not.toHaveTextContent('Failed');

    await user.keyboard('{End}');

    expect(screen.getByRole('img', { name: /Mar 3, 2026/ })).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('lets Escape close the tooltip first and reach a surrounding dialog second', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(
      <div role="presentation" onKeyDown={onKeyDown}>
        <LineChart {...props} />
      </div>,
    );

    await user.tab();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(onKeyDown).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');

    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it('says there is no data for a point where every series is empty', () => {
    render(
      <LineChart {...props} series={[{ id: 'passed', label: 'Passed', values: [null, 20, 31] }]} />,
    );

    expect(screen.getByRole('img', { name: 'Mar 1, 2026: No data' })).toBeInTheDocument();
  });

  it.each([
    { name: 'below zero', values: [-50, -30, -10], present: '0', absent: undefined },
    { name: 'all zero', values: [0, 0, 0], present: '1', absent: '-1' },
    { name: 'whole numbers', values: [0, 1, 1], present: '1', absent: '0.5' },
  ])('draws a sensible axis for data $name', ({ values, present, absent }) => {
    render(<LineChart {...props} series={[{ id: 'a', label: 'Errors', values }]} />);

    expect(screen.getAllByText(present).length).toBeGreaterThan(0);
    if (absent) expect(screen.queryByText(absent)).not.toBeInTheDocument();
  });

  it('keeps the whole plot to a single tab stop', async () => {
    const user = userEvent.setup();
    render(<LineChart {...props} />);

    await user.tab();
    await user.tab();

    expect(screen.getByRole('button', { name: 'Show table' })).toHaveFocus();
  });

  it('shows the tooltip while the pointer is over a point', async () => {
    const user = userEvent.setup();
    render(<LineChart {...props} />);

    await user.hover(screen.getByRole('img', { name: /Mar 3, 2026/ }));

    expect(screen.getByRole('tooltip')).toHaveTextContent('31');

    await user.unhover(screen.getByRole('img', { name: /Mar 3, 2026/ }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('offers the data as a table behind a toggle', async () => {
    const user = userEvent.setup();
    render(<LineChart {...props} />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show table' }));

    const table = screen.getByRole('table', { name: 'Eval results' });
    expect(screen.getByRole('button', { name: 'Hide table' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(table).toBeInTheDocument();
    expect(screen.getAllByRole('row').map((row) => row.textContent)).toEqual([
      'DatePassedFailed',
      'Mar 1, 2026123',
      'Mar 2, 202620',
      'Mar 3, 2026315',
    ]);

    await user.click(screen.getByRole('button', { name: 'Hide table' }));

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('formats numbers for the locale', async () => {
    const user = userEvent.setup();
    render(
      <LineChart
        {...props}
        locale="de-DE"
        series={[{ id: 'a', label: 'Cost', values: [1234.5, 2000, 3100] }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Show table' }));

    expect(screen.getByRole('cell', { name: '1.234,5' })).toBeInTheDocument();
  });

  it('describes the chart for assistive technology and shows a message when there is no data', () => {
    const { rerender } = render(<LineChart {...props} />);

    expect(screen.getByRole('figure', { name: 'Eval results' })).toHaveAccessibleDescription(
      /Line chart with 2 series and 3 points, from Mar 1, 2026 to Mar 3, 2026\. Passed: from 12 to 31/,
    );

    rerender(<LineChart {...props} x={[]} series={[]} />);

    expect(screen.getAllByText('No data to show.').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Show table' })).not.toBeInTheDocument();
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectNoA11yViolations(() => <LineChart {...props} />);
  });
});
