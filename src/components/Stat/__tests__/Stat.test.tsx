import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Sparkline, sparklinePoints, Stat } from '../Stat';

describe('sparklinePoints', () => {
  it.each([
    { values: [], expected: '' },
    { values: [5], expected: '1,10' },
    { values: [3, 3], expected: '1,10 99,10' },
    { values: [0, 10], expected: '1,19 99,1' },
    { values: [0, 10, 5], expected: '1,19 50,1 99,10' },
  ])('maps $values into a 100 by 20 box', ({ values, expected }) => {
    expect(sparklinePoints(values, 100, 20)).toBe(expected);
  });
});

describe('Stat', () => {
  it.each([
    { trend: 'up' as const, words: 'Up' },
    { trend: 'down' as const, words: 'Down' },
    { trend: 'neutral' as const, words: 'No change' },
  ])('states the $trend trend in words', ({ trend, words }) => {
    render(<Stat label="Open issues" value="42" delta={{ value: '12%', trend }} />);

    expect(screen.getByText(words)).toBeInTheDocument();
  });

  it('pairs the label with its value and detail as a term and its descriptions', () => {
    render(<Stat label="Reviewed" value="128" detail="of 200 pull requests" size="sm" />);

    expect(screen.getByRole('term')).toHaveTextContent('Reviewed');
    expect(screen.getAllByRole('definition').map((item) => item.textContent)).toEqual([
      '128',
      'of 200 pull requests',
    ]);
  });

  it.each([
    { label: 'Weekly deploys', role: true },
    { label: undefined, role: false },
  ])('exposes the sparkline as an image only when named ($label)', ({ label, role }) => {
    render(<Sparkline values={[1, 3, 2]} aria-label={label} />);

    expect(Boolean(screen.queryByRole('img'))).toBe(role);
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Stat
          isCard
          label="Deploys"
          value="128"
          delta={{ value: '12%', trend: 'up', label: 'vs last week' }}
          sparkline={<Sparkline values={[4, 6, 5, 8, 9, 12]} aria-label="Deploys per day" />}
        />
        <Stat
          label="Error rate"
          value="0.4%"
          delta={{ value: '0.1 pt', trend: 'down', isPositive: true }}
        />
        <Stat label="Latency" value="42 ms" delta={{ value: '0 ms', trend: 'neutral' }} />
      </div>
    ));
  });
});
