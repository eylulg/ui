import { create } from 'storybook/theming';

// The library's own colours, from src/styles/theme.css: the gray scale, the
// Aegean brand blue and Inter.
const neutral = {
  25: '#fcfcfd',
  50: '#f8f9fb',
  100: '#f1f3f6',
  200: '#e3e7ed',
  300: '#cdd3dc',
  400: '#98a1b0',
  500: '#697386',
  600: '#4d5668',
  700: '#384152',
  800: '#232a37',
  900: '#151a24',
  950: '#0b0e14',
};
const brand = { 400: '#6690f8', 500: '#3f6cf0', 600: '#2a4fd6', 700: '#223fb0' };

const fontBase = '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif';
const fontCode = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

// The "eg" mark from BrandMark, then the package name, as one image.
function brandImage(text: string) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 32" width="150" height="32">' +
    `<rect width="32" height="32" rx="8" fill="${brand[600]}"/>` +
    '<path fill="#fff" d="M14.6 19.4h-6.5c.2 1.6 1.4 2.5 3 2.5 1.1 0 2-.4 2.6-1.2l.6.6c-.8 1-2 1.6-3.3 1.6-2.4 0-4.2-1.7-4.2-4.3s1.7-4.3 4-4.3c2.3 0 3.8 1.7 3.8 4.2v.9Zm-6.5-1h5.2c-.1-1.4-1.1-2.3-2.5-2.3s-2.5.9-2.7 2.3Z"/>' +
    '<path fill="#fff" d="M24.9 14.5v7.8c0 2.6-1.6 4-4 4-1.4 0-2.6-.4-3.5-1.2l.6-.8c.8.7 1.8 1 2.9 1 1.8 0 2.8-.9 2.8-2.9v-1.1c-.6.9-1.7 1.4-2.9 1.4-2.2 0-3.9-1.6-3.9-3.9s1.7-3.9 3.9-3.9c1.2 0 2.3.5 2.9 1.5v-1.4h1.2Zm-1.2 3.8c0-1.7-1.2-2.9-2.8-2.9s-2.8 1.2-2.8 2.9 1.2 2.9 2.8 2.9 2.8-1.2 2.8-2.9Z"/>' +
    `<text x="42" y="22" font-family="Inter, system-ui, sans-serif" font-size="17" font-weight="600" fill="${text}">@eylulg/ui</text>` +
    '</svg>';
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const shared = {
  brandTitle: '@eylulg/ui',
  brandUrl: 'https://github.com/eylulg/ui',
  brandTarget: '_blank',
  fontBase,
  fontCode,
  appBorderRadius: 8,
  inputBorderRadius: 8,
};

export const lightTheme = create({
  ...shared,
  base: 'light',
  brandImage: brandImage(neutral[900]),
  colorPrimary: brand[600],
  colorSecondary: brand[600],
  appBg: neutral[50],
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: neutral[200],
  textColor: neutral[900],
  textInverseColor: '#ffffff',
  textMutedColor: neutral[600],
  barBg: '#ffffff',
  barTextColor: neutral[600],
  barHoverColor: brand[600],
  barSelectedColor: brand[600],
  buttonBg: neutral[100],
  buttonBorder: neutral[300],
  booleanBg: neutral[100],
  booleanSelectedBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: neutral[300],
  inputTextColor: neutral[900],
});

export const darkTheme = create({
  ...shared,
  base: 'dark',
  brandImage: brandImage(neutral[50]),
  colorPrimary: brand[500],
  colorSecondary: brand[400],
  appBg: neutral[900],
  appContentBg: neutral[950],
  appPreviewBg: neutral[950],
  appBorderColor: neutral[800],
  textColor: neutral[50],
  textInverseColor: neutral[900],
  textMutedColor: neutral[300],
  barBg: neutral[900],
  barTextColor: neutral[300],
  barHoverColor: brand[400],
  barSelectedColor: brand[400],
  buttonBg: neutral[800],
  buttonBorder: neutral[700],
  booleanBg: neutral[800],
  booleanSelectedBg: neutral[900],
  inputBg: neutral[900],
  inputBorder: neutral[700],
  inputTextColor: neutral[50],
});
