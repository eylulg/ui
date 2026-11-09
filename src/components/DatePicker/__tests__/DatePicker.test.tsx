import { CalendarDate } from '@internationalized/date';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { DatePicker, DateRangePicker } from '../DatePicker';

const states = [
  {
    state: 'hint',
    props: { hint: 'Shown on the issue.' },
    description: 'Shown on the issue.',
    invalid: false,
  },
  {
    state: 'error',
    props: { hint: 'Shown on the issue.', errorMessage: 'Pick a date in the future.' },
    description: 'Pick a date in the future.',
    invalid: true,
  },
] as const;

describe('DatePicker', () => {
  it.each(states)('describes the field with its $state', ({ props, description, invalid }) => {
    render(<DatePicker label="Due date" {...props} />);

    const group = screen.getByRole('group', { name: 'Due date' });
    expect(group).toHaveAccessibleDescription(description);
    const [firstSegment] = screen.getAllByRole('spinbutton');
    expect(firstSegment?.getAttribute('aria-invalid') === 'true').toBe(invalid);
  });

  it('moves focus into the calendar on open and back to the button on Escape', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Due date" defaultValue={new CalendarDate(2026, 11, 9)} />);
    const button = screen.getByRole('button', { name: /open calendar/i });
    await user.click(button);
    const grid = await screen.findByRole('grid');
    await waitFor(() => expect(grid).toContainElement(document.activeElement as HTMLElement));

    await user.keyboard('{Escape}');

    await waitFor(() => expect(button).toHaveFocus());
  });

  it('marks a range picker invalid with its error message', () => {
    render(<DateRangePicker label="Sprint" errorMessage="End after the start." />);

    const group = screen.getByRole('group', { name: 'Sprint' });
    expect(group).toHaveAccessibleDescription('End after the start.');
  });

  it('has no axe violations in light and dark while open', async () => {
    await expectNoA11yViolations(
      () => (
        <div>
          <DatePicker
            label="Due date"
            hint="Shown on the issue."
            defaultValue={new CalendarDate(2026, 11, 9)}
          />
          <DateRangePicker label="Sprint" calendarLabel="Open sprint calendar" />
        </div>
      ),
      async () => {
        await userEvent.setup().click(screen.getByRole('button', { name: /open calendar/i }));
        await screen.findByRole('grid');
      },
    );
  });
});
