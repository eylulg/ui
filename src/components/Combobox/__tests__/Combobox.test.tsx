import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Combobox, ComboboxItem, ComboboxSection, type ComboboxProps } from '../Combobox';

function CityCombobox(props: Partial<ComboboxProps<object>>) {
  return (
    <Combobox label='City' {...props}>
      <ComboboxSection title='Netherlands'>
        <ComboboxItem id='ams' description='Capital'>
          Amsterdam
        </ComboboxItem>
        <ComboboxItem id='rtm'>Rotterdam</ComboboxItem>
      </ComboboxSection>
      <ComboboxSection title='Norway'>
        <ComboboxItem id='osl'>Oslo</ComboboxItem>
      </ComboboxSection>
    </Combobox>
  );
}

async function type(text: string) {
  const user = userEvent.setup();
  await user.type(screen.getByRole('combobox', { name: 'City' }), text);
  return user;
}

describe('Combobox', () => {
  it('labels each section with its title', async () => {
    render(<CityCombobox />);

    await type('o');

    expect(screen.getByRole('group', { name: 'Norway' })).toBeInTheDocument();
  });

  it('names an option with a description by its label first, then the description', async () => {
    render(<CityCombobox />);

    await type('ams');

    expect(screen.getByRole('option', { name: /^Amsterdam\s*Capital/ })).toBeVisible();
  });

  it.each([
    { props: {}, shown: 'No results' },
    { props: { emptyState: 'No city matches' }, shown: 'No city matches' },
  ])('shows "$shown" when nothing matches', async ({ props, shown }) => {
    render(<CityCombobox {...props} />);

    await type('zzz');

    expect(screen.getByRole('listbox')).toHaveTextContent(shown);
  });

  it('announces loading while results are pending', () => {
    render(<CityCombobox isLoading loadingLabel='Loading cities' />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading cities');
  });

  it('marks the field invalid and shows the error instead of the hint', () => {
    render(<CityCombobox hint='Where you work.' errorMessage='Choose a city.' />);

    const input = screen.getByRole('combobox', { name: 'City' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Choose a city.');
  });

  it('has no axe violations in light and dark while open', async () => {
    await expectNoA11yViolations(
      () => <CityCombobox hint='Where you work.' />,
      async () => {
        await type('a');
        await screen.findByRole('listbox');
      },
    );
  });
});
