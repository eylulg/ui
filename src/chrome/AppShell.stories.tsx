import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDot, Inbox, Layers, Settings } from 'lucide-react';
import { Button } from '../components/Button/Button';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { AppShell } from './AppShell';
import { ProjectSwitcher } from './ProjectSwitcher';
import { SidebarNav, type SidebarNavSection } from './SidebarNav';
import { SiteFooter } from './SiteFooter';
import { ThemeToggle } from './ThemeToggle';
import { TopNav } from './TopNav';

const sections: SidebarNavSection[] = [
  {
    id: 'main',
    items: [
      { href: '#inbox', label: 'Inbox', icon: <Inbox />, badge: '4', isCurrent: true },
      { href: '#issues', label: 'My issues', icon: <CircleDot /> },
    ],
  },
  {
    id: 'workspace',
    title: 'Workspace',
    collapsible: true,
    items: [
      { href: '#projects', label: 'Projects', icon: <Layers /> },
      { href: '#settings', label: 'Settings', icon: <Settings /> },
    ],
  },
];

const actions = (
  <>
    <ProjectSwitcher currentId='workspace' />
    <ThemeToggle />
  </>
);

// Element props would dump a React element tree into the controls.
const noControl = { control: false } as const;

const meta = {
  title: 'Chrome/AppShell',
  component: AppShell,
  argTypes: { header: noControl, sidebar: noControl, footer: noControl, children: noControl },
  parameters: { layout: 'fullscreen' },
  args: { children: null },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Website: Story = {
  args: {
    header: (
      <TopNav
        productName='Portfolio'
        links={[
          { href: '#projects', label: 'Projects', isCurrent: true },
          { href: '#experience', label: 'Experience' },
          { href: '#contact', label: 'Contact' },
        ]}
        actions={actions}
      />
    ),
    footer: <SiteFooter currentId='portfolio' />,
    children: (
      <PageHeader
        title='Projects'
        description='Things I designed and built, with the decisions behind them.'
      />
    ),
    maxWidth: '6xl',
    contentClassName: 'flex flex-col gap-6',
  },
};

export const AppWithSidebar: Story = {
  args: {
    header: (
      <TopNav
        productName='Workspace'
        actions={actions}
        mobileMenu={<SidebarNav sections={sections} aria-label='Workspace' />}
      />
    ),
    sidebar: <SidebarNav sections={sections} />,
    footer: <SiteFooter currentId='workspace' />,
    children: (
      <PageHeader
        title='Inbox'
        description='4 issues need you.'
        actions={<Button>New issue</Button>}
      />
    ),
  },
};

export const Phone: Story = {
  ...AppWithSidebar,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
