import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { SiteFooter } from '../SiteFooter';

describe('SiteFooter', () => {
  it.each([
    { name: 'Portfolio', href: 'https://eylulg.github.io/' },
    { name: 'Sudoku (source)', href: 'https://github.com/eylulg/sudoku' },
  ])('links $name to its site, or its repository when not live', ({ name, href }) => {
    render(<SiteFooter />);

    const projects = screen.getByRole('navigation', { name: 'Projects' });
    expect(within(projects).getByRole('link', { name })).toHaveAttribute('href', href);
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
          source: '(Quellcode)',
          profilesNav: 'Profile',
          github: 'GitHub (Code)',
          linkedin: 'LinkedIn (Netzwerk)',
          builtWith: 'Gebaut mit @eylulg/ui',
        }}
      >
        <p>Film data by TMDB</p>
      </SiteFooter>,
    );

    const projects = screen.getByRole('navigation', { name: 'Projekte' });
    expect(within(projects).getByRole('link', { name: 'Sudoku (Quellcode)' })).toBeInTheDocument();
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
