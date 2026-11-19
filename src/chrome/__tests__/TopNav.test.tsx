import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { TopNav } from '../TopNav';
import type { LinkProps } from '../types';

const links = [
  { href: '/issues', label: 'Issues', isCurrent: true },
  { href: '/projects', label: 'Roadmap' },
];

function RouterLink({ href, children, ...props }: LinkProps) {
  return (
    <a href={`/app${href}`} data-router="yes" {...props}>
      {children}
    </a>
  );
}

// The overlay is a lazy chunk. Importing it once here keeps its first transform, which is slow on a
// busy machine, out of the tests' one second wait for the overlay to appear.
beforeAll(() => import('../MobileMenu'));

async function openMenu() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Open menu' }));
  const drawer = await screen.findByRole('dialog', { name: 'Workspace' });
  return { user, drawer };
}

describe('TopNav', () => {
  it('renders links through the given LinkComponent', () => {
    render(<TopNav productName="Workspace" links={links} LinkComponent={RouterLink} />);

    expect(screen.getByRole('link', { name: 'Roadmap' })).toHaveAttribute('href', '/app/projects');
  });

  it('marks the current page', () => {
    render(<TopNav productName="Workspace" links={links} />);

    expect(screen.getByRole('link', { name: 'Issues' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens the mobile menu with the links and actions', async () => {
    render(
      <TopNav
        productName="Workspace"
        links={links}
        actions={<button type="button">Theme</button>}
      />,
    );

    const { drawer } = await openMenu();

    expect(within(drawer).getByRole('link', { name: 'Roadmap' })).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: 'Theme' })).toBeInTheDocument();
  });

  it('closes the mobile menu when a link is chosen', async () => {
    render(<TopNav productName="Workspace" links={links} />);
    const { user, drawer } = await openMenu();

    await user.click(within(drawer).getByRole('link', { name: 'Roadmap' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('returns focus to the menu button when the menu closes', async () => {
    render(<TopNav productName="Workspace" links={links} />);
    const { user } = await openMenu();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus());
  });

  it('shows the centre slot in the bar and at the top of the menu, and compact actions in the bar', async () => {
    render(
      <TopNav
        productName="Workspace"
        center={<button type="button">Search</button>}
        compactActions={<button type="button">Theme</button>}
      />,
    );

    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument();
    const { drawer } = await openMenu();

    expect(within(drawer).getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('shows translated menu labels', async () => {
    const user = userEvent.setup();
    render(
      <TopNav
        productName="Workspace"
        labels={{ openMenu: 'Menü öffnen', closeMenu: 'Menü schließen' }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    expect(await screen.findByRole('button', { name: 'Menü schließen' })).toBeInTheDocument();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <TopNav productName="Workspace" links={links} />);
  });
});
