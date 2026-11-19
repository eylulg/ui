import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './Kbd';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  args: { children: 'Esc' },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleKey: Story = {};
export const Combination: Story = { args: { keys: ['⌘', 'K'], children: undefined } };
export const InText: Story = {
  render: () => (
    <p className='text-sm text-secondary'>
      Press <Kbd keys={['Ctrl', 'K']} /> to open the command palette.
    </p>
  ),
};
