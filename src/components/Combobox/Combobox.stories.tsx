import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAsyncList } from 'react-aria-components';
import { expect, userEvent, within } from 'storybook/test';
import { Combobox, ComboboxItem, ComboboxSection } from './Combobox';

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  args: { label: 'City', placeholder: 'Amsterdam', children: null },
  parameters: { docs: { story: { height: '360px' } } },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const cities = [
  { id: 'ams', name: 'Amsterdam', country: 'Netherlands' },
  { id: 'rtm', name: 'Rotterdam', country: 'Netherlands' },
  { id: 'osl', name: 'Oslo', country: 'Norway' },
  { id: 'brg', name: 'Bergen', country: 'Norway' },
  { id: 'ist', name: 'Istanbul', country: 'Turkey' },
];

export const Basic: Story = {
  render: (args) => (
    <Combobox {...args} className="max-w-xs">
      {cities.map((city) => (
        <ComboboxItem key={city.id} id={city.id}>
          {city.name}
        </ComboboxItem>
      ))}
    </Combobox>
  ),
};

export const WithSectionsAndDescriptions: Story = {
  render: (args) => (
    <Combobox {...args} className="max-w-xs">
      <ComboboxSection title="Netherlands">
        <ComboboxItem id="ams" description="Capital">
          Amsterdam
        </ComboboxItem>
        <ComboboxItem id="rtm">Rotterdam</ComboboxItem>
      </ComboboxSection>
      <ComboboxSection title="Norway">
        <ComboboxItem id="osl" description="Capital">
          Oslo
        </ComboboxItem>
        <ComboboxItem id="brg">Bergen</ComboboxItem>
      </ComboboxSection>
    </Combobox>
  ),
};

export const WithHint: Story = { ...Basic, args: { hint: 'Where you work most days.' } };
export const WithError: Story = {
  ...Basic,
  args: { errorMessage: 'Choose a city from the list.' },
};
export const Disabled: Story = { ...Basic, args: { isDisabled: true } };
export const Loading: Story = { ...Basic, args: { isLoading: true } };

export const CustomEmptyState: Story = {
  ...Basic,
  args: { emptyState: 'No city matches. Try another spelling.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('combobox', { name: 'City' }), 'zzz');
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText('No city matches. Try another spelling.')).toBeVisible();
  },
};

interface City {
  id: string;
  name: string;
}

function AsyncCities() {
  const list = useAsyncList<City>({
    async load({ filterText, signal }) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (signal.aborted) return { items: [] };
      const query = (filterText ?? '').toLowerCase();
      return { items: cities.filter((city) => city.name.toLowerCase().includes(query)) };
    },
  });

  return (
    <Combobox
      label="City"
      className="max-w-xs"
      items={list.items}
      inputValue={list.filterText}
      onInputChange={list.setFilterText}
      isLoading={list.isLoading}
    >
      {(city) => <ComboboxItem id={city.id}>{city.name}</ComboboxItem>}
    </Combobox>
  );
}

export const Async: Story = { render: () => <AsyncCities /> };

export const KeyboardSelect: Story = {
  ...Basic,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'City' });
    await userEvent.type(input, 'os');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Oslo');
  },
};
