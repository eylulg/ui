import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Kbd } from '../Kbd';

describe('Kbd', () => {
  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <p>
        Press <Kbd>Esc</Kbd> to close or <Kbd keys={['⌘', 'K']} /> to search.
      </p>
    ));
  });
});
