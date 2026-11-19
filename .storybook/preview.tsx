import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect, useState, type ReactNode } from 'react';
import { addons } from 'storybook/preview-api';
import { variantNames, variants } from '../src/styles/themes/variants';
import { darkTheme, lightTheme } from './theme';
import './preview.css';

type Theme = 'light' | 'dark';
type Variant = 'base' | (typeof variantNames)[number];
/** `variant` keeps the variant's own default text size. */
type TextSize = 'variant' | 'compact' | 'default';

type Globals = { theme?: Theme; variant?: Variant; textSize?: TextSize };

function applyGlobals({ theme = 'light', variant = 'base', textSize = 'variant' }: Globals) {
  const root = document.documentElement;
  root.classList.toggle('dark-mode', theme === 'dark');
  if (variant === 'base') delete root.dataset.uiVariant;
  else root.dataset.uiVariant = variant;
  if (textSize === 'variant') delete root.dataset.uiText;
  else root.dataset.uiText = textSize;
}

function ThemeRoot({ globals, children }: { globals: Globals; children: ReactNode }) {
  const { theme, variant, textSize } = globals;
  useEffect(() => {
    applyGlobals({ theme, variant, textSize });
  }, [theme, variant, textSize]);
  return <div className='min-h-full bg-secondary text-primary'>{children}</div>;
}

function readGlobals(): Globals {
  const preview = (
    window as unknown as {
      __STORYBOOK_PREVIEW__?: { storyStoreValue?: { userGlobals?: { get(): Globals } } };
    }
  ).__STORYBOOK_PREVIEW__;
  return preview?.storyStoreValue?.userGlobals?.get() ?? {};
}

// Follows the toolbar from the docs container: it picks the Storybook docs
// theme, and for MDX pages without stories (the decorator never runs there) it
// also applies the theme and variant to the document.
function ThemedDocsContainer(props: DocsContainerProps) {
  const { context } = props;
  const [theme, setTheme] = useState<Theme>(() => readGlobals().theme ?? 'light');
  useEffect(() => {
    const hasStories = context.componentStories().length > 0;
    const update = (globals: Globals) => {
      setTheme(globals.theme ?? 'light');
      if (!hasStories) applyGlobals(globals);
    };
    update(readGlobals());
    const channel = addons.getChannel();
    const onChange = ({ globals }: { globals: Globals }) => update(globals);
    channel.on('globalsUpdated', onChange);
    return () => channel.off('globalsUpdated', onChange);
  }, [context]);
  return <DocsContainer {...props} theme={theme === 'dark' ? darkTheme : lightTheme} />;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeRoot
    globals={{
      theme: (context.parameters.forceTheme ?? context.globals.theme ?? 'light') as Theme,
      variant: (context.parameters.forceVariant ?? context.globals.variant ?? 'base') as Variant,
      textSize: (context.globals.textSize ?? 'variant') as TextSize,
    }}
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
          { value: 'base', title: 'Base theme (Clay)' },
          ...variantNames.map((name) => ({
            value: name,
            title: `${variants[name].project} (${variants[name].seed.name})`,
          })),
        ],
        dynamicTitle: true,
      },
    },
    textSize: {
      description: 'Text size',
      toolbar: {
        title: 'Text size',
        icon: 'paragraph',
        items: [
          { value: 'variant', title: "Variant's default" },
          { value: 'compact', title: 'Compact, body 14' },
          { value: 'default', title: 'Default, body 16' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    variant: 'base',
    textSize: 'variant',
  },
  parameters: {
    layout: 'centered',
    docs: { container: ThemedDocsContainer },
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
