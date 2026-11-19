import type { Meta, StoryObj } from '@storybook/react-vite';
import { days, manySeries, passRate, requests, VariantGrid } from '../../docs/chartStoryKit';
import { LineChart } from './LineChart';

const meta = {
  title: 'Components/Chart/LineChart',
  component: LineChart,
  args: { title: 'Requests per day', x: days, series: requests },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const InCard: Story = { args: { isCard: true } };
export const Percent: Story = {
  args: {
    title: 'Eval pass rate',
    series: passRate,
    valueFormat: { style: 'percent', maximumFractionDigits: 0 },
    yDomain: [0.5, 1],
    isCard: true,
  },
};
export const SingleSeries: Story = { args: { series: requests.slice(0, 1) } };
export const SinglePoint: Story = {
  args: {
    x: days.slice(0, 1),
    series: requests.map((s) => ({ ...s, values: s.values.slice(0, 1) })),
  },
};
export const Empty: Story = { args: { x: [], series: [] } };
export const GermanLocale: Story = { args: { locale: 'de-DE' } };
/** Six colours, then a muted overflow colour told apart by marker shape and dash. */
export const ManySeries: Story = { args: { series: manySeries, title: 'Requests by feature' } };
export const WithGaps: Story = {
  args: {
    series: requests
      .slice(0, 1)
      .map((s) => ({ ...s, values: s.values.map((v, i) => (i % 9 === 4 ? null : v)) })),
  },
};
export const NarrowPhone: Story = {
  render: (args) => (
    <div className="w-80">
      <LineChart {...args} />
    </div>
  ),
};
export const Variants: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <VariantGrid>
      <LineChart {...args} />
    </VariantGrid>
  ),
};
