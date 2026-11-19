import type { Meta, StoryObj } from '@storybook/react-vite';
import { features, outcomes, VariantGrid } from '../../docs/chartStoryKit';
import { BarChart } from './BarChart';

const meta = {
  title: 'Components/Chart/BarChart',
  component: BarChart,
  args: { title: 'Eval outcomes by feature', categories: features, series: outcomes },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grouped: Story = {};
export const Stacked: Story = { args: { grouping: 'stacked', isCard: true } };
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
export const HorizontalStacked: Story = {
  args: { orientation: 'horizontal', grouping: 'stacked', isCard: true },
};
export const SingleSeries: Story = {
  args: { series: outcomes.slice(0, 1), hasValueLabels: true, title: 'Passed by feature' },
};
export const SingleBar: Story = {
  args: {
    categories: features.slice(0, 1),
    series: outcomes.map((s) => ({ ...s, values: s.values.slice(0, 1) })),
  },
};
const profit = [
  { id: 'profit', label: 'Profit', values: [40, -25, 10, null, 18] },
  { id: 'refunds', label: 'Refunds', values: [-12, -8, 6, 14, -20] },
];
/** Bars grow down from the zero line, and a missing value leaves a gap with no mark. */
export const NegativeAndMissing: Story = {
  args: { title: 'Profit by feature', series: profit, hasValueLabels: true },
};
export const NegativeHorizontalStacked: Story = {
  args: {
    title: 'Profit by feature',
    series: profit,
    orientation: 'horizontal',
    grouping: 'stacked',
  },
};
export const Empty: Story = { args: { categories: [], series: [] } };
export const LongLabels: Story = {
  args: {
    orientation: 'horizontal',
    categories: [
      'Contract clause extraction',
      'Citation accuracy against sources',
      'Summaries of long documents',
      'Redaction of personal data',
    ],
    series: outcomes.map((s) => ({ ...s, values: s.values.slice(0, 4) })),
  },
};
export const ManyCategories: Story = {
  args: {
    categories: Array.from({ length: 24 }, (_, i) => `Week ${i + 1}`),
    series: outcomes.slice(0, 1).map((s) => ({
      ...s,
      values: Array.from({ length: 24 }, (_, i) => 40 + ((i * 37) % 60)),
    })),
  },
};
/** Eight stacked series: six colours, then two in the muted colour. */
export const ManySeries: Story = {
  args: {
    grouping: 'stacked',
    series: Array.from({ length: 8 }, (_, i) => ({
      id: `s${i}`,
      label: `Series ${i + 1}`,
      values: features.map((_, c) => 10 + ((i * 7 + c * 5) % 17)),
    })),
  },
};
export const GermanLocale: Story = {
  args: {
    locale: 'de-DE',
    series: outcomes.map((s) => ({ ...s, values: s.values.map((v) => (v ?? 0) * 120) })),
  },
};
export const NarrowPhone: Story = {
  render: (args) => (
    <div className="w-80">
      <BarChart {...args} />
    </div>
  ),
};
export const Variants: Story = {
  parameters: { layout: 'padded', forceTheme: 'light' },
  args: { grouping: 'stacked' },
  render: (args) => (
    <VariantGrid>
      <BarChart {...args} />
    </VariantGrid>
  ),
};
