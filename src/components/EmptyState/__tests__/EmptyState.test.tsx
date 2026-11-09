import { Inbox } from 'lucide-react';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Button } from '../../Button/Button';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <EmptyState
          icon={Inbox}
          title="No issues yet"
          description="Create an issue to start tracking work."
          primaryAction={<Button>Create issue</Button>}
          secondaryAction={<Button variant="secondary">Import issues</Button>}
        />
        <EmptyState size="sm" headingLevel={3} title="No results" />
      </div>
    ));
  });
});
