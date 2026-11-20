import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label='Account settings'>
        <Tab id='profile'>Profile</Tab>
        <Tab id='billing'>Billing</Tab>
        <Tab id='team'>Team</Tab>
        <Tab id='security'>Security</Tab>
      </TabList>
      <TabPanel id='profile'>Name, photo and role.</TabPanel>
      <TabPanel id='billing'>Invoices and payment methods.</TabPanel>
      <TabPanel id='team'>Members and roles.</TabPanel>
      <TabPanel id='security'>Passkeys and sessions.</TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const DefaultSelected: Story = { args: { defaultSelectedKey: 'billing' } };
export const DisabledTab: Story = { args: { disabledKeys: ['team'] } };
/** In a narrow container the tab list scrolls sideways and keeps the selected tab in view. */
export const Narrow: Story = {
  args: { defaultSelectedKey: 'security' },
  decorators: [
    (Story) => (
      <div className='w-60'>
        <Story />
      </div>
    ),
  ],
};
