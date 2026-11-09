import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Textarea } from '../Textarea';

const states = [
  {
    state: 'hint',
    props: { hint: 'Shown to your team.' },
    description: 'Shown to your team.',
    invalid: false,
  },
  {
    state: 'error',
    props: { hint: 'Shown to your team.', errorMessage: 'Enter a name.' },
    description: 'Enter a name.',
    invalid: true,
  },
] as const;

describe('Textarea', () => {
  it.each(states)('describes the field with its $state', ({ props, description, invalid }) => {
    render(<Textarea label="Name" {...props} />);

    const textarea = screen.getByRole('textbox', { name: 'Name' });
    expect(textarea).toHaveAccessibleDescription(description);
    expect(textarea.getAttribute('aria-invalid') === 'true').toBe(invalid);
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Textarea label="Message" hint="Be kind." />
        <Textarea label="Bio" errorMessage="Required." />
        <Textarea label="Disabled" isDisabled />
      </div>
    ));
  });
});
