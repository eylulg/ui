import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ProjectSwitcher } from './ProjectSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { TopNav } from './TopNav';

const meta = {
  title: 'Chrome/TopNav',
  component: TopNav,
  parameters: { layout: 'fullscreen', noPadding: true },
  args: {
    productName: 'Review Companion',
    links: [
      { href: '#queue', label: 'Queue', isCurrent: true },
      { href: '#history', label: 'History' },
    ],
    actions: (
      <>
        <ProjectSwitcher currentId="review-companion" />
        <ThemeToggle />
      </>
    ),
  },
} satisfies Meta<typeof TopNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutLinks: Story = { args: { links: [] } };

export const MobileMenu: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    const drawer = await body.findByRole('dialog', { name: 'Review Companion' });
    await expect(within(drawer).getByRole('link', { name: 'History' })).toBeInTheDocument();
  },
};
