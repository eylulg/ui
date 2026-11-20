import '@fontsource-variable/inter';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/manager-api';
import { darkTheme, lightTheme } from './theme';

addons.setConfig({ theme: lightTheme });

// The manager (sidebar, toolbar, addon panels) follows the toolbar's theme global.
addons.register('theme-follow', (api) => {
  const follow = ({ globals }: { globals: { theme?: string } }) =>
    api.setOptions({ theme: globals.theme === 'dark' ? darkTheme : lightTheme });
  api.on(SET_GLOBALS, follow);
  api.on(GLOBALS_UPDATED, follow);
});
