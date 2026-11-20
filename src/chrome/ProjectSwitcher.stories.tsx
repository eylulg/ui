import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ProjectSwitcher } from './ProjectSwitcher';

const meta = {
  title: 'Chrome/ProjectSwitcher',
  component: ProjectSwitcher,
  args: { currentId: 'portfolio' },
  parameters: { docs: { story: { height: '520px' } } },
} satisfies Meta<typeof ProjectSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Projects' }));
    await expect(await body.findByRole('menuitem', { name: /^Sudoku/ })).toBeInTheDocument();
  },
};

export const Translated: Story = {
  args: {
    labels: {
      label: 'Projekte',
      heading: 'Eylüls Projekte',
      youAreHere: 'Sie sind hier',
      sourceCode: '(Quellcode)',
    },
  },
};
