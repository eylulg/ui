import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import {
  checkCells,
  checkColumns,
  checkRows,
  checkStates,
  days,
  features,
  manySeries,
  outcomes,
  passRate,
  requests,
  VariantGrid,
} from '../../docs/chartStoryKit';
import { cx } from '../../utils/cxLite';
import { BarChart } from './BarChart';
import { ChartLegend } from './ChartLegend';
import { HeatGrid } from './HeatGrid';
import { LineChart } from './LineChart';

/**
 * Four chart kinds share one look, one set of series colours and one keyboard and screen reader
 * model: `LineChart`, `BarChart`, `HeatGrid` and `ChartLegend`. The controls drive the line chart;
 * the other stories set their own props.
 */
const meta = {
  title: 'Components/Chart',
  component: LineChart,
  subcomponents: { BarChart, HeatGrid, ChartLegend },
  parameters: { layout: 'padded' },
  args: { title: 'Requests per day', x: days, series: requests },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

type BarProps = Partial<ComponentProps<typeof BarChart>>;
type HeatProps = Partial<ComponentProps<typeof HeatGrid>>;
type LegendProps = Partial<ComponentProps<typeof ChartLegend>>;

const barBase = { title: 'Eval outcomes by feature', categories: features, series: outcomes };
const heatBase = {
  title: 'Checks by case',
  rowLabel: 'Case',
  rows: checkRows,
  columns: checkColumns,
  cells: checkCells,
  states: checkStates,
};
const legendItems = ['Chat', 'Search', 'Summaries', 'Drafting', 'Review', 'Extraction'].map(
  (label) => ({ id: label, label }),
);

const bar = (props: BarProps = {}, extra: Partial<Story> = {}): Story => ({
  ...extra,
  render: () => <BarChart {...barBase} {...props} />,
});
const heat = (props: HeatProps = {}, extra: Partial<Story> = {}): Story => ({
  ...extra,
  render: () => <HeatGrid {...heatBase} {...props} />,
});
const legend = (props: LegendProps = {}): Story => ({
  render: () => <ChartLegend items={legendItems} {...props} />,
});

const variantsParameters = { layout: 'padded', forceTheme: 'light' } as const;

// Line chart

export const Line: Story = {};
export const LineInCard: Story = { name: 'Line in card', args: { isCard: true } };
export const LinePercent: Story = {
  name: 'Line percent',
  args: {
    title: 'Eval pass rate',
    series: passRate,
    valueFormat: { style: 'percent', maximumFractionDigits: 0 },
    yDomain: [0.5, 1],
    isCard: true,
  },
};
export const LineSingleSeries: Story = {
  name: 'Line single series',
  args: { series: requests.slice(0, 1) },
};
export const LineSinglePoint: Story = {
  name: 'Line single point',
  args: {
    x: days.slice(0, 1),
    series: requests.map((s) => ({ ...s, values: s.values.slice(0, 1) })),
  },
};
export const LineEmpty: Story = { name: 'Line empty', args: { x: [], series: [] } };
export const LineGermanLocale: Story = { name: 'Line German locale', args: { locale: 'de-DE' } };
/** Six colours, then a muted overflow colour told apart by marker shape and dash. */
export const LineManySeries: Story = {
  name: 'Line many series',
  args: { series: manySeries, title: 'Requests by feature' },
};
export const LineWithGaps: Story = {
  name: 'Line with gaps',
  args: {
    series: requests
      .slice(0, 1)
      .map((s) => ({ ...s, values: s.values.map((v, i) => (i % 9 === 4 ? null : v)) })),
  },
};
export const LineNarrowPhone: Story = {
  name: 'Line narrow phone',
  render: (args) => (
    <div className="w-80">
      <LineChart {...args} />
    </div>
  ),
};
export const LineVariants: Story = {
  name: 'Line variants',
  parameters: variantsParameters,
  render: (args) => (
    <VariantGrid>
      <LineChart {...args} />
    </VariantGrid>
  ),
};

// Bar chart

export const Bar: Story = bar();
export const BarStacked: Story = {
  name: 'Bar stacked',
  ...bar({ grouping: 'stacked', isCard: true }),
};
export const BarHorizontal: Story = {
  name: 'Bar horizontal',
  ...bar({ orientation: 'horizontal' }),
};
export const BarHorizontalStacked: Story = {
  name: 'Bar horizontal stacked',
  ...bar({ orientation: 'horizontal', grouping: 'stacked', isCard: true }),
};
export const BarSingleSeries: Story = {
  name: 'Bar single series',
  ...bar({ series: outcomes.slice(0, 1), hasValueLabels: true, title: 'Passed by feature' }),
};
export const BarSingleBar: Story = {
  name: 'Bar single bar',
  ...bar({
    categories: features.slice(0, 1),
    series: outcomes.map((s) => ({ ...s, values: s.values.slice(0, 1) })),
  }),
};
const profit = [
  { id: 'profit', label: 'Profit', values: [40, -25, 10, null, 18] },
  { id: 'refunds', label: 'Refunds', values: [-12, -8, 6, 14, -20] },
];
/** Bars grow down from the zero line, and a missing value leaves a gap with no mark. */
export const BarNegativeAndMissing: Story = {
  name: 'Bar negative and missing',
  ...bar({ title: 'Profit by feature', series: profit, hasValueLabels: true }),
};
export const BarNegativeHorizontalStacked: Story = {
  name: 'Bar negative horizontal stacked',
  ...bar({
    title: 'Profit by feature',
    series: profit,
    orientation: 'horizontal',
    grouping: 'stacked',
  }),
};
export const BarEmpty: Story = { name: 'Bar empty', ...bar({ categories: [], series: [] }) };
export const BarLongLabels: Story = {
  name: 'Bar long labels',
  ...bar({
    orientation: 'horizontal',
    categories: [
      'Contract clause extraction',
      'Citation accuracy against sources',
      'Summaries of long documents',
      'Redaction of personal data',
    ],
    series: outcomes.map((s) => ({ ...s, values: s.values.slice(0, 4) })),
  }),
};
export const BarManyCategories: Story = {
  name: 'Bar many categories',
  ...bar({
    categories: Array.from({ length: 24 }, (_, i) => `Week ${i + 1}`),
    series: outcomes.slice(0, 1).map((s) => ({
      ...s,
      values: Array.from({ length: 24 }, (_, i) => 40 + ((i * 37) % 60)),
    })),
  }),
};
/** Eight stacked series: six colours, then two in the muted colour. */
export const BarManySeries: Story = {
  name: 'Bar many series',
  ...bar({
    grouping: 'stacked',
    series: Array.from({ length: 8 }, (_, i) => ({
      id: `s${i}`,
      label: `Series ${i + 1}`,
      values: features.map((_, c) => 10 + ((i * 7 + c * 5) % 17)),
    })),
  }),
};
export const BarGermanLocale: Story = {
  name: 'Bar German locale',
  ...bar({
    locale: 'de-DE',
    series: outcomes.map((s) => ({ ...s, values: s.values.map((v) => (v ?? 0) * 120) })),
  }),
};
export const BarNarrowPhone: Story = {
  name: 'Bar narrow phone',
  render: () => (
    <div className="w-80">
      <BarChart {...barBase} />
    </div>
  ),
};
export const BarVariants: Story = {
  name: 'Bar variants',
  parameters: variantsParameters,
  render: () => (
    <VariantGrid>
      <BarChart {...barBase} grouping="stacked" />
    </VariantGrid>
  ),
};

// Heat grid

/** State mode: each cell is a state, drawn with a fill and its own icon. */
export const HeatGridStates: Story = { name: 'Heat grid', ...heat() };
export const HeatGridInCard: Story = { name: 'Heat grid in card', ...heat({ isCard: true }) };
/** Value mode: five shades of one hue, with the number in each cell. */
const scores = checkCells.map(({ row, column, value }) => ({ row, column, value }));
const scoreProps = { title: 'Score by case', states: undefined, cells: scores };
export const HeatGridValues: Story = { name: 'Heat grid values', ...heat(scoreProps) };
export const HeatGridValuesWithoutLabels: Story = {
  name: 'Heat grid values without labels',
  ...heat({ ...scoreProps, hasValueLabels: false }),
};
export const HeatGridEmpty: Story = {
  name: 'Heat grid empty',
  ...heat({ rows: [], columns: [], cells: [] }),
};
export const HeatGridSingleCell: Story = {
  name: 'Heat grid single cell',
  ...heat({
    rows: checkRows.slice(0, 1),
    columns: checkColumns.slice(0, 1),
    cells: checkCells.slice(0, 1),
  }),
};
export const HeatGridManyColumns: Story = {
  name: 'Heat grid many columns',
  ...heat({
    columns: Array.from({ length: 24 }, (_, i) => ({ id: `run-${i}`, label: `Run ${i + 1}` })),
    cells: checkRows.flatMap((row, r) =>
      Array.from({ length: 24 }, (_, c) => ({
        row: row.id,
        column: `run-${c}`,
        state: (r * 5 + c * 3) % 7 === 0 ? ('fail' as const) : ('pass' as const),
      })),
    ),
  }),
};
export const HeatGridMissingCells: Story = {
  name: 'Heat grid missing cells',
  ...heat({ cells: checkCells.filter((_, i) => i % 4 !== 1) }),
};
export const HeatGridNarrowPhone: Story = {
  name: 'Heat grid narrow phone',
  render: () => (
    <div className="w-80">
      <HeatGrid {...heatBase} />
    </div>
  ),
};
export const HeatGridVariants: Story = {
  name: 'Heat grid variants',
  parameters: variantsParameters,
  render: () => (
    <VariantGrid>
      <HeatGrid {...heatBase} />
    </VariantGrid>
  ),
};

// Legend

/** A stroke with the marker shape of the series, for line charts. */
export const Legend: Story = legend();
/** A square swatch, for bars and areas. */
export const LegendBar: Story = { name: 'Legend bar', ...legend({ variant: 'bar' }) };
/** Past six series the colour is muted and a dash and a shape tell the series apart. */
export const LegendOverflow: Story = {
  name: 'Legend overflow',
  ...legend({
    items: [
      'Chat',
      'Search',
      'Summaries',
      'Drafting',
      'Review',
      'Extraction',
      'Routing',
      'Tagging',
      'Export',
    ].map((label) => ({ id: label, label })),
  }),
};

const seriesSwatches = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
  'bg-chart-6',
];
const steps = [
  'bg-chart-seq-1',
  'bg-chart-seq-2',
  'bg-chart-seq-3',
  'bg-chart-seq-4',
  'bg-chart-seq-5',
];

/** The series colours and the sequential ramp in four variants, light and dark. */
export const Palette: Story = {
  parameters: variantsParameters,
  render: () => (
    <VariantGrid>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          {seriesSwatches.map((swatch) => (
            <span key={swatch} className={cx('size-10 rounded-md', swatch)} />
          ))}
        </div>
        <div className="flex gap-0.5">
          {steps.map((swatch) => (
            <span
              key={swatch}
              className={cx('h-6 w-12 first:rounded-l-md last:rounded-r-md', swatch)}
            />
          ))}
        </div>
      </div>
    </VariantGrid>
  ),
};
