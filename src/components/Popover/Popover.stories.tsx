import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Popover, PopoverTrigger } from './Popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  args: { title: 'Filters', children: null },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'start', 'end'] },
  },
  render: (args) => (
    <PopoverTrigger>
      <Button variant='secondary'>Filters</Button>
      <Popover {...args}>
        {({ close }) => (
          <div className='flex flex-col gap-3'>
            <Switch>Only open issues</Switch>
            <Switch>Assigned to me</Switch>
            <Button size='sm' onPress={close}>
              Apply
            </Button>
          </div>
        )}
      </Popover>
    </PopoverTrigger>
  ),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithArrow: Story = { args: { showArrow: true } };
export const Top: Story = { args: { placement: 'top', showArrow: true } };

export const KeyboardOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    // Focus returns after the exit animation, so wait for it.
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Filters' })).toHaveFocus());
  },
};
