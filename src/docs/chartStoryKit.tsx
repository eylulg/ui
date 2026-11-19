import type { ReactNode } from 'react';
import type { ChartSeries } from '../components/Chart/types';
import { cx } from '../utils/cxLite';

const shown = ['portfolio', 'workspace', 'control-room', 'assistant'] as const;

/** Renders the same chart under four theme variants, each in light and dark mode. */
export function VariantGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {shown.flatMap((variant) =>
        (['light', 'dark'] as const).map((mode) => (
          <div key={`${variant}-${mode}`} className={cx(mode === 'dark' && 'dark-mode')}>
            <div
              data-ui-variant={variant}
              className="rounded-xl border border-subtle bg-primary p-4 text-primary"
            >
              <p className="mb-2 font-mono text-xs text-tertiary">
                {variant}, {mode}
              </p>
              {children}
            </div>
          </div>
        )),
      )}
    </div>
  );
}

export const days = Array.from(
  { length: 30 },
  (_, index) => new Date(Date.UTC(2026, 2, 1 + index)),
);

function wave(base: number, amplitude: number, phase: number, step = 0): number[] {
  return days.map((_, index) =>
    Math.round(base + amplitude * Math.sin(index / 3 + phase) + step * index),
  );
}

export const requests: ChartSeries[] = [
  { id: 'chat', label: 'Chat', values: wave(840, 120, 0, 6) },
  { id: 'search', label: 'Search', values: wave(520, 90, 1.5, 3) },
  { id: 'summaries', label: 'Summaries', values: wave(310, 60, 3, -2) },
];

const names = [
  'Chat',
  'Search',
  'Summaries',
  'Drafting',
  'Review',
  'Extraction',
  'Routing',
  'Tagging',
  'Export',
];

export const manySeries: ChartSeries[] = names.map((label, index) => ({
  id: label.toLowerCase(),
  label,
  values: wave(300 + index * 70, 50, index, index),
}));

export const passRate: ChartSeries[] = [
  {
    id: 'a',
    label: 'Model A',
    values: days.map((_, i) => 0.78 + 0.1 * Math.sin(i / 5) + i * 0.002),
  },
  {
    id: 'b',
    label: 'Model B',
    values: days.map((_, i) => 0.7 + 0.08 * Math.cos(i / 4) + i * 0.003),
  },
];

export const features = ['Chat', 'Search', 'Summaries', 'Drafting', 'Review'];

export const outcomes: ChartSeries[] = [
  { id: 'passed', label: 'Passed', values: [212, 184, 96, 140, 88] },
  { id: 'flagged', label: 'Flagged', values: [31, 22, 18, 40, 9] },
  { id: 'failed', label: 'Failed', values: [12, 19, 4, 27, 3] },
];

export const checkRows = [
  'Refund request',
  'Data transfer clause',
  'Termination notice',
  'Late payment fee',
  'Governing law',
  'Confidentiality term',
].map((label) => ({ id: label.toLowerCase().replaceAll(' ', '-'), label }));

export const checkColumns = [
  'Cites source',
  'Right clause',
  'No invented terms',
  'Plain language',
  'Format',
].map((label) => ({ id: label.toLowerCase().replaceAll(' ', '-'), label }));

export const checkStates = {
  pass: { label: 'Pass', tone: 'success' },
  fail: { label: 'Fail', tone: 'error' },
  skipped: { label: 'Skipped', tone: 'neutral' },
} as const;

export const checkCells = checkRows.flatMap((row, r) =>
  checkColumns.map((column, c) => {
    const roll = (r * 7 + c * 3 + r * c) % 11;
    const state = roll === 0 || roll === 7 ? 'fail' : roll === 4 ? 'skipped' : 'pass';
    return {
      row: row.id,
      column: column.id,
      state,
      detail: state === 'fail' ? 'Output differs from the reference answer.' : undefined,
      value: ((r + 1) * (c + 2) * 7) % 100,
    };
  }),
);
