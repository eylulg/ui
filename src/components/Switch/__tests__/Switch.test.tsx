import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Switch } from '../Switch';

describe('Switch', () => {
  it('forwards its ref to the input that holds focus', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Switch ref={ref}>Sync</Switch>);

    expect(ref.current).toBe(screen.getByRole('switch', { name: 'Sync' }));
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Switch hint='Sync across devices'>Sync</Switch>
        <Switch defaultSelected size='sm'>
          Small and on
        </Switch>
        <Switch isDisabled>Disabled</Switch>
      </div>
    ));
  });
});
