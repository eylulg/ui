import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Drawer, DrawerTrigger } from './Drawer';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    title: 'Issue details',
    description: 'Changes are saved as you type.',
    side: 'right',
    size: 'md',
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['left', 'right', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => (
    <DrawerTrigger>
      <Button>Open drawer</Button>
      <Drawer
        {...args}
        footer={({ close }) => (
          <>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button onPress={close}>Save</Button>
          </>
        )}
      >
        <div className="flex flex-col gap-4">
          <Input label="Title" defaultValue="Ship theme variants" />
          <Input label="Assignee" defaultValue="Eylül" />
        </div>
      </Drawer>
    </DrawerTrigger>
  ),
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {};
export const Left: Story = { args: { side: 'left', title: 'Navigation', size: 'sm' } };
export const Bottom: Story = { args: { side: 'bottom', title: 'Share' } };
export const Large: Story = { args: { size: 'lg' } };

export const KeyboardOpenAndClose: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await expect(await body.findByRole('dialog', { name: 'Issue details' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('button', { name: 'Open drawer' })).toHaveFocus();
  },
};
