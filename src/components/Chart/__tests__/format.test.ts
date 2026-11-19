import { describe, expect, it } from 'vitest';
import { createXFormat, fitText } from '../format';

const day = (n: number) => new Date(Date.UTC(2026, 2, n));
const hour = (n: number) => new Date(Date.UTC(2026, 2, 1, n));

describe('createXFormat', () => {
  it.each([
    {
      name: 'two days',
      xs: [day(1), day(2)],
      options: { timeZone: 'UTC' },
      tick: 'Mar 1',
      full: 'Mar 1, 2026',
    },
    {
      name: 'a single day',
      xs: [day(1)],
      options: { timeZone: 'UTC' },
      tick: 'Mar 1',
      full: 'Mar 1, 2026',
    },
    {
      name: 'daily points read in another zone',
      xs: [day(1), day(2)],
      options: { timeZone: 'America/Los_Angeles' },
      tick: 'Feb 28',
      full: 'Feb 28, 2026',
    },
    {
      name: 'points an hour apart',
      xs: [hour(9), hour(10)],
      options: { timeZone: 'UTC' },
      tick: '9:00 AM',
      full: 'Mar 1, 2026, 9:00 AM',
    },
  ])('shows $name by their granularity', ({ xs, options, tick, full }) => {
    const format = createXFormat(xs, 'en-US', options);

    expect(format.tick(0)).toBe(tick);
    expect(format.full(0)).toBe(full);
  });

  it('keeps the automatic tick format when only the time zone is set', () => {
    const xs = [day(1), day(15), day(29)];

    expect(createXFormat(xs, 'en-US', { timeZone: 'UTC' }).tick(1)).toBe('Mar 15');
  });

  it('uses the tick format it is given when it names date parts', () => {
    const xs = [day(1), day(15)];

    expect(createXFormat(xs, 'en-US', { timeZone: 'UTC', month: 'long' }).tick(1)).toBe('March');
  });
});

describe('fitText', () => {
  it.each([
    { text: 'Review', width: 39.6, expected: 'Review' },
    { text: 'Extraction', width: 39.6, expected: 'Extra…' },
  ])('fits $text in $width pixels as $expected', ({ text, width, expected }) => {
    expect(fitText(text, width)).toBe(expected);
  });
});
