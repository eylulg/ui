import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a labelled multi line textbox', () => {
    render(<Textarea label="Message" rows={6} />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '6');
  });

  it('describes the field with hint or error', () => {
    const { rerender } = render(<Textarea label="Bio" hint="Max 200 characters." />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Max 200 characters.');
    rerender(<Textarea label="Bio" errorMessage="Bio is required." />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Bio is required.');
  });

  it('accepts multi line keyboard input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea label="Notes" onChange={onChange} />);
    await user.tab();
    await user.keyboard('line one{Enter}line two');
    expect(onChange).toHaveBeenLastCalledWith('line one\nline two');
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
