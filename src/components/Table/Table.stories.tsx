import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { Selection, SortDescriptor } from 'react-aria-components';
import { expect, userEvent, within } from 'storybook/test';
import { Badge } from '../Badge/Badge';
import { Cell, Column, Row, Table, TableBody, TableHeader } from './Table';

interface Deploy {
  id: string;
  service: string;
  status: 'healthy' | 'degraded' | 'failed';
  latency: number;
  region: string;
}

const deploys: Deploy[] = [
  { id: '1', service: 'api', status: 'healthy', latency: 42, region: 'Amsterdam' },
  { id: '2', service: 'worker', status: 'degraded', latency: 180, region: 'Oslo' },
  { id: '3', service: 'web', status: 'healthy', latency: 35, region: 'Istanbul' },
  { id: '4', service: 'scheduler', status: 'failed', latency: 0, region: 'Amsterdam' },
  { id: '5', service: 'search', status: 'healthy', latency: 61, region: 'Oslo' },
  { id: '6', service: 'billing', status: 'healthy', latency: 77, region: 'Istanbul' },
  { id: '7', service: 'mailer', status: 'degraded', latency: 140, region: 'Amsterdam' },
  { id: '8', service: 'auth', status: 'healthy', latency: 29, region: 'Oslo' },
];

const statusColor = { healthy: 'success', degraded: 'warning', failed: 'error' } as const;

function compare(column: keyof Deploy, left: Deploy, right: Deploy) {
  return String(left[column]).localeCompare(String(right[column]), undefined, { numeric: true });
}

function DeployTable({
  rows = deploys,
  selectionMode = 'none',
  maxHeight,
}: {
  rows?: Deploy[];
  selectionMode?: 'none' | 'single' | 'multiple';
  maxHeight?: string;
}) {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'service', direction: 'ascending' });
  const [selected, setSelected] = useState<Selection>(new Set());
  const column = sort.column as keyof Deploy;
  const sorted = [...rows].sort((left, right) =>
    sort.direction === 'ascending' ? compare(column, left, right) : compare(column, right, left),
  );

  return (
    <Table
      aria-label="Deployments"
      sortDescriptor={sort}
      onSortChange={setSort}
      selectionMode={selectionMode}
      selectedKeys={selected}
      onSelectionChange={setSelected}
      maxHeight={maxHeight}
    >
      <TableHeader>
        <Column id="service" isRowHeader allowsSorting>
          Service
        </Column>
        <Column id="status" allowsSorting>
          Status
        </Column>
        <Column id="region">Region</Column>
        <Column id="latency" allowsSorting align="end">
          Latency (ms)
        </Column>
      </TableHeader>
      <TableBody items={sorted} emptyState="No deployments yet.">
        {(deploy) => (
          <Row id={deploy.id}>
            <Cell>{deploy.service}</Cell>
            <Cell>
              <Badge color={statusColor[deploy.status]} size="sm" dot>
                {deploy.status}
              </Badge>
            </Cell>
            <Cell>{deploy.region}</Cell>
            <Cell align="end">{deploy.latency}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded' },
  args: { 'aria-label': 'Deployments' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sortable: Story = { render: () => <DeployTable /> };
export const MultipleSelection: Story = { render: () => <DeployTable selectionMode="multiple" /> };
export const SingleSelection: Story = { render: () => <DeployTable selectionMode="single" /> };
export const StickyHeader: Story = { render: () => <DeployTable maxHeight="14rem" /> };
export const Empty: Story = { render: () => <DeployTable rows={[]} /> };

export const SortByLatency: Story = {
  render: () => <DeployTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('columnheader', { name: /latency/i }));
    const first = canvas.getAllByRole('rowheader')[0];
    await expect(first).toHaveTextContent('scheduler');
  },
};
