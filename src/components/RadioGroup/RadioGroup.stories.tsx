import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './RadioGroup';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  args: {
    label: 'Plan',
    defaultValue: 'pro',
    children: (
      <>
        <Radio value="free" hint="For personal projects">
          Free
        </Radio>
        <Radio value="pro" hint="For small teams">
          Pro
        </Radio>
        <Radio value="enterprise" hint="SSO and audit logs">
          Enterprise
        </Radio>
      </>
    ),
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
export const WithHint: Story = { args: { hint: 'You can switch plans at any time.' } };
export const WithError: Story = { args: { defaultValue: undefined, errorMessage: 'Pick a plan.' } };
export const Disabled: Story = { args: { isDisabled: true } };
