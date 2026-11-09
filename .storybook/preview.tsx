import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect, type ReactNode } from 'react';
import './preview.css';

type Theme = 'light' | 'dark';

function ThemeRoot({ theme, children }: { theme: Theme; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return <div className="min-h-full bg-primary p-6 text-primary">{children}</div>;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeRoot theme={(context.globals.theme as Theme | undefined) ?? 'light'}>
    <Story />
  </ThemeRoot>
);

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i },
    },
    a11y: {
      // Fail the a11y panel (and test runs) on violations instead of only reporting them.
      test: 'error',
    },
    options: {
      storySort: {
        order: ['Introduction', 'Components'],
      },
    },
  },
};

export default preview;
