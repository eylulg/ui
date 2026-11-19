import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import type { Project } from '../projects';
import { ProjectSwitcher } from '../ProjectSwitcher';

const list: Project[] = [
  {
    id: 'live',
    name: 'Live app',
    description: 'Deployed',
    url: 'https://live.example',
    variant: 'workspace',
    repoUrl: 'https://github.com/eylulg/live',
  },
  {
    id: 'planned',
    name: 'Planned app',
    description: 'Not deployed',
    url: null,
    plannedUrl: 'https://planned.example',
    variant: 'sudoku',
    repoUrl: 'https://github.com/eylulg/planned',
  },
];

// The overlay is a lazy chunk. Importing it once here keeps its first transform, which is slow on a
// busy machine, out of the tests' one second wait for the overlay to appear.
beforeAll(() => import('../ProjectSwitcherMenu'));

async function open() {
  const user = userEvent.setup();
  render(<ProjectSwitcher projects={list} currentId="live" />);
  await user.click(screen.getByRole('button', { name: 'Projects' }));
  await screen.findByRole('menu');
}

describe('ProjectSwitcher', () => {
  it.each([
    { name: 'Live app', href: 'https://live.example' },
    { name: 'Planned app', href: 'https://github.com/eylulg/planned' },
  ])('links $name to its site, or its repository when not live', async ({ name, href }) => {
    await open();

    expect(screen.getByRole('menuitem', { name: new RegExp(`^${name}`) })).toHaveAttribute(
      'href',
      href,
    );
  });

  it('returns focus to the trigger when the menu closes', async () => {
    const user = userEvent.setup();
    render(<ProjectSwitcher projects={list} currentId="live" />);
    await user.click(screen.getByRole('button', { name: 'Projects' }));
    await screen.findByRole('menu');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Projects' })).toHaveFocus());
  });

  it('tells the user which project they are in', async () => {
    await open();

    expect(screen.getByRole('menuitem', { name: /^Live app\s*You are here/ })).toBeVisible();
  });

  it('shows translated texts', async () => {
    const user = userEvent.setup();
    render(
      <ProjectSwitcher
        projects={list}
        currentId="live"
        labels={{
          label: 'Projekte',
          heading: 'Projekte von Eylül',
          youAreHere: 'Sie sind hier',
          sourceCode: '(Quellcode)',
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Projekte' }));

    expect(await screen.findByRole('group', { name: 'Projekte von Eylül' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /^Live app\s*Sie sind hier/ })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: /Not deployed \(Quellcode\)/ })).toBeVisible();
  });

  it('has no axe violations in light and dark while open', async () => {
    await expectNoA11yViolations(
      () => <ProjectSwitcher currentId="portfolio" />,
      async () => {
        await userEvent.setup().click(screen.getByRole('button', { name: 'Projects' }));
        await screen.findByRole('menu');
      },
    );
  });
});
