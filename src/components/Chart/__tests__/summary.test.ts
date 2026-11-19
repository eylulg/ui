import { describe, expect, it } from 'vitest';
import { describeAll, describeBars, describeSeries } from '../summary';

const format = (value: number) => String(value);
const places = ['Mon', 'Tue', 'Wed', 'Thu'];

describe('describeSeries', () => {
  it.each([
    {
      name: 'a rising series',
      values: [4, 9, 6, 12],
      text: 'Passed: from 4 to 12, lowest 4 at Mon, highest 12 at Thu.',
    },
    { name: 'a single value', values: [null, 7, null, null], text: 'Passed: 7 at Tue.' },
    { name: 'no values', values: [null, null], text: 'Passed: no values.' },
    { name: 'a flat series', values: [0, 0, 0], text: 'Passed: 0 throughout.' },
  ])('describes $name', ({ values, text }) => {
    expect(describeSeries({ id: 'p', label: 'Passed', values }, places, format)).toBe(text);
  });
});

describe('describeAll', () => {
  it('describes three series and counts the rest', () => {
    const series = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, label: id, values: [1, 2] }));

    const text = describeAll('Five lines.', series, places, format);

    expect(text).toContain('a: from 1 to 2');
    expect(text).toContain('c: from 1 to 2');
    expect(text).not.toContain('d: from');
    expect(text).toContain('2 more series are in the table.');
  });
});

describe('describeBars', () => {
  it('names the highest and lowest category of each series', () => {
    const text = describeBars(
      'Bars.',
      ['Chat', 'Search', 'Review'],
      [{ id: 'p', label: 'Passed', values: [30, 12, 4] }],
      format,
    );

    expect(text).toBe('Bars. Passed: highest Chat at 30, lowest Review at 4.');
  });

  it('says so when every category has the same value', () => {
    const text = describeBars(
      'Bars.',
      ['Chat', 'Search'],
      [{ id: 'e', label: 'Errors', values: [0, 0] }],
      format,
    );

    expect(text).toBe('Bars. Errors: 0 for every category.');
  });
});
