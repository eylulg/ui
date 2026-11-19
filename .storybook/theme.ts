import { create } from 'storybook/theming';

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

// The brush logo from BrandLogo, then the package name, as one image.
function brandImage(mode: 'light' | 'dark') {
  const { text } = frame[mode];
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 36" width="170" height="36">' +
    '<g transform="scale(0.18)"><g transform="translate(14 8) scale(0.9)">' +
    `<g fill="${green[mode]}">` +
    '<g transform="translate(128 46) skewX(-32) translate(-128 -46)">' +
    '<path d="M128 46 C110 40 88 46 86 62 C84 76 96 84 106 88 C94 82 88 74 90 63 C93 50 110 46 128 50 Z"/>' +
    '<path d="M106 88 C80 96 70 124 80 150 C90 172 116 184 146 178 C116 182 92 170 86 150 C78 126 88 102 106 88 Z"/>' +
    '</g>' +
    '<path d="M146 80 C134 66 108 72 108 96 C108 118 128 128 146 120 C130 126 114 116 113 96 C112 76 132 70 146 80 Z"/>' +
    '<path d="M146 120 C149 112 148 106 146 104 L132 104 C138 105 142 106 144 108 C145 112 146 116 146 120 Z"/>' +
    '</g>' +
    `<g fill="${text}">` +
    '<path d="M128 48 C124 34 126 22 134 12 C131 24 131 36 132 47 Z"/>' +
    '<path d="M134 12 C138 24 142 34 147 42 C141 36 137 26 134 12 Z"/>' +
    '<path d="M145 40 C160 58 176 84 188 112 C174 86 158 62 145 46 Z"/>' +
    '<path d="M188 112 C195 126 184 134 170 132 C182 129 190 123 188 112 Z"/>' +
    '<path d="M170 132 C163 134 156 133 152 129 C158 131 164 132 170 132 Z"/>' +
    '</g></g></g>' +
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
