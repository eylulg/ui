import '@fontsource-variable/inter';
import { addons } from 'storybook/manager-api';
import { darkTheme, lightTheme } from './theme';

// The manager cannot follow the toolbar's theme global live, so it follows the
// visitor's system colour scheme once, at load.
addons.setConfig({
  theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme,
});
