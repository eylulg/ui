import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../components/Button/Button';
import { ThemeToggle } from './ThemeToggle';
import { TopNav } from './TopNav';

// Element props would dump a React element tree into the controls.
const noControl = { control: false } as const;

const meta = {
  title: 'Chrome/TopNav',
  component: TopNav,
  argTypes: {
    logo: noControl,
    center: noControl,
    actions: noControl,
    compactActions: noControl,
    mobileMenu: noControl,
  },
  parameters: { layout: 'fullscreen' },
  args: {
    productName: 'Review Companion',
    links: [
      { href: '#queue', label: 'Queue', isCurrent: true },
      { href: '#history', label: 'History' },
    ],
    actions: <ThemeToggle />,
  },
} satisfies Meta<typeof TopNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutLinks: Story = { args: { links: [] } };

/** On the portfolio itself both links go to the same place, so the brand is one link. */
export const OnThePortfolio: Story = { args: { homeHref: '/', portfolioHref: '/' } };

export const CentreSlotAndCompactTheme: Story = {
  args: {
    center: (
      <Button variant='secondary' iconLeading={Search} size='sm'>
        Search
      </Button>
    ),
    actions: null,
    compactActions: <ThemeToggle compact />,
  },
};

export const Translated: Story = {
  args: {
    productName: 'Überprüfungsbegleiter',
    labels: {
      portfolio: 'Portfolio von Eylül Güneş',
      openMenu: 'Menü öffnen',
      closeMenu: 'Menü schließen',
    },
    actions: (
      <ThemeToggle
        labels={{ ariaLabel: 'Farbschema', light: 'Hell', dark: 'Dunkel', system: 'System' }}
      />
    ),
  },
};

export const PhoneWithThemeInBar: Story = {
  args: { compactActions: <ThemeToggle compact /> },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};

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
