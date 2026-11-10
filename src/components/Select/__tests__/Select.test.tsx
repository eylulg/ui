import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Select, SelectItem, type SelectProps } from '../Select';

function CitySelect(props: Partial<SelectProps<object>>) {
  return (
    <Select label="City" {...props}>
      <SelectItem id="ams">Amsterdam</SelectItem>
      <SelectItem id="osl">Oslo</SelectItem>
      <SelectItem id="ist">Istanbul</SelectItem>
    </Select>
  );
}

describe('Select', () => {
  it('shows the error message instead of the hint', () => {
    render(<CitySelect hint="Where you work." errorMessage="Choose a city." />);

    expect(screen.getByText('Choose a city.')).toBeInTheDocument();
    expect(screen.queryByText('Where you work.')).not.toBeInTheDocument();
  });

  it('forwards its ref to the trigger button', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<CitySelect ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('button', { name: /city/i }));
  });

  it('has no axe violations in light and dark while open', async () => {
    await expectNoA11yViolations(
      () => <CitySelect hint="Where you work." />,
      async () => {
        await userEvent.setup().click(screen.getByRole('button', { name: /city/i }));
        await screen.findByRole('listbox');
      },
    );
  });
});
