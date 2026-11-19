import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreHorizontal } from 'lucide-react';
import { fn } from 'storybook/test';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  args: { children: null },
  decorators: [
    (Story) => (
      <div className='max-w-sm'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader title='Review Companion' description='A code review tool' />
      <CardBody>Summarises pull requests and keeps review threads moving.</CardBody>
    </Card>
  ),
};

/** `padding="none"` lets media run to the edge; the text parts add their own padding. */
export const MediaCard: Story = {
  render: () => (
    <Card padding='none' href='#film'>
      <div aria-hidden='true' className='aspect-video bg-brand-subtle' />
      <div className='flex flex-col gap-stack p-card'>
        <CardHeader title='Arrival' description='2016, science fiction' />
        <CardBody>Twelve alien ships appear around the world.</CardBody>
      </div>
    </Card>
  ),
};

export const WithActionsAndFooter: Story = {
  render: () => (
    <Card>
      <CardHeader
        title='Nightly report'
        description='Runs at 02:00'
        actions={
          <IconButton
            icon={MoreHorizontal}
            aria-label='Report options'
            variant='tertiary'
            size='sm'
          />
        }
      />
      <CardBody>
        <Badge color='success' dot>
          Passing
        </Badge>
      </CardBody>
      <CardFooter>
        <Button size='sm' variant='secondary'>
          Pause schedule
        </Button>
        <Button size='sm'>Run now</Button>
      </CardFooter>
    </Card>
  ),
};

export const InteractiveLink: Story = {
  render: () => (
    <Card href='#'>
      <CardHeader
        title='Watchlist'
        description='Films to see this year'
        actions={
          <IconButton
            icon={MoreHorizontal}
            aria-label='Watchlist options'
            variant='tertiary'
            size='sm'
          />
        }
      />
      <CardBody>The whole card opens the project. The options button stays separate.</CardBody>
    </Card>
  ),
};

export const InteractiveButton: Story = {
  render: () => (
    <Card onPress={fn()}>
      <CardHeader title='Start a new puzzle' description='Medium difficulty' headingLevel={2} />
    </Card>
  ),
};
