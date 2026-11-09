import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Avatar, AvatarGroup, getInitials } from '../Avatar';

const image = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

describe('getInitials', () => {
  it.each([
    { name: 'Eylül Güneş', initials: 'EG' },
    { name: '  ada   lovelace  ', initials: 'AL' },
    { name: 'Grace Brewster Murray Hopper', initials: 'GH' },
    { name: 'Cher', initials: 'C' },
    { name: '   ', initials: '' },
    { name: '𝓐lice 𝓑ob', initials: '𝓐𝓑' },
  ])('turns "$name" into "$initials"', ({ name, initials }) => {
    expect(getInitials(name)).toBe(initials);
  });
});

describe('Avatar', () => {
  it('falls back to initials named by the person when the image fails', () => {
    render(<Avatar name="Eylül Güneş" src="https://example.com/missing.png" />);

    fireEvent.error(screen.getByRole('img', { name: 'Eylül Güneş' }));

    expect(screen.getByRole('img', { name: 'Eylül Güneş' })).toHaveTextContent('EG');
  });

  it('announces the status as text', () => {
    render(<Avatar name="Eylül Güneş" status="away" />);

    expect(screen.getByText('Away')).toBeInTheDocument();
  });

  it('collapses avatars beyond max into a named counter', () => {
    render(
      <AvatarGroup aria-label="Reviewers" max={2}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Alan Turing" />
        <Avatar name="Katherine Johnson" />
      </AvatarGroup>,
    );

    expect(screen.getByRole('img', { name: '2 more' })).toHaveTextContent('+2');
    expect(screen.queryByRole('img', { name: 'Alan Turing' })).not.toBeInTheDocument();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Avatar name="Eylül Güneş" src={image} status="online" />
        <Avatar name="Ada Lovelace" size="xs" />
        <Avatar name="Grace Hopper" size="xl" status="busy" />
        <AvatarGroup aria-label="Reviewers" max={2} size="sm">
          <Avatar name="Ada Lovelace" size="sm" />
          <Avatar name="Grace Hopper" size="sm" />
          <Avatar name="Alan Turing" size="sm" />
        </AvatarGroup>
      </div>
    ));
  });
});
