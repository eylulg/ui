import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { ToastProvider, useToast, type ToastPlacement, type ToastVariant } from './Toast';

function Trigger({ variant, sticky }: { variant: ToastVariant; sticky?: boolean }) {
  const { toast } = useToast();
  const copy: Record<ToastVariant, { title: string; description: string }> = {
    info: { title: 'New version available', description: 'Refresh to get the latest release.' },
    success: { title: 'Changes saved', description: 'Your profile is up to date.' },
    warning: { title: 'Storage almost full', description: 'You have used 90% of your quota.' },
    error: { title: 'Upload failed', description: 'Check your connection and try again.' },
  };
  return (
    <Button
      variant="secondary"
      onPress={() => toast({ ...copy[variant], variant, duration: sticky ? null : undefined })}
    >
      Show {variant} toast
    </Button>
  );
}

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  args: { children: null, placement: 'bottom-right', duration: 5000 },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top-right', 'bottom-right', 'bottom-center'] },
    children: { control: false },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const make = (variant: ToastVariant, sticky = false): Story => ({
  render: ({ placement, duration }) => (
    <ToastProvider placement={placement as ToastPlacement} duration={duration}>
      <Trigger variant={variant} sticky={sticky} />
    </ToastProvider>
  ),
});

export const Info = make('info');
export const Success = make('success');
export const Warning = make('warning');
export const ErrorToast: Story = { ...make('error'), name: 'Error' };
export const Persistent: Story = { ...make('info', true), name: 'Persistent (no auto close)' };
