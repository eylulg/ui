import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings } from 'lucide-react';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { IconButton } from '../../IconButton/IconButton';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  it('has no axe violations in light and dark while open', async () => {
    await expectNoA11yViolations(
      () => (
        <Tooltip content="Open settings" delay={0}>
          <IconButton icon={Settings} aria-label="Settings" />
        </Tooltip>
      ),
      async () => {
        await userEvent.setup().tab();
        await screen.findByRole('tooltip');
      },
    );
  });
});
