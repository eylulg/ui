import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker as AriaDatePicker,
  DateRangePicker as AriaDateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Popover,
  RangeCalendar,
  composeRenderProps,
  type DatePickerProps as AriaDatePickerProps,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateSegmentProps,
  type DateValue,
} from 'react-aria-components';
import { FieldErrorMessage, FieldHint, FieldLabel } from '../../internal/Field';
import { focusRing } from '../../internal/focusRing';
import { popoverSurface } from '../../internal/surfaces';
import { cx } from '../../utils/cx';

interface FieldProps {
  /** Visible label. If omitted, pass `aria-label`. */
  label?: ReactNode;
  /** Helper text below the field, linked with aria-describedby. */
  hint?: ReactNode;
  /** Error text. Setting it also marks the field invalid. */
  errorMessage?: string;
  /** Accessible name of the button that opens the calendar. */
  calendarLabel?: string;
}

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T>, FieldProps {}

export interface DateRangePickerProps<T extends DateValue>
  extends AriaDateRangePickerProps<T>, FieldProps {}

const field = 'group flex flex-col gap-1.5';
const control =
  'flex h-control-md w-full items-center gap-2 rounded-md border border-control bg-primary ps-3 pe-1 text-md text-primary shadow-xs transition-shadow data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:text-disabled data-focus-within:border-brand data-focus-within:ring-4 data-focus-within:ring-focus/25 group-data-invalid:border-error';
const input = 'flex min-w-0 items-center';
const segment =
  'rounded-xs px-0.5 tabular-nums caret-transparent outline-none data-placeholder:text-placeholder data-focused:bg-brand-solid data-focused:text-on-solid data-[type=literal]:px-0 data-[type=literal]:text-tertiary';
const calendarButton = [
  'ms-auto flex size-control-sm shrink-0 cursor-pointer items-center justify-center rounded-sm text-fg-tertiary data-hovered:bg-hover data-hovered:text-fg-secondary data-pressed:bg-tertiary',
  focusRing,
].join(' ');
const popover = [popoverSurface, 'p-3'].join(' ');
const calendarHeader = 'mb-2 flex items-center justify-between gap-2';
const navButton = [
  'flex size-control-sm cursor-pointer items-center justify-center rounded-sm text-fg-secondary data-hovered:bg-hover data-disabled:cursor-not-allowed data-disabled:text-fg-disabled',
  focusRing,
].join(' ');
const cell = [
  'flex size-9 cursor-pointer items-center justify-center rounded-sm text-sm text-primary data-hovered:bg-hover data-outside-month:hidden data-disabled:cursor-not-allowed data-disabled:text-disabled data-unavailable:text-disabled data-unavailable:line-through data-selected:bg-brand-solid data-selected:text-on-solid',
  focusRing,
].join(' ');
const rangeCell = [
  'flex size-9 cursor-pointer items-center justify-center text-sm text-primary data-hovered:bg-hover data-outside-month:hidden data-disabled:cursor-not-allowed data-disabled:text-disabled data-selected:bg-brand-subtle data-selected:text-brand data-selection-start:rounded-s-sm data-selection-start:bg-brand-solid data-selection-start:text-on-solid data-selection-end:rounded-e-sm data-selection-end:bg-brand-solid data-selection-end:text-on-solid',
  focusRing,
].join(' ');

function Segment(props: DateSegmentProps) {
  return <DateSegment {...props} className={segment} />;
}

function CalendarTrigger({ label }: { label: string }) {
  return (
    <AriaButton aria-label={label} className={calendarButton}>
      <CalendarDays aria-hidden='true' className='size-4' />
    </AriaButton>
  );
}

function CalendarHeader() {
  return (
    <header className={calendarHeader}>
      <AriaButton slot='previous' className={navButton}>
        <ChevronLeft aria-hidden='true' className='size-4' />
      </AriaButton>
      <Heading className='text-sm font-semibold text-primary' />
      <AriaButton slot='next' className={navButton}>
        <ChevronRight aria-hidden='true' className='size-4' />
      </AriaButton>
    </header>
  );
}

/**
 * A date field with typed segments and a calendar popover. Arrow keys change
 * a segment, typing fills it, and the calendar button opens a month grid where
 * arrow keys move between days and Enter picks one.
 */
export function DatePicker<T extends DateValue>({
  label,
  hint,
  errorMessage,
  calendarLabel = 'Open calendar',
  isInvalid,
  className,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker
      {...props}
      isInvalid={isInvalid ?? Boolean(errorMessage)}
      className={composeRenderProps(className, (consumer) => cx(field, consumer))}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Group className={control}>
        <DateInput className={input}>
          {(dateSegment) => <Segment segment={dateSegment} />}
        </DateInput>
        <CalendarTrigger label={calendarLabel} />
      </Group>
      {hint && !errorMessage && <FieldHint>{hint}</FieldHint>}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
      <Popover placement='bottom start' className={popover}>
        <Dialog className='outline-none'>
          <Calendar>
            <CalendarHeader />
            <CalendarGrid>{(date) => <CalendarCell date={date} className={cell} />}</CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}

/** Like DatePicker, with a start and an end date and a range calendar. */
export function DateRangePicker<T extends DateValue>({
  label,
  hint,
  errorMessage,
  calendarLabel = 'Open calendar',
  isInvalid,
  className,
  ...props
}: DateRangePickerProps<T>) {
  return (
    <AriaDateRangePicker
      {...props}
      isInvalid={isInvalid ?? Boolean(errorMessage)}
      className={composeRenderProps(className, (consumer) => cx(field, consumer))}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Group className={control}>
        <DateInput slot='start' className={input}>
          {(dateSegment) => <Segment segment={dateSegment} />}
        </DateInput>
        <span aria-hidden='true' className='text-tertiary'>
          to
        </span>
        <DateInput slot='end' className={input}>
          {(dateSegment) => <Segment segment={dateSegment} />}
        </DateInput>
        <CalendarTrigger label={calendarLabel} />
      </Group>
      {hint && !errorMessage && <FieldHint>{hint}</FieldHint>}
      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
      <Popover placement='bottom start' className={popover}>
        <Dialog className='outline-none'>
          <RangeCalendar>
            <CalendarHeader />
            <CalendarGrid>
              {(date) => <CalendarCell date={date} className={rangeCell} />}
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}
