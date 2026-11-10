import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button', onPress: fn() },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'destructive-outline'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    iconLeading: { control: false },
    iconTrailing: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };
export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete', iconLeading: Trash2 },
};

export const DestructiveOutline: Story = {
  args: { variant: 'destructive-outline', children: 'Delete project', iconLeading: Trash2 },
};

/** With `href`, Button renders a link (an anchor) with button styles. */
export const AsLink: Story = {
  args: {
    href: '#docs',
    variant: 'secondary',
    children: 'Read the docs',
    iconTrailing: ArrowRight,
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Read the docs' }),
    ).toHaveAttribute('href', '#docs');
  },
};

export const Small: Story = { args: { size: 'sm' } };
export const Medium: Story = { args: { size: 'md' } };
export const Large: Story = { args: { size: 'lg' } };

export const WithLeadingIcon: Story = { args: { iconLeading: Plus, children: 'New project' } };
export const WithTrailingIcon: Story = { args: { iconTrailing: ArrowRight, children: 'Continue' } };

export const Loading: Story = { args: { isLoading: true, children: 'Saving' } };
export const Disabled: Story = { args: { isDisabled: true } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          {(
            ['primary', 'secondary', 'tertiary', 'destructive', 'destructive-outline'] as const
          ).map((variant) => (
            <Button key={variant} {...args} variant={variant} size={size}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const KeyboardPress: Story = {
  args: { children: 'Press me' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button')).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};
