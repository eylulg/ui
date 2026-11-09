import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('has no axe violations in light and dark inside a busy region', async () => {
    await expectNoA11yViolations(() => (
      <div aria-busy="true" aria-label="Loading profile" role="region">
        <Skeleton shape="circle" />
        <Skeleton lines={2} />
        <Skeleton shape="rect" />
      </div>
    ));
  });
});
