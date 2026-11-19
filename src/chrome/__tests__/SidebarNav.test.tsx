import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { IconButton } from '../../components/IconButton/IconButton';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { SidebarNav, type SidebarNavSection } from '../SidebarNav';

const sections: SidebarNavSection[] = [
  {
    id: 'main',
    items: [
      { href: '/inbox', label: 'Inbox', isCurrent: true },
      {
        href: '/issues',
        label: 'My issues',
        action: <IconButton icon={Plus} aria-label='Add issue' variant='tertiary' size='sm' />,
      },
    ],
  },
  {
    id: 'teams',
    title: 'Teams',
    collapsible: true,
    items: [{ href: '/teams/web', label: 'Web' }],
  },
];

describe('SidebarNav', () => {
  it.each([
    { key: '{ArrowDown}', from: 'Inbox', to: 'My issues' },
    { key: '{ArrowUp}', from: 'Inbox', to: 'Web' },
    { key: '{End}', from: 'Inbox', to: 'Web' },
    { key: '{Home}', from: 'Web', to: 'Inbox' },
  ])('moves focus from $from to $to with $key', async ({ key, from, to }) => {
    const user = userEvent.setup();
    render(<SidebarNav sections={sections} />);
    screen.getByRole('link', { name: from }).focus();

    await user.keyboard(key);

    expect(screen.getByRole('link', { name: to })).toHaveFocus();
  });

  it('skips links inside a collapsed section', async () => {
    const user = userEvent.setup();
    render(<SidebarNav sections={sections} />);
    await user.click(screen.getByRole('button', { name: 'Teams' }));
    screen.getByRole('button', { name: 'Teams' }).focus();

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('link', { name: 'Inbox' })).toHaveFocus();
  });

  it('keeps an item action as its own control that arrow keys reach', async () => {
    const user = userEvent.setup();
    render(<SidebarNav sections={sections} />);
    screen.getByRole('link', { name: 'My issues' }).focus();

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('button', { name: 'Add issue' })).toHaveFocus();
  });

  it('marks the current page', () => {
    render(<SidebarNav sections={sections} />);

    expect(screen.getByRole('link', { name: 'Inbox' })).toHaveAttribute('aria-current', 'page');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <SidebarNav sections={sections} />);
  });
});
