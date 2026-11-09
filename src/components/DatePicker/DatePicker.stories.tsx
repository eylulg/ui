import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DatePicker, DateRangePicker } from './DatePicker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  args: { label: 'Due date' },
  parameters: { docs: { story: { height: '420px' } } },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: new CalendarDate(2026, 11, 9) } };
export const WithHint: Story = { args: { hint: 'Shown on the issue card.' } };
export const WithError: Story = { args: { errorMessage: 'Pick a date in the future.' } };
export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: new CalendarDate(2026, 11, 9) },
};
export const MinimumToday: Story = {
  args: { minValue: today(getLocalTimeZone()), hint: 'Past dates are unavailable.' },
};

export const Range: Story = {
  render: () => (
    <DateRangePicker
      label="Sprint"
      hint="Two weeks is typical."
      defaultValue={{ start: new CalendarDate(2026, 11, 9), end: new CalendarDate(2026, 11, 20) }}
    />
  ),
};

export const RangeWithError: Story = {
  render: () => <DateRangePicker label="Sprint" errorMessage="End after the start." />,
};

export const KeyboardCalendar: Story = {
  args: { defaultValue: new CalendarDate(2026, 11, 9) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const button = canvas.getByRole('button', { name: /open calendar/i });
    await userEvent.click(button);
    await body.findByRole('grid');
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(button).toHaveFocus();
    await expect(canvas.getAllByRole('spinbutton')[1]).toHaveTextContent('10');
  },
};
