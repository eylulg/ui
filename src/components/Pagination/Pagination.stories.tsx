import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { totalPages: 20, defaultPage: 10, onPageChange: fn() },
  argTypes: { siblingCount: { control: { type: 'number', min: 0, max: 3 } } },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FewPages: Story = { args: { totalPages: 5, defaultPage: 2 } };
export const FirstPage: Story = { args: { defaultPage: 1 } };
export const LastPage: Story = { args: { defaultPage: 20 } };
export const WiderSiblings: Story = { args: { siblingCount: 2 } };
export const Links: Story = { args: { getPageHref: (page: number) => `?page=${page}` } };

export const KeyboardNext: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Next' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onPageChange).toHaveBeenCalledWith(11);
    await expect(canvas.getByRole('button', { name: 'Page 11' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};
