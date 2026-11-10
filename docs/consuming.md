# Consuming @eylulg/ui

This is how every project in the family uses the library: one theme variant, the shared chrome
(top nav with the project switcher, footer, theme toggle) and components from per component entry
points.

## Install

Until the package is published to npm, link the local checkout. Clone this repo next to the app:

```text
Portfolio/
  ui/              # this repo
  workspace/       # an app
```

Build the library once, then install it from the folder:

```bash
cd ../ui && npm install && npm run build
cd ../workspace && npm install ../ui     # writes "@eylulg/ui": "file:../ui"
npm install react-aria-components lucide-react
```

`file:` installs a symlink, so the app always sees the latest `dist/`. Run `npm run build` in `ui`
after a change (or keep `npx vite build --watch` running) and restart the app's dev server. A copied
install (`--install-links`) works differently, see [One copy of React](#one-copy-of-react-with-a-linked-checkout). When
the package is on npm, replace the `file:../ui` range with a version and nothing else changes.

`react`, `react-dom` and `lucide-react` are peer dependencies (and `@fontsource-variable/inter`
an optional one, see [Fonts](#fonts)). The library re-exports no icons: import them from
`lucide-react` yourself and pass the component (`icon={Plus}`) or, in the chrome, an element
(`icon: <Inbox />`).

### One copy of React with a linked checkout

In `ui`, `react`, `react-dom` and `lucide-react` are `devDependencies` plus `peerDependencies`,
never `dependencies`, so a published install shares your copies. A `file:` link is different: the
symlink resolves to the real folder, so the library's modules find `ui/node_modules`, which holds
its own React, React Aria Components and lucide. Two copies break hooks, React Aria's router
context and `instanceof` checks. The cleanest fix is to install a copy instead of a link:

```bash
npm install ../ui --install-links     # packs ui and installs it like a registry package
```

A copied install has three rules:

- It is a snapshot. After every library rebuild (`npm run build` in `ui`), run the command again,
  or the app keeps the old `dist/`. Restarting the dev server is not enough.
- Any later `npm install <pkg>` or `npm install` in the app reverts `@eylulg/ui` to a symlink,
  which brings the second copy of React back. Run `--install-links` last, after every other
  install.
- Add a script so nobody has to remember the flag:

  ```json
  { "scripts": { "relink": "npm install ../ui --install-links" } }
  ```

  Then the loop is `npm run build` in `ui`, `npm run relink` in the app.

To keep the live symlink instead, point the tools at your copy:

```ts
// vite.config.ts (Vite, and Vitest when it shares the config)
export default defineConfig({
  resolve: { dedupe: ['react', 'react-dom', 'react-aria-components', 'lucide-react'] },
});
```

```ts
// next.config.ts (Next.js with Turbopack). The root must contain the linked folder.
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
`@types/react` resolve. Point both at yours:

```json
{ "compilerOptions": { "paths": { "react": ["./node_modules/@types/react"] } } }
```

None of this applies once the package is on npm.

### Icons in Next.js server components

lucide-react icons use React context, so a server component cannot render them. Re-export the ones
you use from a client file and import them from there. A client reference can still be passed to a
library component as a prop:

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

## Styles: pick one of three paths

### A. The app runs Tailwind 4 (recommended)

Import the tokens inside your own Tailwind entry so they become utilities in your markup
(`bg-brand-solid`, `text-secondary`, `h-control-md`, `rounded-lg`), then one variant, and let
Tailwind scan the library's compiled files for the classes its components use:

```css
/* src/index.css (Vite) or app/globals.css (Next.js) */
@import 'tailwindcss';
@import '@eylulg/ui/theme.css';
@import '@eylulg/ui/themes/workspace.css';
@source '../node_modules/@eylulg/ui/dist';
```

Adjust the `@source` path so it points from this CSS file to `node_modules/@eylulg/ui/dist`.

### B. The app does not run Tailwind

Import the compiled stylesheet, then the variant:

```ts
import '@eylulg/ui/styles.css';
import '@eylulg/ui/themes/workspace.css';
```

`styles.css` contains Tailwind's preflight, the tokens and only the classes the components use.
Do not combine it with path A, or preflight ships twice.

### C. The app styles itself and only wants the tokens

Import the plain tokens, then a variant:

```css
@import '@eylulg/ui/tokens.css';
@import '@eylulg/ui/themes/sudoku.css';
```

`tokens.css` holds custom properties only, on `:root` and `.dark-mode` (or `.dark`): the colour
scales (`--color-brand-600`), the semantic set (`--ui-text-primary`, `--ui-bg-elevated`,
`--ui-border-focus`), fonts (`--font-sans`, `--font-body`, `--font-display`, `--font-mono`,
`--ui-font-data`), the type scale (`--text-xs` to `--text-3xl`, each with a
`--text-xs--line-height` companion), radii, shadows and density (`--density-control-md`). No
preflight, no component styles, no Tailwind at-rules. It is generated from `theme.css`, so it cannot
drift, and every variant file works on top of it. Use it for your own components:

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

Without Tailwind there is no preflight either, so the app must provide the minimal reset the
tokens assume: `box-sizing: border-box` everywhere, no body margin, form controls that inherit
font and colour, and no default margins on headings, paragraphs and lists. Import the optional
`reset.css` after the tokens, or copy it:

```css
@import '@eylulg/ui/tokens.css';
@import '@eylulg/ui/reset.css';
@import '@eylulg/ui/themes/sudoku.css';
```

```css
*,
::before,
::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: var(--ui-bg-primary);
  color: var(--ui-text-primary);
  font-family: var(--font-body);
  line-height: 1.5;
}
button,
input,
select,
textarea {
  font: inherit;
  letter-spacing: inherit;
  color: inherit;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
}
p,
figure,
blockquote {
  margin: 0;
}
ul,
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

Headings and lists lose their browser styling, so set sizes with the type scale and restore bullets
where prose needs them. Apps on path A or B already have Tailwind's preflight and must not import
`reset.css`.

Library components need their classes, so an app on path C that also renders them imports
`styles.css` (path B) instead.

## Fonts

Every variant names Inter and falls back to the system font, so nothing downloads by default. To
load Inter, install the optional peer and import `fonts.css` before the theme:

```bash
npm install @fontsource-variable/inter
```

```css
@import '@eylulg/ui/fonts.css';
@import '@eylulg/ui/theme.css'; /* or tokens.css, or styles.css */
@import '@eylulg/ui/themes/workspace.css';
```

`fonts.css` imports the variable font from `@fontsource-variable/inter` and sets `--font-inter` to
it. The theme's font stacks start with `var(--font-inter, 'Inter')`, so they pick the bundled font
up without any other change, and keep working with a locally installed Inter when you skip it.

## Theme variants

| Variant          | Project               | Brand   | Gray    | Radius | Density     |
| ---------------- | --------------------- | ------- | ------- | ------ | ----------- |
| `portfolio`      | Portfolio             | indigo  | slate   | large  | comfortable |
| `workspace`      | Workspace             | blue    | neutral | small  | compact     |
| `review`         | Review Companion      | teal    | slate   | medium | comfortable |
| `control-room`   | Agent control room    | amber   | zinc    | small  | compact     |
| `watchlist`      | Watchlist             | rose    | stone   | large  | comfortable |
| `tokens`         | Tokens to Tailwind    | violet  | neutral | medium | comfortable |
| `plain-language` | Plain Language add-in | cyan    | slate   | medium | compact     |
| `sudoku`         | Sudoku                | green   | neutral | medium | comfortable |
| `assistant`      | Assistant             | magenta | stone   | large  | comfortable |

`control-room` also moves the status warning scale from the base orange amber to yellow (hue 95), so
brand and warning badges do not look alike. Every contrast pair stays AA. Other variants keep the
base warning scale.

Import exactly one variant file after `theme.css`. To use a variant for part of a page only, put
`data-ui-variant="review"` on a container: every variant file also applies under that attribute.
The same matrix is available to scripts and tools as typed data:

```ts
import { variants } from '@eylulg/ui/themes';
variants.workspace.density; // 'compact'
```

## Dark mode and the theme toggle

Dark mode is class based. `ThemeToggle` writes `dark-mode` on `<html>` (the theme also accepts
`dark`) and remembers the choice in `localStorage`. Put `themeInitScript` in `<head>` so the first
paint already has the right theme; otherwise the page flashes light before hydration.

### Setting the theme from code

`ThemeToggle` is built on `useTheme`, which you can call too, for a command palette or a settings
page. It returns the user's choice, what is applied now, and a setter; the page and every
`ThemeToggle` stay in step, and the choice is remembered in `localStorage` under the key
`eylulg-ui-theme` (`themeStorageKey`; the value is `light` or `dark`, and the key is absent for
system).

```tsx
import { useTheme } from '@eylulg/ui/chrome';

function ThemeCommands() {
  const { theme, resolved, setTheme } = useTheme(); // 'system', 'dark', ('light' | 'dark')
  return <button onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}>Flip</button>;
}
```

It is safe where `matchMedia` or storage is missing (tests, embedded webviews), and on the server it
reports `system` and `light`.

## Vite (React Router)

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
      productName="Workspace"
      LinkComponent={RouterLink}
      links={[
        { href: '/', label: 'Issues', isCurrent: pathname === '/' },
        { href: '/roadmap', label: 'Roadmap', isCurrent: pathname === '/roadmap' },
      ]}
      actions={
        <>
          <ProjectSwitcher currentId="workspace" />
          <ThemeToggle />
        </>
      }
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppShell header={<Nav />} footer={<SiteFooter currentId="workspace" />}>
      <Button>New issue</Button>
    </AppShell>
  </BrowserRouter>,
);
```

## Next.js (App Router)

Every component module carries `"use client"`. The data and markup only modules do not, so a
server component can import them directly: `AppShell`, `SiteFooter`, `BrandMark`,
`themeInitScript`, `@eylulg/ui/projects` and `@eylulg/ui/themes`.

Next.js does not let a server component pass a function such as `next/link` as a prop to a client
component. Render `TopNav` (and `SidebarNav` if you pass `LinkComponent`) from a small client file:

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
      productName="Workspace"
      LinkComponent={Link}
      links={links.map((link) => ({ ...link, isCurrent: link.href === pathname }))}
      actions={
        <>
          <ProjectSwitcher currentId="workspace" />
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AppShell header={<Nav />} footer={<SiteFooter currentId="workspace" />}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` is needed because the script changes its class before
React hydrates. Server pages can render library components such as `Button` or `PageHeader`
directly; interactive props like `onPress` need a client component, as with any React component.

## Chrome details

**Translating the chrome.** `TopNav`, `ThemeToggle`, `ProjectSwitcher` and `SiteFooter` take a
`labels` object. Missing keys keep the English default, and project descriptions come from the
`projects` list you pass, so translate those there. The skip link's text is
`AppShell`'s `skipLinkLabel`.

```tsx
<TopNav productName="Watchlist" labels={{ openMenu: 'Menü öffnen', closeMenu: 'Menü schließen' }} />
<ThemeToggle labels={{ ariaLabel: 'Farbschema', light: 'Hell', dark: 'Dunkel', system: 'System' }} />
<ProjectSwitcher labels={{ label: 'Projekte', heading: 'Projekte von Eylül', youAreHere: 'Sie sind hier', sourceCode: '(Quellcode)' }} />
<SiteFooter labels={{ intro: 'Teil der Projekte von Eylül Güneş', projectsNav: 'Projekte', source: '(Quellcode)', profilesNav: 'Profile', github: 'GitHub', linkedin: 'LinkedIn', builtWith: 'Gebaut mit @eylulg/ui' }} />
```

**TopNav slots.** `center` sits between the links and the actions (a search field or a command
palette button), from the md breakpoint, and at the top of the mobile menu. `actions` is the right
hand side from md and lives in the mobile menu below that. `compactActions` stays in the bar next to
the menu button below md, so the theme toggle is reachable at 375px without opening the menu:

```tsx
<TopNav
  productName="Workspace"
  center={
    <Button variant="secondary" size="sm" iconLeading={Search}>
      Search
    </Button>
  }
  actions={
    <>
      <ProjectSwitcher currentId="workspace" />
      <ThemeToggle />
    </>
  }
  compactActions={<ThemeToggle compact />}
/>
```

`ThemeToggle compact` is one icon button that opens a menu of the three choices. The menu behind
the menu button loads on first press, so a page that never opens it does not download React Aria's
modal code.

**AppShell width.** `maxWidth="6xl"` centres the content in a column as wide as `TopNav` and
`SiteFooter`, so everything lines up. `contentClassName` adds layout classes (`space-y-8`) to that
column.

**SiteFooter extras.** `children` render between the project links and the profile row, for
attributions a data provider requires or for extra links.

**SidebarNav item actions.** `action` on an item renders a control beside its link, such as an
`IconButton` that adds a child item. It is its own tab stop and arrow keys reach it.

## Overlays load on first open

`Dialog`, `Drawer`, `Popover`, `DropdownMenu`, `Tooltip`, `CommandPalette`, the toast markup, `ProjectSwitcher` and `ThemeToggle compact` keep their trigger in the first load and fetch the overlay code on hover or focus of the trigger, and at the latest when it opens. The trigger and its ARIA attributes render at once. The first open can take a moment on a slow connection, and in tests it is asynchronous: use `await screen.findByRole('menu')`, not `getByRole`. If the download fails, nothing opens and the next press tries again. `Select`, `Combobox` and the date pickers are not split. Sizes and the reasons are in [performance.md](./performance.md).

`@eylulg/ui/cx-lite` joins class names without tailwind-merge (93 B instead of 8.5 kB gzip). Use it for conditional classes in your own markup, and `@eylulg/ui/cx` where a later class must override an earlier one.

## Project list

`ProjectSwitcher` and `SiteFooter` read `@eylulg/ui/projects`. Projects that are not deployed yet
have `url: null` and a `plannedUrl` (Vercel style placeholders), and link to their repository
until they go live. The URLs change again when the custom domain arrives. Pass `projects={...}`
to either component to override the list.

For an app with translations, build the list from the library's and replace only the text. Ids,
URLs and variants stay shared, so the "you are here" mark and the links keep working:

```tsx
import { projects } from '@eylulg/ui/projects';

const translated = projects.map((project) => ({
  ...project,
  description: t(`projects.${project.id}`), // your i18n function
}));

<ProjectSwitcher projects={translated} currentId="workspace" labels={{ label: t('nav.projects') }} />
<SiteFooter projects={translated} currentId="workspace" />
```

`SiteFooter` shows only the names, so its list needs translated `name` values only when the names
themselves change. `ProjectSwitcher` shows the descriptions.

## CI for an app that links the library

Check the app and the library out as siblings and build the library first, so `file:../ui` resolves
exactly as on a laptop:

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

Switch the dependency to a version range once the package is published, and drop the library steps.
