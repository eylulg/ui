import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { AppShell } from '../AppShell';

describe('AppShell', () => {
  it('starts with a skip link that targets the main landmark', async () => {
    const user = userEvent.setup();
    render(
      <AppShell header={<button type='button'>Menu</button>}>
        <h1>Issues</h1>
      </AppShell>,
    );

    await user.tab();

    const skip = screen.getByRole('link', { name: 'Skip to content' });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', `#${screen.getByRole('main').id}`);
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <AppShell
        header={<header>Header</header>}
        sidebar={<nav aria-label='Sidebar'>Sidebar</nav>}
        footer={<footer>Footer</footer>}
      >
        <h1>Issues</h1>
      </AppShell>
    ));
  });
});
