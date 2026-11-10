import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { Badge } from '../Badge/Badge';
import { BreadcrumbItem, Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { Button } from '../Button/Button';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  args: {
    title: 'Issues',
    description: 'Everything in progress across your projects.',
  },
  argTypes: {
    actions: { control: false },
    breadcrumbs: { control: false },
    meta: { control: false },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs: (
      <Breadcrumbs>
        <BreadcrumbItem href="#">Workspace</BreadcrumbItem>
        <BreadcrumbItem>Issues</BreadcrumbItem>
      </Breadcrumbs>
    ),
  },
};

export const WithActionsAndMeta: Story = {
  args: {
    actions: (
      <>
        <Button variant="secondary">Export issues</Button>
        <Button iconLeading={Plus}>New issue</Button>
      </>
    ),
    meta: (
      <>
        <Badge color="brand">12 open</Badge>
        <span>Updated 5 minutes ago</span>
      </>
    ),
  },
};

export const WithEyebrow: Story = {
  args: {
    eyebrow: 'Case study',
    title: 'Review Companion',
    description: 'Triaging review findings.',
  },
};

export const Phone: Story = {
  ...WithActionsAndMeta,
  decorators: [
    (Story) => (
      <div className="max-w-[375px] px-4">
        <Story />
      </div>
    ),
  ],
};
