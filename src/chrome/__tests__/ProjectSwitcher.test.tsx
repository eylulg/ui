import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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

  it('tells the user which project they are in', async () => {
    await open();

    expect(screen.getByRole('menuitem', { name: /^Live app\s*You are here/ })).toBeVisible();
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
