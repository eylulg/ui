import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Badge } from '../../Badge/Badge';
import { BreadcrumbItem, Breadcrumbs } from '../../Breadcrumbs/Breadcrumbs';
import { Button } from '../../Button/Button';
import { PageHeader } from '../PageHeader';

describe('PageHeader', () => {
  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <PageHeader
        title="Issues"
        description="Everything in progress across your projects."
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbItem href="/">Workspace</BreadcrumbItem>
            <BreadcrumbItem>Issues</BreadcrumbItem>
          </Breadcrumbs>
        }
        meta={<Badge color="brand">12 open</Badge>}
        actions={<Button>New issue</Button>}
      />
    ));
  });
});
