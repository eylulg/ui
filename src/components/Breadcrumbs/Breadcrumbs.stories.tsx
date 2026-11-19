import type { Meta, StoryObj } from '@storybook/react-vite';
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeLevels: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="#">Projects</BreadcrumbItem>
      <BreadcrumbItem href="#">Workspace</BreadcrumbItem>
      <BreadcrumbItem>Settings</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const TwoLevels: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="#">Watchlist</BreadcrumbItem>
      <BreadcrumbItem>Seen this year</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const LongTrailWraps: Story = {
  render: () => (
    <div className="max-w-xs">
      <Breadcrumbs>
        <BreadcrumbItem href="#">Agent workflows</BreadcrumbItem>
        <BreadcrumbItem href="#">Production cluster</BreadcrumbItem>
        <BreadcrumbItem href="#">Scheduled runs</BreadcrumbItem>
        <BreadcrumbItem>Nightly report</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  ),
};
