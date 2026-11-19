import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tag, TagGroup } from './Tag';

const meta = {
  title: 'Components/Tag',
  component: TagGroup,
  args: { label: 'Skills' },
} satisfies Meta<typeof TagGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  render: (args) => (
    <TagGroup {...args}>
      <Tag>React</Tag>
      <Tag>TypeScript</Tag>
      <Tag>Design systems</Tag>
    </TagGroup>
  ),
};

function RemovableExample(props: { label?: string }) {
  const [items, setItems] = useState([
    { id: 'react', name: 'React' },
    { id: 'aria', name: 'React Aria' },
    { id: 'tailwind', name: 'Tailwind CSS' },
    { id: 'storybook', name: 'Storybook' },
  ]);
  return (
    <TagGroup
      {...props}
      hint='Press Backspace or Delete on a focused tag to remove it.'
      items={items}
      onRemove={(keys) => setItems((current) => current.filter((item) => !keys.has(item.id)))}
      renderEmptyState={() => <span className='text-sm text-tertiary'>No skills left.</span>}
    >
      {(item) => <Tag id={item.id}>{item.name}</Tag>}
    </TagGroup>
  );
}

export const Removable: Story = {
  render: (args) => (
    <RemovableExample label={typeof args.label === 'string' ? args.label : undefined} />
  ),
};

export const Selectable: Story = {
  args: { label: 'Filter by status', selectionMode: 'multiple', defaultSelectedKeys: ['open'] },
  render: (args) => (
    <TagGroup {...args}>
      <Tag id='open'>Open</Tag>
      <Tag id='review'>In review</Tag>
      <Tag id='closed'>Closed</Tag>
    </TagGroup>
  ),
};

export const Disabled: Story = {
  args: { disabledKeys: ['b'] },
  render: (args) => (
    <TagGroup {...args}>
      <Tag id='a'>Enabled</Tag>
      <Tag id='b'>Disabled</Tag>
    </TagGroup>
  ),
};
