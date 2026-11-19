import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';

const portrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%236366f1'/%3E%3Ccircle cx='32' cy='26' r='12' fill='%23e0e7ff'/%3E%3Cpath d='M10 64c2-14 12-20 22-20s20 6 22 20z' fill='%23e0e7ff'/%3E%3C/svg%3E";

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Eylül Güneş', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    status: { control: 'inline-radio', options: [undefined, 'online', 'away', 'busy', 'offline'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = { args: { src: portrait } };
export const Initials: Story = {};
export const BrokenImage: Story = { args: { src: 'https://example.invalid/missing.png' } };
export const WithStatus: Story = { args: { src: portrait, status: 'online' } };

export const Sizes: Story = {
  render: (args) => (
    <div className='flex items-end gap-3'>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} status='online' />
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup aria-label='Reviewers' max={3}>
      <Avatar name='Eylül Güneş' src={portrait} />
      <Avatar name='Ada Lovelace' />
      <Avatar name='Grace Hopper' />
      <Avatar name='Alan Turing' />
      <Avatar name='Katherine Johnson' />
    </AvatarGroup>
  ),
};
