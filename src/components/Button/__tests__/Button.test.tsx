import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button } from '../Button';

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

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        {(['primary', 'secondary', 'tertiary', 'destructive'] as const).map((variant) => (
          <Button key={variant} variant={variant} iconLeading={Plus}>
            {variant}
          </Button>
        ))}
        <Button isDisabled>Disabled</Button>
        <Button isLoading>Loading</Button>
      </div>
    ));
  });
});
