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
after a change (or keep `npx vite build --watch` running) and restart the app's dev server. When
the package is on npm, replace the `file:../ui` range with a version and nothing else changes.

`react`, `react-dom` and `lucide-react` are peer dependencies. The library re-exports no icons:
import them from `lucide-react` yourself and pass the component (`icon={Plus}`) or, in the chrome,
an element (`icon: <Inbox />`).

## Styles: pick one of two paths

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

## Theme variants

| Variant          | Project               | Brand  | Gray    | Radius | Density     |
| ---------------- | --------------------- | ------ | ------- | ------ | ----------- |
| `portfolio`      | Portfolio             | indigo | slate   | large  | comfortable |
| `workspace`      | Workspace             | blue   | neutral | small  | compact     |
| `review`         | Review Companion      | teal   | slate   | medium | comfortable |
| `control-room`   | Agent control room    | amber  | zinc    | small  | compact     |
| `watchlist`      | Watchlist             | rose   | stone   | large  | comfortable |
| `tokens`         | Tokens to Tailwind    | violet | neutral | medium | comfortable |
| `plain-language` | Plain Language add-in | cyan   | slate   | medium | compact     |
| `sudoku`         | Sudoku                | green  | neutral | medium | comfortable |

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

## Project list

`ProjectSwitcher` and `SiteFooter` read `@eylulg/ui/projects`. Projects that are not deployed yet
have `url: null` and a `plannedUrl` (Vercel style placeholders), and link to their repository
until they go live. The URLs change again when the custom domain arrives. Pass `projects={...}`
to either component to override the list.
