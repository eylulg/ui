import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExternalLink } from 'lucide-react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Input } from '../Input/Input';
import { Dialog, DialogTrigger, type DialogProps } from './Dialog';

function Example({ triggerLabel, ...props }: DialogProps & { triggerLabel: string }) {
  return (
    <DialogTrigger>
      <Button variant={props.role === 'alertdialog' ? 'destructive' : 'primary'}>
        {triggerLabel}
      </Button>
      <Dialog {...props} />
    </DialogTrigger>
  );
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: { title: 'Edit profile', description: 'Changes are visible to your team.' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    role: { control: 'inline-radio', options: ['dialog', 'alertdialog'] },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithHeaderActions: Story = {
  render: (args) => (
    <Example
      {...args}
      triggerLabel='Open issue'
      title='Fix the sidebar focus order'
      description='WS-142'
      headerActions={
        <IconButton icon={ExternalLink} aria-label='Open as page' variant='tertiary' size='sm' />
      }
    >
      Arrow keys skip the section toggles.
    </Example>
  ),
};

export const Default: Story = {
  render: (args) => (
    <Example
      {...args}
      triggerLabel='Edit profile'
      footer={({ close }) => (
        <>
          <Button variant='secondary' onPress={close}>
            Cancel
          </Button>
          <Button onPress={close}>Save</Button>
        </>
      )}
    >
      <div className='flex flex-col gap-4'>
        <Input label='Display name' defaultValue='Eylül' />
        <Input label='Pronouns' defaultValue='they/them' />
      </div>
    </Example>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Edit profile' }));
    const dialog = await screen.findByRole('dialog');
    await expect(dialog).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const Small: Story = {
  args: { size: 'sm', title: 'Rename file', description: undefined },
  render: (args) => (
    <Example
      {...args}
      triggerLabel='Rename'
      footer={({ close }) => <Button onPress={close}>Rename</Button>}
    >
      <Input label='File name' defaultValue='tokens.css' />
    </Example>
  ),
};

export const Large: Story = {
  args: { size: 'lg', title: 'Release notes' },
  render: (args) => (
    <Example {...args} triggerLabel='Read release notes'>
      <p>
        This release adds Tabs and Toast, tightens focus styles and moves every colour to semantic
        tokens so that dark mode works without component changes.
      </p>
    </Example>
  ),
};

export const DestructiveConfirmation: Story = {
  args: {
    role: 'alertdialog',
    size: 'sm',
    title: 'Delete project?',
    description: 'This removes the project and its history. It cannot be undone.',
    isDismissable: false,
  },
  render: (args) => (
    <Example
      {...args}
      triggerLabel='Delete project'
      footer={({ close }) => (
        <>
          <Button variant='secondary' onPress={close}>
            Cancel
          </Button>
          <Button variant='destructive' onPress={close}>
            Delete
          </Button>
        </>
      )}
    />
  ),
};
