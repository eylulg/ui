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
    render(<SiteFooter currentId="portfolio" />);

    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('aria-current', 'page');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <SiteFooter currentId="portfolio" />);
  });
});
