import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Switch } from '../Switch';

describe('Switch', () => {
  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Switch hint="Sync across devices">Sync</Switch>
        <Switch defaultSelected size="sm">
          Small and on
        </Switch>
        <Switch isDisabled>Disabled</Switch>
      </div>
    ));
  });
});
