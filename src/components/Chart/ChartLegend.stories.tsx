import type { Meta, StoryObj } from '@storybook/react-vite';
import { VariantGrid } from '../../docs/chartStoryKit';
import { cx } from '../../utils/cxLite';
import { ChartLegend } from './ChartLegend';

const meta = {
  title: 'Components/Chart/ChartLegend',
  component: ChartLegend,
  args: {
    items: ['Chat', 'Search', 'Summaries', 'Drafting', 'Review', 'Extraction'].map((label) => ({
      id: label,
      label,
    })),
  },
} satisfies Meta<typeof ChartLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A stroke with the marker shape of the series, for line charts. */
export const Line: Story = {};
/** A square swatch, for bars and areas. */
export const Bar: Story = { args: { variant: 'bar' } };
/** Past six series the colour is muted and a dash and a shape tell the series apart. */
export const Overflow: Story = {
  args: {
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
  },
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
  parameters: { layout: 'padded', forceTheme: 'light' },
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
