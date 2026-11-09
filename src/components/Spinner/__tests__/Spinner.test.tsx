import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it.each([
    { label: 'Loading issues', announced: ['Loading issues'] },
    { label: undefined, announced: [] },
  ])('announces $announced when the label is $label', ({ label, announced }) => {
    render(<Spinner label={label} />);

    expect(screen.queryAllByRole('status').map((node) => node.textContent)).toEqual(announced);
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Spinner size="sm" />
        <Spinner label="Loading issues" />
        <Spinner size="lg" />
      </div>
    ));
  });
});
