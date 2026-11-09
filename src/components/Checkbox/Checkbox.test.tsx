import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a labelled checkbox', () => {
    render(<Checkbox>Accept terms</Checkbox>);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).not.toBeChecked();
  });

  it('toggles with Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Subscribe</Checkbox>);
    await user.tab();
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('supports the indeterminate state', () => {
    render(<Checkbox isIndeterminate>Select all</Checkbox>);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('does not toggle while disabled', async () => {
    const user = userEvent.setup();
    render(<Checkbox isDisabled>Locked</Checkbox>);
    await user.click(screen.getByText('Locked'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <Checkbox hint="Weekly, no spam.">Newsletter</Checkbox>
        <Checkbox defaultSelected>Checked</Checkbox>
        <Checkbox isIndeterminate>Indeterminate</Checkbox>
        <Checkbox isDisabled>Disabled</Checkbox>
        <Checkbox aria-label="Row selected" />
      </div>
    ));
  });
});
