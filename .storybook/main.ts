import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // MDX 3 needs remark-gfm for tables.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      // The library build in vite.config.ts uses lib mode, which Storybook must not inherit.
      builder: { viteConfigPath: '.storybook/vite.config.ts' },
    },
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
