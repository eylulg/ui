import { FolderOpen, LayoutGrid, List, Plus, Settings, Star } from 'lucide-react';
import { BrandMark } from '../chrome/BrandMark';
import { Avatar, AvatarGroup } from '../components/Avatar/Avatar';
import { Badge } from '../components/Badge/Badge';
import { BreadcrumbItem, Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import { Button } from '../components/Button/Button';
import { Card, CardBody, CardFooter, CardHeader } from '../components/Card/Card';
import { Checkbox } from '../components/Checkbox/Checkbox';
import { CodeBlock } from '../components/CodeBlock/CodeBlock';
import { Combobox, ComboboxItem } from '../components/Combobox/Combobox';
import { DatePicker } from '../components/DatePicker/DatePicker';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { FileDropZone } from '../components/FileDropZone/FileDropZone';
import { IconButton } from '../components/IconButton/IconButton';
import { Input } from '../components/Input/Input';
import { Kbd } from '../components/Kbd/Kbd';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { Pagination } from '../components/Pagination/Pagination';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';
import { Radio, RadioGroup } from '../components/RadioGroup/RadioGroup';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '../components/SegmentedControl/SegmentedControl';
import { Select, SelectItem } from '../components/Select/Select';
import { Skeleton } from '../components/Skeleton/Skeleton';
import { Spinner } from '../components/Spinner/Spinner';
import { Sparkline, Stat } from '../components/Stat/Stat';
import { Switch } from '../components/Switch/Switch';
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../components/Table/Table';
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs/Tabs';
import { Tag, TagGroup } from '../components/Tag/Tag';
import { Textarea } from '../components/Textarea/Textarea';

const section = 'flex flex-col gap-3';
const sectionTitle = 'text-xs font-semibold text-tertiary';
const row = 'flex flex-wrap items-center gap-3';
const grid = 'grid gap-4 sm:grid-cols-2';

/**
 * Every component in its resting state, for the theme variant pages. `label`
 * keeps landmark names unique when two copies render on one page.
 */
export function KitchenSink({ label }: { label: string }) {
  return (
    <div className='flex flex-col gap-8'>
      <PageHeader
        headingLevel={2}
        title='Sprint board'
        description='Everything due this week.'
        breadcrumbs={
          <Breadcrumbs aria-label={`Breadcrumbs, ${label}`}>
            <BreadcrumbItem href='#home'>Home</BreadcrumbItem>
            <BreadcrumbItem href='#projects'>Projects</BreadcrumbItem>
            <BreadcrumbItem>Sprint board</BreadcrumbItem>
          </Breadcrumbs>
        }
        actions={<Button iconLeading={Plus}>New issue</Button>}
      />

      <div className={section}>
        <h3 className={sectionTitle}>Actions</h3>
        <div className={row}>
          <Button>Primary</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='tertiary'>Tertiary</Button>
          <Button variant='destructive'>Delete</Button>
          <Button variant='destructive-outline'>Archive</Button>
          <Button href='#docs' variant='secondary'>
            Documentation
          </Button>
          <SegmentedControl aria-label={`View, ${label}`} defaultSelectedKey='list'>
            <SegmentedControlItem id='list' icon={List}>
              List
            </SegmentedControlItem>
            <SegmentedControlItem id='board' icon={LayoutGrid}>
              Board
            </SegmentedControlItem>
          </SegmentedControl>
          <IconButton icon={Settings} aria-label='Settings' />
          <Kbd keys={['⌘', 'K']} />
          <Spinner label='Loading' />
          <BrandMark />
        </div>
        <div className={row}>
          <Badge color='brand' dot>
            In review
          </Badge>
          <Badge color='success'>Done</Badge>
          <Badge color='warning'>Blocked</Badge>
          <Badge color='error'>Failed</Badge>
          <Badge icon={Star}>Starred</Badge>
          <Badge color='blue'>Backlog</Badge>
          <Badge color='purple'>Review</Badge>
          <Badge color='pink'>Design</Badge>
          <Badge color='orange'>Waiting</Badge>
          <Badge color='indigo'>Planned</Badge>
          <AvatarGroup aria-label='Assignees' max={3}>
            <Avatar name='Eylül Güneş' status='online' />
            <Avatar name='Ada Lovelace' />
            <Avatar name='Grace Hopper' />
            <Avatar name='Alan Turing' />
          </AvatarGroup>
        </div>
      </div>

      <div className={grid}>
        <Input label='Title' placeholder='Fix the flaky test' hint='Short and specific.' />
        <Select label='Status' defaultSelectedKey='review'>
          <SelectItem id='todo' description='Not started'>
            To do
          </SelectItem>
          <SelectItem id='review' description='Waiting for feedback'>
            In review
          </SelectItem>
        </Select>
        <Combobox label='Assignee' placeholder='Search people'>
          <ComboboxItem id='eylul'>Eylül Güneş</ComboboxItem>
          <ComboboxItem id='ada'>Ada Lovelace</ComboboxItem>
        </Combobox>
        <DatePicker label='Due date' />
        <Textarea label='Notes' errorMessage='Add a note before you submit.' />
        <Textarea label='Query' font='data' defaultValue='select * from issues' />
        <FileDropZone
          label='Drop a JSON file here'
          hint='JSON, up to 2 MB'
          acceptedFileTypes={['.json']}
          onSelect={() => {}}
        />
        <CodeBlock label={`Install command, ${label}`} copyable>
          npm install @eylulg/ui
        </CodeBlock>
        <div className='flex flex-col gap-3'>
          <Checkbox defaultSelected>Notify watchers</Checkbox>
          <Switch defaultSelected hint='Picks the least busy teammate'>
            Auto assign
          </Switch>
          <RadioGroup label='Priority' defaultValue='high' orientation='horizontal'>
            <Radio value='low'>Low</Radio>
            <Radio value='high'>High</Radio>
          </RadioGroup>
        </div>
      </div>

      <TagGroup label='Labels'>
        <Tag>Frontend</Tag>
        <Tag>Accessibility</Tag>
      </TagGroup>

      <Tabs>
        <TabList aria-label={`Views, ${label}`}>
          <Tab id='list'>List</Tab>
          <Tab id='board'>Board</Tab>
        </TabList>
        <TabPanel id='list'>
          <Table aria-label={`Issues, ${label}`} selectionMode='multiple'>
            <TableHeader>
              <Column isRowHeader>Issue</Column>
              <Column>Status</Column>
              <Column align='end'>Estimate</Column>
            </TableHeader>
            <TableBody>
              <Row id='1'>
                <Cell>Theme variants</Cell>
                <Cell>In review</Cell>
                <Cell align='end'>5</Cell>
              </Row>
              <Row id='2'>
                <Cell>Command palette</Cell>
                <Cell>To do</Cell>
                <Cell align='end'>3</Cell>
              </Row>
            </TableBody>
          </Table>
        </TabPanel>
        <TabPanel id='board'>
          <Skeleton lines={3} />
        </TabPanel>
      </Tabs>

      <div className={grid}>
        <Card>
          <CardHeader title='Velocity' description='Points closed per sprint' />
          <CardBody>
            <Stat
              label='This sprint'
              value='34'
              detail='of 40 planned'
              delta={{ value: '12%', trend: 'up' }}
              sparkline={<Sparkline values={[18, 22, 21, 27, 30, 34]} />}
            />
            <Stat size='sm' label='Carry over' value='3' />
          </CardBody>
          <CardFooter>
            <ProgressBar label='Sprint progress' value={68} />
          </CardFooter>
        </Card>
        <Card href='#review'>
          <CardHeader title='Review queue' description='Three pull requests wait for you' />
        </Card>
      </div>

      <EmptyState
        size='sm'
        headingLevel={3}
        icon={FolderOpen}
        title='No archived issues'
        description='Issues you archive show up here.'
      />

      <Pagination aria-label={`Pagination, ${label}`} totalPages={12} defaultPage={4} />
    </div>
  );
}
