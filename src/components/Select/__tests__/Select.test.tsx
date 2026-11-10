import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
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

  it('reports key presses on the trigger', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(<CitySelect onKeyDown={onKeyDown} />);

    await user.tab();
    await user.keyboard('{Escape}');

    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }));
  });

  it('names an option by its label first, then its description', async () => {
    const user = userEvent.setup();
    render(
      <Select label="City">
        <SelectItem id="ams" description="The Netherlands">
          Amsterdam
        </SelectItem>
        <SelectItem id="osl">Oslo</SelectItem>
      </Select>,
    );

    await user.click(screen.getByRole('button', { name: /city/i }));
    await user.click(await screen.findByRole('option', { name: /^Amsterdam\s*The Netherlands/ }));

    expect(screen.getByRole('button', { name: /city/i })).toHaveTextContent('Amsterdam');
  });

  it('has no axe violations in light and dark while open', async () => {
    await expectNoA11yViolations(
      () => (
        <Select label="City" hint="Where you work.">
          <SelectItem id="ams" description="The Netherlands">
            Amsterdam
          </SelectItem>
          <SelectItem id="osl">Oslo</SelectItem>
        </Select>
      ),
      async () => {
        await userEvent.setup().click(screen.getByRole('button', { name: /city/i }));
        await screen.findByRole('listbox');
      },
    );
  });
});
