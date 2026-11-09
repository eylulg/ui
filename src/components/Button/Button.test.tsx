import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label as the accessible name', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it.each(['primary', 'secondary', 'tertiary', 'destructive'] as const)(
    'exposes the %s variant',
    (variant) => {
      render(<Button variant={variant}>Go</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('exposes the %s size', (size) => {
    render(<Button size={size}>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
  });

  it('renders icon slots hidden from assistive technology', () => {
    const { container } = render(
      <Button iconLeading={Plus} iconTrailing={Plus}>
        Add
      </Button>,
    );
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
    icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'));
  });

  it('activates with Enter and Space', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Save</Button>);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('does not fire while disabled', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button isDisabled onPress={onPress}>
        Save
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('keeps focus but ignores presses while loading', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button isLoading onPress={onPress}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toHaveAttribute('data-pending', 'true');
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onPress).not.toHaveBeenCalled();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Button>Primary</Button>
        <Button variant="secondary" iconLeading={Plus}>
          Secondary
        </Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="destructive">Delete</Button>
        <Button isDisabled>Disabled</Button>
        <Button isLoading>Loading</Button>
      </div>
    ));
  });
});
