import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Radio, RadioGroup } from './RadioGroup';

function PlanGroup(props: Partial<React.ComponentProps<typeof RadioGroup>>) {
  return (
    <RadioGroup label="Plan" {...props}>
      <Radio value="free">Free</Radio>
      <Radio value="pro" hint="For small teams">
        Pro
      </Radio>
      <Radio value="enterprise">Enterprise</Radio>
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('renders a labelled radiogroup with its radios', () => {
    render(<PlanGroup />);
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('moves selection with arrow keys as a single tab stop', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PlanGroup defaultValue="free" onChange={onChange} />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: /pro/i })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('pro');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Enterprise' })).toBeChecked();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('shows the error and marks the group invalid', () => {
    render(<PlanGroup errorMessage="Pick a plan." />);
    expect(screen.getByText('Pick a plan.')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <PlanGroup defaultValue="pro" hint="You can change later." />
    ));
    await expectNoA11yViolations(() => <PlanGroup orientation="horizontal" isDisabled />);
  });
});
