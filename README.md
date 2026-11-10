# @eylulg/ui

[![CI](https://github.com/eylulg/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/eylulg/ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/storybook-live-ff4785)](https://eylulg.github.io/ui/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

The design system for all of [Eylül Güneş](https://github.com/eylulg)'s projects: an accessible
React 19 component library, eight project theme variants on one visual language, and the shared
app chrome (top nav, project switcher, theme toggle, footer) that makes moving between the
projects feel like one product family.

**Live docs:** https://eylulg.github.io/ui/

## Why it is built this way

- **React Aria Components for behaviour.** Keyboard navigation, focus management, focus trapping,
  ARIA wiring and screen reader announcements are the hardest parts of a component library to get
  right and the easiest to regress. React Aria has them tested across browsers and assistive
  technology, so this library spends its effort on API design and visuals instead of
  reimplementing them.
- **Tailwind CSS 4 tokens for theming.** Every colour, radius, shadow and type size is a CSS
  variable declared with `@theme`. Components only reference _semantic_ tokens (`text-primary`,
  `bg-elevated`, `border-control`), which point at primitive scales (`brand`, `gray`, `success`,
  `warning`, `error`). Dark mode and rebranding are a matter of redefining variables, with no
  component changes and no runtime cost.
- **Small and tree shakeable.** ESM only, one module per source file, `sideEffects` limited to
  CSS, and a dedicated entry point per component. A bundle size budget runs in CI.
- **One family, eight variants.** Each project imports one variant file that changes only the
  brand hue, the gray family, the radius and the density. Scales are generated in oklch with the
  same lightness per step, so contrast is the same in every variant, and a test checks WCAG AA
  for every text token in light and dark.
- **Accessibility is tested, not assumed.** Tests cover the behaviour this library adds on top of
  React Aria, and every component has an axe audit in both themes. Storybook runs axe on every
  story, including colour contrast.

## Install

```bash
npm install @eylulg/ui react-aria-components lucide-react
```

`react`, `react-dom` 19 and `lucide-react` are peer dependencies, and `@fontsource-variable/inter`
an optional one. Until the package is on npm, install it from a local checkout with
`npm install ../ui` (a `file:../ui` dependency). The full workflow, including how to keep a single
copy of React with a linked checkout, with Vite and Next.js examples, is in
[docs/consuming.md](./docs/consuming.md).

## Usage

Pick one styles path. In an app that runs Tailwind 4, import the tokens and a variant into your
own Tailwind entry so they also become utilities in your markup:

```css
@import 'tailwindcss';
@import '@eylulg/ui/theme.css';
@import '@eylulg/ui/themes/workspace.css';
@source '../node_modules/@eylulg/ui/dist';
```

Without Tailwind, import the compiled stylesheet and a variant once, at the root of the app:

```ts
import '@eylulg/ui/styles.css';
import '@eylulg/ui/themes/workspace.css';
```

An app that styles itself and only wants the design tokens imports `@eylulg/ui/tokens.css` (custom
properties on `:root` and `.dark-mode`, no preflight, no component styles) and a variant. To load
Inter, install `@fontsource-variable/inter` and import `@eylulg/ui/fonts.css` first; every variant
names Inter and falls back to the system font without it.

Then use components from a per component entry point (or the index):

```tsx
import { Button } from '@eylulg/ui/button';
import { Dialog, DialogTrigger } from '@eylulg/ui/dialog';
import { Input } from '@eylulg/ui/input';

export function InviteDialog() {
  return (
    <DialogTrigger>
      <Button>Invite teammate</Button>
      <Dialog
        title="Invite teammate"
        footer={({ close }) => <Button onPress={close}>Send invite</Button>}
      >
        <Input label="Email" type="email" isRequired />
      </Dialog>
    </DialogTrigger>
  );
}
```

### Dark mode

Dark mode is class based. `ThemeToggle` writes `dark-mode` on `<html>`; the theme also accepts
`dark`, on `<html>` or on any container. Put `themeInitScript` in `<head>` to avoid a flash of the
wrong theme (see [docs/consuming.md](./docs/consuming.md)).

## Theme variants

Every variant shares the base theme: type scale, spacing, semantic tokens and status colours. A
variant overrides only the brand and gray scales, `--radius-*`, `--density-*`, `--font-display`
(Inter everywhere) and `--font-mono` (a system monospace stack). Import exactly one, after
`theme.css`.

| Variant          | Import                                 | Project               | Brand  | Gray         | Radius | Density     | Data font |
| ---------------- | -------------------------------------- | --------------------- | ------ | ------------ | ------ | ----------- | --------- |
| `portfolio`      | `@eylulg/ui/themes/portfolio.css`      | Portfolio             | indigo | cool (slate) | large  | comfortable | Inter     |
| `workspace`      | `@eylulg/ui/themes/workspace.css`      | Workspace             | blue   | neutral      | small  | compact     | Inter     |
| `review`         | `@eylulg/ui/themes/review.css`         | Review Companion      | teal   | cool (slate) | medium | comfortable | monospace |
| `control-room`   | `@eylulg/ui/themes/control-room.css`   | Agent control room    | amber  | zinc         | small  | compact     | Inter     |
| `watchlist`      | `@eylulg/ui/themes/watchlist.css`      | Watchlist             | rose   | warm (stone) | large  | comfortable | Inter     |
| `tokens`         | `@eylulg/ui/themes/tokens.css`         | Tokens to Tailwind    | violet | neutral      | medium | comfortable | Inter     |
| `plain-language` | `@eylulg/ui/themes/plain-language.css` | Plain Language add-in | cyan   | cool (slate) | medium | compact     | Inter     |
| `sudoku`         | `@eylulg/ui/themes/sudoku.css`         | Sudoku                | green  | neutral      | medium | comfortable | Inter     |

`control-room` also darkens the dark mode surfaces for an operations dashboard. `review` sets
`font-data` (table cells, stat values) to the monospace stack.

- **Same contrast everywhere.** Scales run from 25 to 950 in oklch with fixed lightness per step;
  chroma is reduced per step until the colour fits sRGB. `npm run themes` regenerates the scales
  and CSS from `src/styles/themes/variants.ts`, and `npm run contrast` (also part of `npm test`)
  checks text, icon, control border and focus ring contrast in light and dark for the base theme
  and every variant. All pass AA; white on a primary button ranges from 4.83:1 (sudoku) to
  5.74:1 (watchlist).
- **Density.** Components size from `--density-*` through utilities such as `h-control-md`,
  `px-control-x`, `py-item-y`, `px-cell-x` and `p-card`, so compact variants tighten every
  control, menu row and table cell at once.
- **Scoped variants.** Every variant file also applies under `[data-ui-variant="<name>"]`, so a
  page can show a variant in a container. Storybook uses this for its variant pages.
- **Typed matrix.** `import { variants, variantNames } from '@eylulg/ui/themes'` gives tools the
  same data, including the generated scales.

## Overriding the brand scale

To change a single decision rather than switch variant, override a semantic variable after the
library CSS, for example `:root { --ui-bg-brand-solid: var(--color-brand-700); }`, or redefine
the `--color-brand-*` steps. Keep `brand-600` at 4.5:1 or more against white, because primary
buttons place white text on it.

## Components

| Component                     | Import                         | Built on (React Aria)                                        | Highlights                                                                                                                                 |
| ----------------------------- | ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Avatar`                      | `@eylulg/ui/avatar`            | none (static, image fallback)                                | Image, initials fallback on error (drawn with CSS, so a labelled button's name stays valid), status, sizes, `AvatarGroup`                  |
| `Badge`                       | `@eylulg/ui/badge`             | none (static)                                                | gray, brand, success, warning, error, blue, purple, pink, orange, indigo (AA in every variant); dot; icon                                  |
| `Breadcrumbs`                 | `@eylulg/ui/breadcrumbs`       | `Breadcrumbs`, `Breadcrumb`, `Link`                          | Nav landmark, current page, router links                                                                                                   |
| `Button`                      | `@eylulg/ui/button`            | `Button`, `Link`                                             | primary, secondary, tertiary, destructive, destructive-outline; sm, md, lg; loading; icons; `href` renders a link; `buttonStyles()`; `ref` |
| `Card`                        | `@eylulg/ui/card`              | `Link`, `Button`                                             | Header, body, footer slots; interactive card as one link or button; `padding="none"` for media; aria props reach the link                  |
| `Checkbox`                    | `@eylulg/ui/checkbox`          | `Checkbox`                                                   | Indeterminate, hint, invalid                                                                                                               |
| `CodeBlock`                   | `@eylulg/ui/code-block`        | none (static)                                                | `pre` in the data font, labelled and keyboard scrollable, optional copy button with a status                                               |
| `Combobox`                    | `@eylulg/ui/combobox`          | `ComboBox`, `Popover`, `ListBox`                             | Async loading, sections, empty state, descriptions                                                                                         |
| `CommandPalette`              | `@eylulg/ui/command-palette`   | `Autocomplete`, `SearchField`, `Menu`, `Modal`               | Search, groups, shortcuts, Cmd or Ctrl+K hook, nested pages (Backspace goes back), `onSearchChange`, `closeOnAction`                       |
| `DatePicker, DateRangePicker` | `@eylulg/ui/date-picker`       | `DatePicker`, `DateRangePicker`, `Calendar`, `RangeCalendar` | Segmented input, calendar popover, hint, error                                                                                             |
| `Dialog`                      | `@eylulg/ui/dialog`            | `Modal`, `Dialog`                                            | Focus trap and restore, `alertdialog` role, three sizes, `headerActions` slot                                                              |
| `Drawer`                      | `@eylulg/ui/drawer`            | `ModalOverlay`, `Modal`, `Dialog`                            | Left, right or bottom sheet; sticky footer; reduced motion                                                                                 |
| `DropdownMenu`                | `@eylulg/ui/dropdown-menu`     | `MenuTrigger`, `Menu`, `MenuSection`, `SubmenuTrigger`       | Sections, checkbox and radio groups, shortcuts, danger items, submenus                                                                     |
| `EmptyState`                  | `@eylulg/ui/empty-state`       | none (static)                                                | Icon, title, description, actions, two sizes, heading level 1 to 4                                                                         |
| `FileDropZone`                | `@eylulg/ui/file-drop-zone`    | `DropZone`, `FileTrigger`                                    | Drop or pick files, accepted types checked on both paths, `onSelect` and `onReject`                                                        |
| `IconButton`                  | `@eylulg/ui/icon-button`       | `Button`                                                     | Required `aria-label`, same variants, loading                                                                                              |
| `Input`                       | `@eylulg/ui/input`             | `TextField`, `Input`, `Group`                                | Label, hint, error, icons, two sizes, `ref` to the input element                                                                           |
| `Kbd`                         | `@eylulg/ui/kbd`               | none (static)                                                | Single keys or key combinations                                                                                                            |
| `PageHeader`                  | `@eylulg/ui/page-header`       | none (static)                                                | Title, description, actions, breadcrumbs, eyebrow and meta slots                                                                           |
| `Pagination`                  | `@eylulg/ui/pagination`        | none (buttons or links)                                      | Ellipses, sibling count, `getPageHref` for link pagination                                                                                 |
| `Popover`                     | `@eylulg/ui/popover`           | `Popover`, `Dialog`                                          | Non modal panel, optional arrow, title as name                                                                                             |
| `ProgressBar`                 | `@eylulg/ui/progress-bar`      | `ProgressBar`                                                | Tones, sizes, value label, indeterminate                                                                                                   |
| `RadioGroup`                  | `@eylulg/ui/radio-group`       | `RadioGroup`, `Radio`                                        | Vertical or horizontal, hint, error                                                                                                        |
| `SegmentedControl`            | `@eylulg/ui/segmented-control` | `ToggleButtonGroup`, `ToggleButton`                          | One of a few views (list or board), icons, two sizes, controlled or not                                                                    |
| `Select`                      | `@eylulg/ui/select`            | `Select`, `Popover`, `ListBox`                               | Static or dynamic items, typeahead, hint, error, option `description`, `onKeyDown`, `ref` to the trigger                                   |
| `Skeleton`                    | `@eylulg/ui/skeleton`          | none (static)                                                | text, circle, rect; multi line; reduced motion                                                                                             |
| `Spinner`                     | `@eylulg/ui/spinner`           | none (static)                                                | Decorative or announced with a label, three sizes                                                                                          |
| `Stat`                        | `@eylulg/ui/stat`              | none (static)                                                | `dl` semantics, `sm` and `md`, detail line, trend announced in words, `Sparkline`                                                          |
| `Switch`                      | `@eylulg/ui/switch`            | `Switch`                                                     | Two sizes, hint, `ref` to the input                                                                                                        |
| `Table`                       | `@eylulg/ui/table`             | `Table`, `Column`, `Row`, `Cell`                             | Sortable columns, selection column, sticky header, empty state                                                                             |
| `Tabs`                        | `@eylulg/ui/tabs`              | `Tabs`, `TabList`, `Tab`, `TabPanel`                         | Horizontal or vertical                                                                                                                     |
| `Tag`                         | `@eylulg/ui/tag`               | `TagGroup`, `TagList`, `Tag`                                 | Removable, selectable                                                                                                                      |
| `Textarea`                    | `@eylulg/ui/textarea`          | `TextField`, `TextArea`                                      | Label, hint, error, optional resize, `font="data"`, `autoCapitalize`, `autoCorrect`                                                        |
| `Toast`                       | `@eylulg/ui/toast`             | none (see note)                                              | `ToastProvider` and `useToast`, four variants, `action` button, pause on hover and focus, Escape and focus return                          |
| `Tooltip`                     | `@eylulg/ui/tooltip`           | `TooltipTrigger`, `Tooltip`                                  | Hover and focus, Escape, four placements                                                                                                   |
| `cx`                          | `@eylulg/ui/cx`                |                                                              | `tailwind-merge` based class joiner; imports nothing else, so server components can use it                                                 |

Icons come from [`lucide-react`](https://lucide.dev), which is a peer dependency; the library
re-exports none. Components that take an icon accept a component such as `Plus`.

**A note on Toast.** React Aria's toast API is still exported as `UNSTABLE_`, so Toast is a small
in house implementation: an always present labelled region with a polite live list, and timers
that pause while a toast is hovered or focused. A toast can carry one `action` button, and when a
toast that holds focus closes (action, dismiss button or Escape), focus goes back to the control the
user tabbed in from.

**A note on Card.** An interactive card (`href` or `onPress`) stretches its title link over the
whole card. Actions in `CardHeader` and `CardFooter` stay separate tab stops above it; a control
inside `CardBody` needs `relative z-10` to be clickable.

## App chrome

`@eylulg/ui/chrome` holds the parts every project shares:

| Export            | What it does                                                                                                                                                      | Server safe |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `AppShell`        | Skip link, header, optional sidebar, main landmark, footer; 16px gutter at 375px; `maxWidth` and `contentClassName`                                               | yes         |
| `TopNav`          | Logo and product name, links via any `LinkComponent`, `center`, `actions` and `compactActions` slots, `labels`, mobile menu in a Drawer that loads on first press | client      |
| `SidebarNav`      | Sections, icons, collapsible groups, an optional action per item, arrow keys, Home and End, `aria-current`                                                        | client      |
| `ThemeToggle`     | Light, dark and system, or one icon button with `compact`; `labels`; writes `dark-mode` on `<html>`; persists in localStorage                                     | client      |
| `useTheme`        | `{ theme, resolved, setTheme }` for a command palette or settings page; guards `matchMedia`                                                                       | client      |
| `themeInitScript` | Inline `<head>` script that applies the stored theme before first paint (also `@eylulg/ui/theme-script`)                                                          | yes         |
| `ProjectSwitcher` | DropdownMenu of the projects, current one marked                                                                                                                  | client      |
| `SiteFooter`      | "Part of Eylül Güneş's projects", project links, GitHub, LinkedIn, Built with @eylulg/ui; `labels`, `children` for attributions                                   | yes         |
| `BrandMark`       | The shared monogram, filled with the active brand colour                                                                                                          | yes         |

The project list lives in `@eylulg/ui/projects` (`id`, `name`, `description`, `url`,
`plannedUrl`, `variant`, `repoUrl`). Projects without a deployment have `url: null` and a
Vercel style `plannedUrl` placeholder, and link to their repository until they go live. **These
URLs change when the custom domain arrives.** Pass `projects` to `ProjectSwitcher` or
`SiteFooter` to override the list.

Every chrome part takes a `labels` object for translation, and `useTheme()` lets the app set the
theme from code. `TopNav` loads its mobile menu on first press, so a page that never opens it pays
about 1.6 kB gzip for the bar. In Next.js, server components can import the server safe parts directly. Render `TopNav` from a
small `'use client'` file when you pass `next/link` as `LinkComponent`, because a server component
cannot pass a function to a client component. See [docs/consuming.md](./docs/consuming.md).

## Development

```bash
npm install
npm run storybook        # docs and playground on http://localhost:6006
npm test                 # Vitest, Testing Library, vitest-axe, theme contrast check
npm run typecheck
npm run lint             # ESLint with jsx-a11y and import order, zero warnings
npm run format:check
npm run knip             # unused files, exports and dependencies
npm run build            # dist/ with ESM, type declarations, styles.css and theme files
npm run size             # bundle size budget
npm run build-storybook  # static Storybook in storybook-static/
npm run themes           # regenerate variant scales and CSS from variants.ts
npm run contrast         # print the contrast report for every variant
```

## Contributing

These rules follow the shared engineering standards for all of Eylül's projects.

1. **Conventional Commits are required** and checked by commitlint in a Husky `commit-msg` hook
   and in CI, because semantic-release reads them to choose the next version.
   - `fix(button): keep width while loading` releases a patch.
   - `feat(select): support sections` releases a minor.
   - A `BREAKING CHANGE:` footer, or `!` after the type, releases a major.
   - `docs`, `test`, `chore`, `refactor`, `build` and `ci` do not release.
2. **One folder per component** in `src/components/<Name>/`: `<Name>.tsx`, `<Name>.stories.tsx`,
   `index.ts` and `__tests__/<Name>.test.tsx`. Add the name to `scripts/components.ts`, export it
   from `src/index.ts` and add an entry to `exports` in `package.json`. Shared test helpers live in
   `src/test-utils/`.
3. **Only tests worth having.** Test behaviour this library adds over React Aria (states, rules,
   focus placement, logic), one behaviour per test, states folded into `it.each`, queries by role
   and name. One `expectNoA11yViolations` run per component covers light and dark. No class name,
   DOM structure or pass-through tests.
4. **One story per variant**, so the a11y panel and visual review cover each of them.
5. **Only tokens in components.** Semantic colours (`text-primary`, not `text-gray-900`), radius
   utilities and density utilities, so every theme variant keeps working.
6. A pre-commit hook runs ESLint and Prettier on staged files. CI runs typecheck, lint, format,
   knip, commitlint, tests, both builds, the size budget and a gitleaks secret scan. Dependabot
   opens grouped updates monthly.

## Releases

Pushing to `main` runs `.github/workflows/release.yml`. semantic-release analyses the commits since
the last tag, publishes to npm with provenance, creates a GitHub release, and commits the updated
`CHANGELOG.md` and version back to `main`. The workflow needs an `NPM_TOKEN` repository secret; until
it is added the job skips the release step with a notice and nothing is published.

## License

[MIT](./LICENSE) © Eylül Güneş
