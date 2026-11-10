import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Kbd } from '../Kbd';

describe('Kbd', () => {
  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <p>
        Press <Kbd>Esc</Kbd> to close or <Kbd keys={['⌘', 'K']} /> to search.
      </p>
    ));
  });

  it('keeps a decorative shortcut out of the text of its control', () => {
    render(
      <button type="button">
        Save <Kbd keys={['⌘', 'S']} decorative />
      </button>,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toHaveTextContent(/^Save\s*$/);
  });
});
