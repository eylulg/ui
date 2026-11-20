import { create } from 'storybook/theming';
import { brandLogoPath } from '../src/chrome/brandLogoPath';

// The library's own colours, from src/styles/theme.css: the warm frame, the
// green brand and the logo's colours, which stay the same in every project.
const frame = {
  light: {
    page: '#f7f1e8',
    surface: '#fffcf8',
    border: '#e8dfd0',
    text: '#2c2521',
    muted: '#6c625a',
  },
  dark: {
    page: '#211d1a',
    surface: '#2a2521',
    border: '#3f3832',
    text: '#f3ede5',
    muted: '#bdb2a5',
  },
};
const green = { light: '#446c2b', dark: '#97bf82' };
const control = { light: '#efe7da', dark: '#3f3832' };

const fontBase = '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif';
const fontCode = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, Menlo, monospace';

// The logo from BrandLogo, then the package name, as one image.
function brandImage(mode: 'light' | 'dark') {
  const { text } = frame[mode];
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 36" width="170" height="36">' +
    `<path transform="translate(2 2) scale(0.32)" fill="${green[mode]}" stroke="${green[mode]}" stroke-width="2" stroke-linejoin="round" fill-rule="evenodd" d="${brandLogoPath}"/>` +
    `<text x="44" y="24" font-family="Manrope, Inter, system-ui, sans-serif" font-size="17" font-weight="700" fill="${text}">@eylulg/ui</text>` +
    '</svg>';
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const shared = {
  brandTitle: '@eylulg/ui',
  brandUrl: 'https://github.com/eylulg/ui',
  brandTarget: '_blank',
  fontBase,
  fontCode,
  appBorderRadius: 14,
  inputBorderRadius: 10,
};

function theme(mode: 'light' | 'dark') {
  const { page, surface, border, text, muted } = frame[mode];
  return create({
    ...shared,
    base: mode,
    brandImage: brandImage(mode),
    colorPrimary: green[mode],
    colorSecondary: green[mode],
    appBg: page,
    appContentBg: surface,
    appPreviewBg: page,
    appBorderColor: border,
    textColor: text,
    textInverseColor: page,
    textMutedColor: muted,
    barBg: surface,
    barTextColor: muted,
    barHoverColor: green[mode],
    barSelectedColor: green[mode],
    buttonBg: control[mode],
    buttonBorder: border,
    booleanBg: control[mode],
    booleanSelectedBg: surface,
    inputBg: surface,
    inputBorder: border,
    inputTextColor: text,
  });
}

export const lightTheme = theme('light');
export const darkTheme = theme('dark');
