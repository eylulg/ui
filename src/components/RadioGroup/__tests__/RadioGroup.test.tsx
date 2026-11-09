import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Radio, RadioGroup, type RadioGroupProps } from '../RadioGroup';

function PlanGroup(props: Partial<RadioGroupProps>) {
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
  it('marks the group invalid and shows the error instead of the hint', () => {
    render(<PlanGroup hint="You can change later." errorMessage="Pick a plan." />);

    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Pick a plan.');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <PlanGroup defaultValue="pro" hint="You can change later." />
        <PlanGroup label="Billing plan" orientation="horizontal" isDisabled />
      </div>
    ));
  });
});
