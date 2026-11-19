import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectItem } from './Select';

const cities = [
  { id: 'ams', name: 'Amsterdam' },
  { id: 'osl', name: 'Oslo' },
  { id: 'ist', name: 'Istanbul' },
  { id: 'ber', name: 'Berlin' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  args: {
    label: 'City',
    items: cities,
    children: (item: object) => {
      const city = item as (typeof cities)[number];
      return <SelectItem id={city.id}>{city.name}</SelectItem>;
    },
  },
  decorators: [(Story) => <div className='max-w-xs'>{Story()}</div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Where you usually work from.' } };
export const WithError: Story = { args: { errorMessage: 'Choose a city to continue.' } };
export const Preselected: Story = { args: { defaultSelectedKey: 'ist' } };
export const DisabledOption: Story = { args: { disabledKeys: ['ber'] } };
export const Disabled: Story = { args: { isDisabled: true } };

const countries: Record<string, string> = {
  ams: 'The Netherlands',
  osl: 'Norway',
  ist: 'Türkiye',
  ber: 'Germany',
};

/** A supporting line per option. It is not repeated in the trigger after choosing. */
export const WithDescriptions: Story = {
  args: {
    children: (item: object) => {
      const city = item as (typeof cities)[number];
      return (
        <SelectItem id={city.id} description={countries[city.id]}>
          {city.name}
        </SelectItem>
      );
    },
  },
};
