import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteFooter } from './SiteFooter';

// Element props would dump a React element tree into the controls.
const noControl = { control: false } as const;

const meta = {
  title: 'Chrome/SiteFooter',
  component: SiteFooter,
  argTypes: { children: noControl },
  parameters: { layout: 'fullscreen', noPadding: true },
  args: { currentId: 'portfolio' },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAttributions: Story = {
  args: {
    children: (
      <>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        <p>
          Streaming availability by <a href="https://www.justwatch.com">JustWatch</a>.
        </p>
      </>
    ),
  },
};

export const Translated: Story = {
  args: {
    labels: {
      intro: 'Teil der Projekte von Eylül Güneş',
      projectsNav: 'Projekte',
      source: '(Quellcode)',
      profilesNav: 'Profile',
      builtWith: 'Gebaut mit @eylulg/ui',
    },
  },
};
