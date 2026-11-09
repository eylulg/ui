import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mail, Search } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the input', () => {
    render(<Input label="Email" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('links the hint through aria-describedby', () => {
    render(<Input label="Email" hint="We never share it." />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('We never share it.');
  });

  it('marks the field invalid and describes it with the error message', () => {
    render(<Input label="Email" hint="Hidden while invalid" errorMessage="Enter a valid email." />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid email.');
    expect(screen.queryByText('Hidden while invalid')).not.toBeInTheDocument();
  });

  it('renders leading and trailing icons as decoration', () => {
    const { container } = render(<Input label="Search" iconLeading={Search} iconTrailing={Mail} />);
    const icons = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(icons).toHaveLength(2);
  });

  it('accepts typing after tabbing in', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);
    await user.tab();
    expect(screen.getByRole('textbox')).toHaveFocus();
    await user.keyboard('Eylül');
    expect(onChange).toHaveBeenLastCalledWith('Eylül');
  });

  it('cannot be edited while disabled', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" isDisabled />);
    await user.tab();
    expect(screen.getByRole('textbox')).not.toHaveFocus();
    expect(screen.getByRole('textbox')).toBeDisabled();
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
