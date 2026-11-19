import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline, Stat } from './Stat';

const meta = {
  title: 'Components/Stat',
  component: Stat,
  args: { label: 'Deploys this week', value: '128' },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const TrendUp: Story = {
  args: { delta: { value: '12%', trend: 'up', label: 'vs last week' } },
};
export const TrendDown: Story = {
  args: { delta: { value: '8%', trend: 'down', label: 'vs last week' } },
};
export const FallIsGood: Story = {
  args: {
    label: 'Error rate',
    value: '0.4%',
    delta: { value: '0.1 pt', trend: 'down', isPositive: true, label: 'vs last week' },
  },
};
/** The compact size for a sticky summary bar. */
export const Small: Story = { args: { size: 'sm', detail: 'of 200 pull requests' } };
export const WithDetail: Story = { args: { detail: 'Across 12 services' } };
export const Neutral: Story = {
  args: { delta: { value: '0%', trend: 'neutral', label: 'vs last week' } },
};
export const WithSparkline: Story = {
  args: {
    isCard: true,
    delta: { value: '12%', trend: 'up', label: 'vs last week' },
    sparkline: <Sparkline values={[4, 6, 5, 8, 9, 7, 12]} aria-label='Deploys per day' />,
  },
};

export const Row: Story = {
  render: () => (
    <div className='grid gap-4 sm:grid-cols-3'>
      <Stat
        isCard
        label='Open issues'
        value='42'
        delta={{ value: '3', trend: 'down', isPositive: true, label: 'since Monday' }}
      />
      <Stat
        isCard
        label='Cycle time'
        value='2.4 d'
        delta={{ value: '0.3 d', trend: 'up', isPositive: false }}
        sparkline={<Sparkline values={[2, 2.1, 2.3, 2.2, 2.4]} />}
      />
      <Stat isCard label='Reviewers' value='5' delta={{ value: '0', trend: 'neutral' }} />
    </div>
  ),
};
