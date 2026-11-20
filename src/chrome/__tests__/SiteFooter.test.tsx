import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { SiteFooter } from '../SiteFooter';

const project = { description: '', variant: null, repoUrl: 'https://github.com/eylulg/x' };

describe('SiteFooter', () => {
  it('links each project to its live site, or to its repository without one', () => {
    render(
      <SiteFooter
        projects={[
          { ...project, id: 'live', name: 'Live app', url: 'https://example.com/' },
          { ...project, id: 'draft', name: 'Draft app', url: null },
        ]}
      />,
    );

    const nav = within(screen.getByRole('navigation', { name: 'Projects' }));
    expect(nav.getByRole('link', { name: 'Live app' })).toHaveAttribute(
      'href',
      'https://example.com/',
    );
    expect(nav.getByRole('link', { name: 'Draft app' })).toHaveAttribute(
      'href',
      'https://github.com/eylulg/x',
    );
  });

  it('marks the project it is shown in', () => {
    render(<SiteFooter currentId='portfolio' />);

    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Sudoku' })).not.toHaveAttribute('aria-current');
  });

  it('links the profiles and the library by name', () => {
    render(<SiteFooter />);

    expect(screen.getAllByRole('link', { name: 'GitHub' })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Built with @eylulg/ui' })).toBeInTheDocument();
    expect(screen.getByText(/Every project's code is on/)).toBeInTheDocument();
  });

  it('translates every visible string and shows extra content', () => {
    render(
      <SiteFooter
        labels={{
          projectsNav: 'Projekte',
          profilesNav: 'Profile',
          github: 'GitHub (Code)',
          linkedin: 'LinkedIn (Netzwerk)',
          codeNote: 'Der Code jedes Projekts liegt auf {github}.',
          builtWith: 'Gebaut mit @eylulg/ui',
        }}
      >
        <p>Film data by TMDB</p>
      </SiteFooter>,
    );

    expect(screen.getByRole('navigation', { name: 'Projekte' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'GitHub (Code)' })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'LinkedIn (Netzwerk)' })).toBeInTheDocument();
    expect(screen.getByText(/Der Code jedes Projekts liegt auf/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gebaut mit @eylulg/ui' })).toBeInTheDocument();
    expect(screen.getByText('Film data by TMDB')).toBeInTheDocument();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <SiteFooter currentId='portfolio' />);
  });
});
