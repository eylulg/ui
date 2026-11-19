import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextSizeToggle } from './TextSizeToggle';
import { ThemeToggle } from './ThemeToggle';

const meta = {
  title: 'Chrome/TextSizeToggle',
  component: TextSizeToggle,
} satisfies Meta<typeof TextSizeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pressed means compact text. It starts from the variant's default; try the Variant toolbar. */
export const Default: Story = {};

/** Its place in a top bar, next to the light and dark toggle. */
export const NextToThemeToggle: Story = {
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <TextSizeToggle {...args} />
        <ThemeToggle />
      </div>
      <p className='max-w-md text-md text-secondary'>
        Body text follows the choice: 16px by default, 14px when compact. Headings and labels move
        down the same scale.
      </p>
    </div>
  ),
};
