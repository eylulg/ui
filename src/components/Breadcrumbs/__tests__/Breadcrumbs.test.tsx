import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { BreadcrumbItem, Breadcrumbs } from '../Breadcrumbs';

function Example() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href='/'>Projects</BreadcrumbItem>
      <BreadcrumbItem href='/workspace'>Workspace</BreadcrumbItem>
      <BreadcrumbItem>Settings</BreadcrumbItem>
    </Breadcrumbs>
  );
}

describe('Breadcrumbs', () => {
  it('wraps the trail in a named navigation landmark', () => {
    render(<Example />);

    expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toContainElement(
      screen.getByRole('link', { name: 'Workspace' }),
    );
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <Example />);
  });
});
