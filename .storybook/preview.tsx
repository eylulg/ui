import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect, useState, type ReactNode } from 'react';
import { addons } from 'storybook/preview-api';
import { variantCss, variantNames, variants } from '../src/styles/themes/variants';
import { darkTheme, lightTheme } from './theme';
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

function ThemeRoot({
  theme,
  variant,
  children,
}: {
  theme: Theme;
  variant: Variant;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark-mode', theme === 'dark');
    if (variant === 'base') delete root.dataset.uiVariant;
    else root.dataset.uiVariant = variant;
  }, [theme, variant]);
  return <div className="min-h-full bg-primary text-primary">{children}</div>;
}

type Globals = { theme?: Theme; variant?: Variant };

function readGlobals(): Globals {
  const preview = (
    window as unknown as {
      __STORYBOOK_PREVIEW__?: { storyStoreValue?: { userGlobals?: { get(): Globals } } };
    }
  ).__STORYBOOK_PREVIEW__;
  return preview?.storyStoreValue?.userGlobals?.get() ?? {};
}

function applyGlobals({ theme = 'light', variant = 'base' }: Globals) {
  const root = document.documentElement;
  root.classList.toggle('dark-mode', theme === 'dark');
  if (variant === 'base') delete root.dataset.uiVariant;
  else root.dataset.uiVariant = variant;
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
    theme={(context.parameters.forceTheme ?? context.globals.theme ?? 'light') as Theme}
    variant={(context.parameters.forceVariant ?? context.globals.variant ?? 'base') as Variant}
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
