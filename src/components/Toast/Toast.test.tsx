import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from '../Button/Button';
import { ToastProvider, useToast, type ToastOptions } from './Toast';

function Trigger(options: Partial<ToastOptions>) {
  const { toast, dismiss } = useToast();
  return (
    <>
      <Button
        onPress={() => toast({ title: 'Saved', description: 'Your changes are live.', ...options })}
      >
        Notify
      </Button>
      <Button variant="secondary" onPress={() => dismiss()}>
        Clear all
      </Button>
    </>
  );
}

function Example(props: Partial<ToastOptions> & { duration?: number }) {
  const { duration, ...options } = props;
  return (
    <ToastProvider duration={duration}>
      <Trigger {...options} />
    </ToastProvider>
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe('Toast', () => {
  it('renders an always present, labelled live region', () => {
    render(<Example />);
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region.querySelector('[aria-live="polite"]')).not.toBeNull();
  });

  it('shows a toast from the hook, triggered by keyboard', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes are live.')).toBeInTheDocument();
  });

  it('dismisses with the close button and with dismiss()', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getAllByText('Saved')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('closes itself after the duration', async () => {
    vi.useFakeTimers();
    render(<Example duration={1000} />);
    act(() => {
      screen.getByRole('button', { name: 'Notify' }).click();
    });
    expect(screen.getByText('Saved')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1001);
    });
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('stays open when duration is null', async () => {
    vi.useFakeTimers();
    render(<Example duration={1000} />);
    act(() => {
      screen.getByRole('button', { name: 'Notify' }).click();
    });
    expect(screen.getByText('Saved')).toBeInTheDocument();
    render(
      <ToastProvider duration={1000}>
        <Trigger title="Sticky" duration={null} />
      </ToastProvider>,
    );
    act(() => {
      screen.getAllByRole('button', { name: 'Notify' })[1]!.click();
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Sticky')).toBeInTheDocument();
  });

  it('throws a helpful error outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
  });

  it('has no axe violations in light and dark with every variant visible', async () => {
    await expectNoA11yViolations(
      () => (
        <ToastProvider duration={60_000}>
          <Variants />
        </ToastProvider>
      ),
      async () => {
        await userEvent.setup().click(screen.getByRole('button', { name: 'Show all' }));
      },
    );
  });
});

function Variants() {
  const { toast } = useToast();
  return (
    <Button
      onPress={() =>
        (['info', 'success', 'warning', 'error'] as const).forEach((variant) =>
          toast({ title: `${variant} title`, description: 'Details', variant }),
        )
      }
    >
      Show all
    </Button>
  );
}
