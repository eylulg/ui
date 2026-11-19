import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  checkCells,
  checkColumns,
  checkRows,
  checkStates,
  VariantGrid,
} from '../../docs/chartStoryKit';
import { HeatGrid } from './HeatGrid';

const meta = {
  title: 'Components/Chart/HeatGrid',
  component: HeatGrid,
  args: {
    title: 'Checks by case',
    rowLabel: 'Case',
    rows: checkRows,
    columns: checkColumns,
    cells: checkCells,
    states: checkStates,
  },
} satisfies Meta<typeof HeatGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** State mode: each cell is a state, drawn with a fill and its own icon. */
export const PassFail: Story = {};
export const InCard: Story = { args: { isCard: true } };
/** Value mode: five shades of one hue, with the number in each cell. */
const scores = checkCells.map(({ row, column, value }) => ({ row, column, value }));
export const Values: Story = { args: { title: 'Score by case', states: undefined, cells: scores } };
export const ValuesWithoutLabels: Story = {
  args: { title: 'Score by case', states: undefined, cells: scores, hasValueLabels: false },
};
export const Empty: Story = { args: { rows: [], columns: [], cells: [] } };
export const SingleCell: Story = {
  args: {
    rows: checkRows.slice(0, 1),
    columns: checkColumns.slice(0, 1),
    cells: checkCells.slice(0, 1),
  },
};
export const ManyColumns: Story = {
  args: {
    columns: Array.from({ length: 24 }, (_, i) => ({ id: `run-${i}`, label: `Run ${i + 1}` })),
    cells: checkRows.flatMap((row, r) =>
      Array.from({ length: 24 }, (_, c) => ({
        row: row.id,
        column: `run-${c}`,
        state: (r * 5 + c * 3) % 7 === 0 ? 'fail' : 'pass',
      })),
    ),
  },
};
export const MissingCells: Story = { args: { cells: checkCells.filter((_, i) => i % 4 !== 1) } };
export const NarrowPhone: Story = {
  render: (args) => (
    <div className="w-80">
      <HeatGrid {...args} />
    </div>
  ),
};
export const Variants: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <VariantGrid>
      <HeatGrid {...args} />
    </VariantGrid>
  ),
};
