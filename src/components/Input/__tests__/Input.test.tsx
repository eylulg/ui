import { render, screen } from '@testing-library/react';
import { Mail, Search } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Input } from '../Input';

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

describe('Input', () => {
  it.each(states)('describes the field with its $state', ({ props, description, invalid }) => {
    render(<Input label="Name" {...props} />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAccessibleDescription(description);
    expect(input.getAttribute('aria-invalid') === 'true').toBe(invalid);
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Input label="Email" hint="Work address" iconLeading={Mail} placeholder="you@example.com" />
        <Input label="Password" type="password" errorMessage="Too short." />
        <Input aria-label="Search" iconLeading={Search} />
        <Input label="Disabled" isDisabled />
      </div>
    ));
  });
});
