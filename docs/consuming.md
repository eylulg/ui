# Using @eylulg/ui in an app

How the projects in this family use the library: one theme variant, the shared chrome (top nav
with the project switcher, footer, theme toggle) and components from per component entry points.

## Install

```bash
npm install @eylulg/ui react-aria-components lucide-react
```

`react`, `react-dom` and `lucide-react` are peer dependencies. The fonts ship with the package
(see [Fonts](#fonts)). The library re-exports no icons: import them from `lucide-react` and pass
the component (`icon={Plus}`) or, in the chrome, an element (`icon: <Inbox />`).

### Linking a local checkout

To try a library change in an app, clone this repo next to the app, build it and install the
folder:

```bash
cd ../ui && npm install && npm run build
cd ../workspace && npm install ../ui     # writes "@eylulg/ui": "file:../ui"
```

`file:` installs a symlink, so the app sees the latest `dist/` after each `npm run build` in `ui`.
The symlink resolves to the real folder, so the library finds `ui/node_modules`, which has its own
React, React Aria Components and lucide. Two copies of React break hooks and React Aria's router
context. Either install a copy, or point the tools at the app's copy.

A copy:

```bash
npm install ../ui --install-links     # packs ui and installs it like a registry package
```

It is a snapshot, so run the command again after every library rebuild. A later `npm install` in
the app turns it back into a symlink, so run it last. A script keeps this simple:
`"relink": "npm install ../ui --install-links"`.

The app's copy, for Vite (and Vitest, which shares the config):

```ts
export default defineConfig({
  resolve: { dedupe: ['react', 'react-dom', 'react-aria-components', 'lucide-react'] },
});
```

and for Next.js with Turbopack, where the root must contain the linked folder:

```ts
import path from 'node:path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(import.meta.dirname, '..'),
    resolveAlias: {
      'react-aria-components': './node_modules/react-aria-components',
      'lucide-react': './node_modules/lucide-react',
    },
  },
};
```

If TypeScript reports that a `LucideIcon` is not assignable to `IconComponent`, two copies of
`@types/react` resolve. Point both at the app's:

```json
{ "compilerOptions": { "paths": { "react": ["./node_modules/@types/react"] } } }
```

### Icons in Next.js server components

lucide-react icons use React context, so a server component cannot render them. Re-export the ones
you use from a client file. A client reference can still be passed to a library component as a
prop:

```tsx
// app/icons.ts
'use client';
export { Plus, Search, Settings } from 'lucide-react';
```

```tsx
// app/page.tsx (a server component)
import { Button } from '@eylulg/ui/button';
import { Plus } from './icons';

export default function Page() {
  return <Button iconLeading={Plus}>New item</Button>;
}
```

## Styles

Pick one of three paths.

### A. The app runs Tailwind 4

Import the tokens inside your own Tailwind entry so they become utilities (`bg-brand-solid`,
`text-secondary`, `h-control-md`), then one variant. `@source` lets Tailwind scan the library's
compiled files for the classes its components use:

```css
/* src/index.css (Vite) or app/globals.css (Next.js) */
@import 'tailwindcss';
@import '@eylulg/ui/theme.css';
@import '@eylulg/ui/themes/workspace.css';
@source '../node_modules/@eylulg/ui/dist';
```

Adjust the `@source` path so it points from this file to `node_modules/@eylulg/ui/dist`.

### B. The app does not run Tailwind

```ts
import '@eylulg/ui/styles.css';
import '@eylulg/ui/themes/workspace.css';
```

`styles.css` contains Tailwind's preflight, the tokens and the classes the components use. Do not
combine it with path A, or preflight ships twice.

### C. The app styles itself and wants only the tokens

```css
@import '@eylulg/ui/tokens.css';
@import '@eylulg/ui/themes/sudoku.css';
```

`tokens.css` holds custom properties only, on `:root` and `.dark-mode` (or `.dark`): colour scales
(`--color-brand-600`), semantic tokens (`--ui-text-primary`, `--ui-bg-elevated`,
`--ui-border-focus`), fonts (`--font-sans`, `--font-body`, `--font-display`, `--font-mono`,
`--ui-font-data`), the type scale (`--text-xs` to `--text-3xl`, each with a `--text-xs--line-height`
companion), radii, shadows and density (`--density-control-md`). It has no preflight and no
component styles. It is generated from `theme.css`, and every variant works on top of it.

```css
.card {
  background: var(--ui-bg-elevated);
  color: var(--ui-text-primary);
  border: 1px solid var(--ui-border-subtle);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}
```

The tokens assume a small reset: `box-sizing: border-box`, no body margin, form controls that
inherit font and colour, and no default margins on headings, paragraphs and lists. Import
`@eylulg/ui/reset.css` after the tokens for that, or write your own. Headings and lists lose their
browser styling with it, so set sizes from the type scale and restore bullets where prose needs
them. Apps on path A or B already have preflight and must not import `reset.css`.

```css
@import '@eylulg/ui/tokens.css';
@import '@eylulg/ui/reset.css';
@import '@eylulg/ui/themes/sudoku.css';
```

An app on path C that also renders library components imports `styles.css` (path B) instead.

## Fonts

The themes name their fonts and fall back to the system font, so nothing downloads by default.
Every theme uses Manrope for headings, Inter for text and JetBrains Mono for code only. To load
them, import `fonts.css` before the theme:

```css
@import '@eylulg/ui/fonts.css';
@import '@eylulg/ui/theme.css'; /* or tokens.css, or styles.css */
@import '@eylulg/ui/themes/workspace.css';
```

`fonts.css` imports the variable fonts and sets `--font-inter`, `--font-manrope` and
`--font-jetbrains-mono`, which the theme's font stacks start with. A browser downloads only the
faces a page uses. An app that self-hosts a subset can skip `fonts.css` and set the same
variables to its own `@font-face` families.

## Theme variants

A variant changes colour only. The variants and their seeds are listed in the
[README](../README.md#theme-variants). Import one variant file after `theme.css`.

To use a variant for part of a page, put `data-ui-variant="review"` on a container: every variant
file also applies under that attribute. To switch variants at runtime, import
`@eylulg/ui/themes/all.css` instead, which holds all nine under the attribute only, and set
`data-ui-variant` on `<html>`. The same data is available to scripts:

```ts
import { variants } from '@eylulg/ui/themes';
variants.workspace.seed.light; // '#3f6fb6'
```

## Dark mode

Dark mode is class based. `ThemeToggle` writes `dark-mode` on `<html>` (`dark` works too) and
remembers the choice in `localStorage`. Put `themeInitScript` in `<head>` so the first paint has
the right theme, or the page flashes light before hydration.

`ThemeToggle` is built on `useTheme`, which you can call for a command palette or a settings page.
It returns the user's choice, the theme applied now and a setter. The page and every
`ThemeToggle` stay in step. The choice is stored under `eylulg-ui-theme` (`themeStorageKey`): the
value is `light` or `dark`, and the key is absent for system.

```tsx
import { useTheme } from '@eylulg/ui/chrome';

function ThemeCommands() {
  const { theme, resolved, setTheme } = useTheme(); // 'system' | 'light' | 'dark', 'light' | 'dark'
  return <button onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}>Flip</button>;
}
```

It works where `matchMedia` or storage is missing (tests, embedded webviews). On the server it
reports `system` and `light`.

## Vite and React Router

Inject `themeInitScript` into `index.html` at build time. `@eylulg/ui/theme-script` is a plain
string module with no React, so it loads in the Vite config:

```ts
// vite.config.ts
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { themeInitScript } from '@eylulg/ui/theme-script';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'theme-init',
      transformIndexHtml: () => [
        { tag: 'script', children: themeInitScript, injectTo: 'head-prepend' },
      ],
    },
  ],
});
```

```tsx
// src/main.tsx
import './index.css'; // path A above
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, useLocation } from 'react-router';
import {
  AppShell,
  ProjectSwitcher,
  SiteFooter,
  ThemeToggle,
  TopNav,
  type LinkProps,
} from '@eylulg/ui/chrome';
import { Button } from '@eylulg/ui/button';

function RouterLink({ href, ...props }: LinkProps) {
  return <Link to={href} {...props} />;
}

function Nav() {
  const { pathname } = useLocation();
  return (
    <TopNav
      productName='Workspace'
      LinkComponent={RouterLink}
      links={[
        { href: '/', label: 'Issues', isCurrent: pathname === '/' },
        { href: '/roadmap', label: 'Roadmap', isCurrent: pathname === '/roadmap' },
      ]}
      actions={
        <>
          <ProjectSwitcher currentId='workspace' />
          <ThemeToggle />
        </>
      }
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppShell header={<Nav />} footer={<SiteFooter currentId='workspace' />}>
      <Button>New issue</Button>
    </AppShell>
  </BrowserRouter>,
);
```

## Next.js App Router

Interactive component modules start with `"use client"`. The markup and data modules do not, so a
server component can import them: `AppShell`, `SiteFooter`, `BrandMark`,
`themeInitScript`, `@eylulg/ui/projects` and `@eylulg/ui/themes`.

A server component cannot pass a function such as `next/link` to a client component. Render
`TopNav` (and `SidebarNav`, if you pass `LinkComponent`) from a small client file:

```tsx
// app/nav.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProjectSwitcher, ThemeToggle, TopNav } from '@eylulg/ui/chrome';

const links = [
  { href: '/', label: 'Issues' },
  { href: '/roadmap', label: 'Roadmap' },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <TopNav
      productName='Workspace'
      LinkComponent={Link}
      links={links.map((link) => ({ ...link, isCurrent: link.href === pathname }))}
      actions={
        <>
          <ProjectSwitcher currentId='workspace' />
          <ThemeToggle />
        </>
      }
    />
  );
}
```

```tsx
// app/layout.tsx (a server component)
import type { ReactNode } from 'react';
import { AppShell, SiteFooter, themeInitScript } from '@eylulg/ui/chrome';
import { Nav } from './nav';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AppShell header={<Nav />} footer={<SiteFooter currentId='workspace' />}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` is needed because the script changes its class before React
hydrates. Server pages can render components such as `Button` or `PageHeader` directly. Props like
`onPress` need a client component, as with any React component.

## Chrome details

**Translations.** `TopNav`, `ThemeToggle`, `ProjectSwitcher` and `SiteFooter` take a `labels`
object, and missing keys keep the English text. The skip link text is `AppShell`'s
`skipLinkLabel`. `SiteFooter`'s `codeNote` marks where the GitHub link goes with `{github}`.

```tsx
<TopNav productName='Watchlist' labels={{ openMenu: 'Menü öffnen', closeMenu: 'Menü schließen' }} />
<ThemeToggle labels={{ ariaLabel: 'Farbschema', light: 'Hell', dark: 'Dunkel', system: 'System' }} />
<ProjectSwitcher labels={{ label: 'Projekte', heading: 'Eylüls Projekte', youAreHere: 'Sie sind hier', sourceCode: '(Quellcode)' }} />
<SiteFooter labels={{ projectsNav: 'Projekte', profilesNav: 'Profile', codeNote: 'Der Code jedes Projekts liegt auf {github}.', builtWith: 'Gebaut mit @eylulg/ui' }} />
```

**TopNav slots.** `center` sits between the links and the actions (a search field or a command
palette button) from the md breakpoint, and at the top of the mobile menu. `actions` is the right
hand side from md and moves into the mobile menu below that. `compactActions` stays in the bar
next to the menu button below md, so the theme toggle is reachable without opening the menu.

```tsx
<TopNav
  productName='Workspace'
  center={
    <Button variant='secondary' size='sm' iconLeading={Search}>
      Search
    </Button>
  }
  actions={
    <>
      <ProjectSwitcher currentId='workspace' />
      <ThemeToggle />
    </>
  }
  compactActions={<ThemeToggle compact />}
/>
```

**AppShell width.** `maxWidth="6xl"` centres the content in a column as wide as `TopNav` and
`SiteFooter`, so they line up. `contentClassName` adds layout classes to that column.

**SiteFooter.** The footer is one band: a link for every project (to its live site, or to its
repository when `url` is null), GitHub and LinkedIn icon buttons, and a line about the code and
the library. The link for `currentId` has `aria-current="page"`. `children` render below that
line, for attributions a data provider requires.

**SidebarNav item actions.** `action` on an item renders a control beside its link, such as an
`IconButton` that adds a child item. It is its own tab stop and arrow keys reach it.

## Overlays

`Dialog`, `Drawer`, `Popover`, `DropdownMenu`, `Tooltip`, `CommandPalette`, the toast markup,
`ProjectSwitcher` and `ThemeToggle compact` keep their trigger in the first load and fetch the
overlay code when the trigger is hovered or focused, and at the latest when it opens. The first
open can take a moment on a slow connection. In tests it is asynchronous: use
`await screen.findByRole('menu')`, not `getByRole`. If the download fails, nothing opens and the
next press tries again. `Select`, `Combobox` and the date pickers are not split. See
[performance.md](./performance.md).

`@eylulg/ui/cx-lite` joins class names without tailwind-merge. Use it for conditional classes in
your own markup, and `@eylulg/ui/cx` where a later class must override an earlier one.

## Charts

`@eylulg/ui/chart` needs no extra package. Series colours are the `--ui-chart-*` tokens, so they
follow the variant and dark mode.

```tsx
import { BarChart, HeatGrid, LineChart } from '@eylulg/ui/chart';
```

- **Title.** `title` is the chart's accessible name. Pass `hideTitle` when a card heading already
  says it. The chart writes a short English summary from the data; pass `summary` to replace it.
  `labels` translates "Show table", "Hide table", the empty message, "No data", "Total" and the
  default table headers.
- **Size.** A chart is as wide as its container. `height` is the height of the whole chart in
  pixels, axes included. `isCard` adds a bordered surface.
- **Missing and negative values.** `null` leaves a gap and reads as "No data". Bars below zero grow
  down or to the left, and a stack adds negatives and positives separately.
- **Series colour.** Colours follow the order of `series`. When a filter removes a series, set
  `colorIndex` (0 to 5) on each series so the remaining ones keep their colour.
- **Formatting.** `locale` is a BCP 47 tag. `valueFormat` takes `Intl.NumberFormat` options, such
  as `{ style: 'percent' }`, and `xFormat` takes `Intl.DateTimeFormat` options. `{ timeZone }` alone
  reads dates in a fixed zone and keeps the automatic tick format. Dates show without a time of
  day when every point is at midnight in that zone or the points are a day or more apart, so pass
  `timeZone` for date-only data.
- **Server rendering.** Charts render at 480 px on the server and measure themselves after mount.
  Nothing reads `window` during render.
- **Tests.** Under jsdom the width stays at 480 px because there is no layout. Marks are
  `role="img"` elements named with their values (`getByRole('img', { name: /Mar 3/ })`), and
  `HeatGrid` cells are `gridcell`s named by their state.

## Project list

`ProjectSwitcher` and `SiteFooter` read `projects` from `@eylulg/ui/projects`. Pass `projects` to
either one to replace the list.

For an app with translations, build the list from the library's and replace only the text. Ids,
URLs and variants stay shared, so the current-project mark and the links keep working:

```tsx
import { projects } from '@eylulg/ui/projects';

const translated = projects.map((project) => ({
  ...project,
  description: t(`projects.${project.id}`), // your i18n function
}));

<ProjectSwitcher projects={translated} currentId="workspace" labels={{ label: t('nav.projects') }} />
<SiteFooter projects={translated} currentId="workspace" />
```

`SiteFooter` shows names only, so translate `name` only if the names themselves change.
`ProjectSwitcher` shows the descriptions.

## CI for an app that links the library

Check the app and the library out as siblings and build the library first, so `file:../ui`
resolves as it does locally:

```yaml
steps:
  - uses: actions/checkout@v4
    with: { path: app }
  - uses: actions/checkout@v4
    with: { repository: eylulg/ui, path: ui }
  - run: npm ci && npm run build
    working-directory: ui
  - run: npm ci
    working-directory: app
  - run: npm run build
    working-directory: app
```

An app that installs from npm needs none of this.
