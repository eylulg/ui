import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { SegmentedControl, SegmentedControlItem } from './SegmentedControl';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  args: { 'aria-label': 'View', defaultSelectedKey: 'list', children: null },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    children: { control: false },
  },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem id="list">List</SegmentedControlItem>
      <SegmentedControlItem id="board">Board</SegmentedControlItem>
      <SegmentedControlItem id="timeline">Timeline</SegmentedControlItem>
    </SegmentedControl>
  ),
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };

export const WithIcons: Story = {
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem id="list" icon={List}>
        List
      </SegmentedControlItem>
      <SegmentedControlItem id="board" icon={LayoutGrid}>
        Board
      </SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const IconsOnly: Story = {
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem id="list" icon={List} aria-label="List view" />
      <SegmentedControlItem id="board" icon={LayoutGrid} aria-label="Board view" />
    </SegmentedControl>
  ),
};

export const DisabledSegment: Story = {
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem id="list">List</SegmentedControlItem>
      <SegmentedControlItem id="board">Board</SegmentedControlItem>
      <SegmentedControlItem id="timeline" isDisabled>
        Timeline
      </SegmentedControlItem>
    </SegmentedControl>
  ),
};

function Controlled() {
  const [mode, setMode] = useState<string>('write');
  return (
    <div className="flex flex-col gap-3">
      <SegmentedControl
        aria-label="Editor mode"
        selectedKey={mode}
        onSelectionChange={(key) => setMode(String(key))}
      >
        <SegmentedControlItem id="write">Write</SegmentedControlItem>
        <SegmentedControlItem id="preview">Preview</SegmentedControlItem>
      </SegmentedControl>
      <p className="text-sm text-secondary">Showing the {mode} view.</p>
    </div>
  );
}

export const ControlledWithKeyboard: Story = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Write' }));
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(canvas.getByRole('radio', { name: 'Preview' })).toBeChecked();
    await expect(canvas.getByText('Showing the preview view.')).toBeInTheDocument();
  },
};
