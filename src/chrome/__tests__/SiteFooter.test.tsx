import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { projects } from '../projects';
import { SiteFooter } from '../SiteFooter';

describe('SiteFooter', () => {
  it('lists only live projects under Live, linking to their sites', () => {
    render(<SiteFooter />);

    const live = screen.getByRole('list', { name: 'Live' });
    expect(within(live).getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
      'href',
      'https://eylulg.github.io/',
    );
    expect(within(live).queryByRole('link', { name: /Sudoku/ })).not.toBeInTheDocument();
  });

  it('lists every project under Code, linking to its repository', () => {
    render(<SiteFooter />);

    const code = screen.getByRole('list', { name: 'Code' });
    expect(within(code).getAllByRole('listitem')).toHaveLength(projects.length);
    expect(within(code).getByRole('link', { name: 'Sudoku Code' })).toHaveAttribute(
      'href',
      'https://github.com/eylulg/sudoku',
    );
  });

  it('marks the project it is shown in', () => {
    render(<SiteFooter currentId='portfolio' />);

    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('aria-current', 'page');
  });

  it('translates every visible string and shows extra content', () => {
    render(
      <SiteFooter
        labels={{
          intro: 'Teil der Projekte von Eylül Güneş',
          projectsNav: 'Projekte',
          live: 'Online',
          code: 'Quellcode',
          profilesNav: 'Profile',
          github: 'GitHub (Code)',
          linkedin: 'LinkedIn (Netzwerk)',
          builtWith: 'Gebaut mit @eylulg/ui',
        }}
      >
        <p>Film data by TMDB</p>
      </SiteFooter>,
    );

    expect(screen.getByRole('navigation', { name: 'Projekte' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Online' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sudoku Quellcode' })).toBeInTheDocument();
    expect(screen.getByText('Teil der Projekte von Eylül Güneş')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn (Netzwerk)' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gebaut mit @eylulg/ui' })).toBeInTheDocument();
    expect(screen.getByText('Film data by TMDB')).toBeInTheDocument();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <SiteFooter currentId='portfolio' />);
  });
});
