import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect, type ReactNode } from 'react';
import { variantCss, variantNames, variants } from '../src/styles/themes/variants';
import './preview.css';

type Theme = 'light' | 'dark';
type Variant = 'base' | (typeof variantNames)[number];

// Scoped copies of every variant, so the toolbar can switch them and the
// variant pages can render several side by side.
const style = document.createElement('style');
style.dataset.uiVariants = '';
style.textContent = variantNames
  .map((name) => variantCss(variants[name], `[data-ui-variant='${name}']`))
  .join('\n');
document.head.append(style);

const padded = 'min-h-full bg-primary p-6 text-primary';
const flush = 'min-h-full bg-primary text-primary';

function ThemeRoot({
  theme,
  variant,
  noPadding,
  children,
}: {
  theme: Theme;
  variant: Variant;
  noPadding: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark-mode', theme === 'dark');
    if (variant === 'base') delete root.dataset.uiVariant;
    else root.dataset.uiVariant = variant;
  }, [theme, variant]);
  return <div className={noPadding ? flush : padded}>{children}</div>;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeRoot
    theme={(context.parameters.forceTheme ?? context.globals.theme ?? 'light') as Theme}
    variant={(context.parameters.forceVariant ?? context.globals.variant ?? 'base') as Variant}
    noPadding={Boolean(context.parameters.noPadding)}
  >
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
    variant: {
      description: 'Project theme variant',
      toolbar: {
        title: 'Variant',
        icon: 'paintbrush',
        items: [
          { value: 'base', title: 'Base theme' },
          ...variantNames.map((name) => ({
            value: name,
            title: `${name} (${variants[name].project})`,
          })),
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    variant: 'base',
  },
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i },
    },
    a11y: {
      // Fail the a11y panel (and test runs) on violations instead of only reporting them.
      test: 'error',
      config: {
        // Experimental in axe and off by default; voice control users rely on it.
        rules: [{ id: 'label-content-name-mismatch', enabled: true }],
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Theme variants', 'Chrome', 'Components'],
      },
    },
  },
};

export default preview;
