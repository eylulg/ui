import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button, buttonStyles } from '../Button';

describe('Button', () => {
  it('keeps focus and its name but ignores presses while loading', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button isLoading onPress={onPress}>
        Save
      </Button>,
    );

    await user.tab();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('forwards its ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Save</Button>);

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Save' }));
  });

  it('renders a link when href is set and forwards its ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <Button href='/projects/new' ref={ref} variant='secondary'>
        New project
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'New project' });
    expect(link).toHaveAttribute('href', '/projects/new');
    expect(ref.current).toBe(link);
  });

  it('lets buttonStyles take extra classes that win over its defaults', () => {
    const styles = buttonStyles({ variant: 'secondary', size: 'sm', className: 'px-8' });

    expect(styles).toContain('px-8');
    expect(styles).not.toContain('px-3');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        {(['primary', 'secondary', 'tertiary', 'destructive', 'destructive-outline'] as const).map(
          (variant) => (
            <Button key={variant} variant={variant} iconLeading={Plus}>
              {variant}
            </Button>
          ),
        )}
        <Button href='/docs' variant='secondary'>
          Documentation
        </Button>
        <Button isDisabled>Disabled</Button>
        <Button isLoading>Loading</Button>
      </div>
    ));
  });
});
