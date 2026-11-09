import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Select, SelectItem } from './Select';

function CitySelect(props: Partial<React.ComponentProps<typeof Select>>) {
  return (
    <Select label="City" {...props}>
      <SelectItem id="ams">Amsterdam</SelectItem>
      <SelectItem id="osl">Oslo</SelectItem>
      <SelectItem id="ist">Istanbul</SelectItem>
    </Select>
  );
}

describe('Select', () => {
  it('renders a labelled trigger with the placeholder', () => {
    render(<CitySelect placeholder="Pick a city" />);
    const trigger = screen.getByRole('button', { name: /city/i });
    expect(trigger).toHaveTextContent('Pick a city');
  });

  it('opens with the keyboard and selects with arrows and Enter', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<CitySelect onSelectionChange={onSelectionChange} />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(onSelectionChange).toHaveBeenCalledWith('osl');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /city/i })).toHaveTextContent('Oslo');
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<CitySelect />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: /city/i })).toHaveFocus());
  });

  it('shows an error message', () => {
    render(<CitySelect errorMessage="Choose a city." />);
    expect(screen.getByText('Choose a city.')).toBeInTheDocument();
  });

  it('has no axe violations in light and dark, closed and open', async () => {
    await expectNoA11yViolations(() => <CitySelect hint="Where you work." />);
    await expectNoA11yViolations(
      () => <CitySelect />,
      async () => {
        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: /city/i }));
        await screen.findByRole('listbox');
      },
    );
  });
});
