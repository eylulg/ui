import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link } from 'react-aria-components';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LinkRouter } from '../LinkRouter';

describe('LinkRouter', () => {
  afterEach(() => vi.unstubAllGlobals());

  function setup(href: string, origin: string) {
    const navigate = vi.fn();
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign, origin });
    render(
      <LinkRouter navigate={navigate} useHref={(path) => `/agent-control-room${path}`}>
        <Link href={href}>Go</Link>
      </LinkRouter>,
    );
    return { navigate, assign, link: screen.getByRole('link', { name: 'Go' }) };
  }

  it('keeps an absolute URL as it is and loads it as a page', async () => {
    const { navigate, assign, link } = setup(
      'https://eylulg.github.io/',
      'https://eylulg.github.io',
    );
    expect(link).toHaveAttribute('href', 'https://eylulg.github.io/');
    await userEvent.click(link);
    expect(navigate).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledWith('https://eylulg.github.io/');
  });

  it('routes an in-app path through the router', async () => {
    const { navigate, assign, link } = setup('/queue', window.location.origin);
    expect(link).toHaveAttribute('href', '/agent-control-room/queue');
    await userEvent.click(link);
    expect(navigate).toHaveBeenCalledWith('/queue', undefined);
    expect(assign).not.toHaveBeenCalled();
  });
});
