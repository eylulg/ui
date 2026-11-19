import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button } from '../../Button/Button';
import { ToastProvider, useToast, type ToastOptions, type ToastVariant } from '../Toast';

const variants: ToastVariant[] = ['info', 'success', 'warning', 'error'];

function Trigger(options: Partial<ToastOptions>) {
  const { toast, dismiss } = useToast();

  function handleNotify() {
    toast({ title: 'Saved', description: 'Your changes are live.', ...options });
  }

  function handleClear() {
    dismiss();
  }

  return (
    <>
      <Button onPress={handleNotify}>Notify</Button>
      <Button variant='secondary' onPress={handleClear}>
        Clear all
      </Button>
    </>
  );
}

function Example({ duration, ...options }: Partial<ToastOptions> & { duration?: number }) {
  return (
    <ToastProvider duration={duration}>
      <Trigger {...options} />
    </ToastProvider>
  );
}

function AllVariants() {
  const { toast } = useToast();

  function handleShowAll() {
    for (const variant of variants) {
      toast({
        title: `${variant} title`,
        description: 'Details',
        variant,
        action: variant === 'error' ? { label: 'Retry', onPress: () => {} } : undefined,
      });
    }
  }

  return <Button onPress={handleShowAll}>Show all</Button>;
}

function notify() {
  act(() => {
    screen.getByRole('button', { name: 'Notify' }).click();
  });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('Toast', () => {
  it('keeps a polite live list in the DOM before any toast', () => {
    render(<Example />);

    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(within(region).getByRole('list')).toHaveAttribute('aria-live', 'polite');
  });

  it('shows a toast from the hook', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Notify' }));

    expect(await screen.findByText('Your changes are live.')).toBeInTheDocument();
  });

  it('dismisses a toast with its close button', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Notify' }));

    await user.click(await screen.findByRole('button', { name: 'Dismiss notification' }));

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('runs the action, closes the toast and returns focus to the control the user came from', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Example action={{ label: 'Undo', onPress }} duration={60_000} />);
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await screen.findByText('Saved');

    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear all' })).toHaveFocus();
  });

  it('closes a focused toast with Escape and returns focus', async () => {
    const user = userEvent.setup();
    render(<Example duration={60_000} />);
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await screen.findByText('Saved');
    await user.tab();
    await user.tab();

    await user.keyboard('{Escape}');

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear all' })).toHaveFocus();
  });

  it('dismisses every toast with dismiss()', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await screen.findAllByText('Saved');

    await user.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it.each([
    { duration: undefined, visible: false },
    { duration: null, visible: true },
  ])(
    'with duration $duration is visible after the default delay: $visible',
    async ({ duration, visible }) => {
      vi.useFakeTimers();
      render(
        <ToastProvider duration={1000}>
          <Trigger duration={duration} />
        </ToastProvider>,
      );
      notify();
      await vi.waitFor(() => expect(screen.getByText('Saved')).toBeInTheDocument());

      act(() => {
        vi.advanceTimersByTime(1001);
      });

      expect(Boolean(screen.queryByText('Saved'))).toBe(visible);
    },
  );

  it('throws a helpful error outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
  });

  it('has no axe violations in light and dark with every variant visible', async () => {
    await expectNoA11yViolations(
      () => (
        <ToastProvider duration={60_000}>
          <AllVariants />
        </ToastProvider>
      ),
      async () => {
        await userEvent.setup().click(screen.getByRole('button', { name: 'Show all' }));
        await screen.findByText('error title');
      },
    );
  });
});
