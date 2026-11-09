import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoreHorizontal } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button } from '../../Button/Button';
import { IconButton } from '../../IconButton/IconButton';
import { Card, CardBody, CardFooter, CardHeader, type CardProps } from '../Card';

function Example(props: Omit<CardProps, 'children'>) {
  return (
    <Card {...props}>
      <CardHeader
        title="Theme variants"
        description="Eight project palettes"
        actions={
          <IconButton
            icon={MoreHorizontal}
            aria-label="More options"
            variant="tertiary"
            size="sm"
          />
        }
      />
      <CardBody>Generated in oklch with matched contrast.</CardBody>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Archive
        </Button>
      </CardFooter>
    </Card>
  );
}

describe('Card', () => {
  it.each([
    { props: { href: '/themes' }, role: 'link' },
    { props: { onPress: () => {} }, role: 'button' },
  ] as const)('is one $role named by its title', ({ props, role }) => {
    render(<Example {...props} />);

    expect(screen.getByRole(role, { name: 'Theme variants' })).toBeInTheDocument();
  });

  it('runs onPress when the card is activated from the keyboard', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Example onPress={onPress} />);

    await user.tab();
    await user.keyboard('{Enter}');

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('keeps nested actions as separate tab stops after the card', async () => {
    const user = userEvent.setup();
    render(<Example href="/themes" />);

    await user.tab();
    await user.tab();

    expect(screen.getByRole('button', { name: 'More options' })).toHaveFocus();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Example />
        <Example href="/themes" />
      </div>
    ));
  });
});
