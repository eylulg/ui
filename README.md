# @eylulg/ui

[![CI](https://github.com/eylulg/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/eylulg/ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

The component library behind all of [Eylül's projects](https://eylulg.github.io/): React 19
components built on React Aria Components, Tailwind CSS 4 design tokens, nine theme variants and
the shared page chrome (top nav, project switcher, theme toggle, footer).

Storybook: https://eylulg.github.io/ui/

## Decisions

- **React Aria Components for behaviour.** Keyboard handling, focus and ARIA come from React Aria,
  so this library only adds the API and the styling. The cost is React Aria's size: a `Button`
  carries about 12 kB gzip of it ([performance](./docs/performance.md)).
- **Tailwind 4 tokens for theming.** Components use semantic tokens (`text-primary`,
  `bg-elevated`, `border-control`) that point at colour scales. Dark mode and a new brand colour
  mean redefining variables, not changing components.
- **A variant changes colour only.** Each project imports one variant file. Fonts, density, shape
  and spacing are the same everywhere. A test checks WCAG AA for every text token in light and
  dark, in every variant.
- **Overlays load on first open.** Menus, dialogs, drawers, popovers, tooltips and the command
  palette fetch their code when the trigger is hovered, focused or pressed. The cost is a short
  wait on a slow first open.
- **Accessibility is tested.** Each component has an axe run in light and dark, and Storybook
  runs axe on every story.

## Install

```bash
npm install @eylulg/ui react-aria-components lucide-react
```

`react`, `react-dom` (19) and `lucide-react` are peer dependencies. The fonts (Inter, Manrope,
JetBrains Mono) ship with the package. [docs/consuming.md](./docs/consuming.md) covers Vite,
Next.js and linking a local checkout.

## Usage

In an app that runs Tailwind 4, import the tokens and one variant into your own Tailwind entry:

```css
@import 'tailwindcss';
@import '@eylulg/ui/theme.css';
@import '@eylulg/ui/themes/workspace.css';
@source '../node_modules/@eylulg/ui/dist';
```

Without Tailwind, import the compiled stylesheet and a variant once at the root:

```ts
import '@eylulg/ui/styles.css';
import '@eylulg/ui/themes/workspace.css';
```

`@eylulg/ui/tokens.css` is a third option: custom properties only, for apps that style themselves.
`@eylulg/ui/fonts.css` loads the bundled fonts; without it the themes fall back to the system font.

Import components from a per component entry point or from the index:

```tsx
import { Button } from '@eylulg/ui/button';
import { Dialog, DialogTrigger } from '@eylulg/ui/dialog';
import { Input } from '@eylulg/ui/input';

export function InviteDialog() {
  return (
    <DialogTrigger>
      <Button>Invite teammate</Button>
      <Dialog
        title='Invite teammate'
        footer={({ close }) => <Button onPress={close}>Send invite</Button>}
      >
        <Input label='Email' type='email' isRequired />
      </Dialog>
    </DialogTrigger>
  );
}
```

Dark mode is class based. `ThemeToggle` writes `dark-mode` on `<html>`; `dark` works too, on
`<html>` or any container. Put `themeInitScript` in `<head>` to avoid a flash of the wrong theme.

## Theme variants

Import exactly one, after `theme.css`.

| Variant          | Import                                 | Project               | Colour     | Light     | Dark      |
| ---------------- | -------------------------------------- | --------------------- | ---------- | --------- | --------- |
| `portfolio`      | `@eylulg/ui/themes/portfolio.css`      | Portfolio             | Green      | `#446c2b` | `#97bf82` |
| `workspace`      | `@eylulg/ui/themes/workspace.css`      | Workspace             | Slate blue | `#3f6fb6` | `#8cb2eb` |
| `review`         | `@eylulg/ui/themes/review.css`         | Review Companion      | Eucalyptus | `#177360` | `#8ad0bc` |
| `control-room`   | `@eylulg/ui/themes/control-room.css`   | Agent Workflows       | Clay       | `#b8583e` | `#e8a58c` |
| `watchlist`      | `@eylulg/ui/themes/watchlist.css`      | Watchlist             | Rose       | `#af5275` | `#ed99b6` |
| `tokens`         | `@eylulg/ui/themes/tokens.css`         | Tokens to Tailwind    | Iris       | `#7766b6` | `#b8aded` |
| `plain-language` | `@eylulg/ui/themes/plain-language.css` | Plain Language Add-in | Sea glass  | `#2d7787` | `#81b6c3` |
| `sudoku`         | `@eylulg/ui/themes/sudoku.css`         | Sudoku                | Ink        | `#293647` | `#c4d2e5` |
| `assistant`      | `@eylulg/ui/themes/assistant.css`      | Assistant Studio      | Plum       | `#824d85` | `#deb0e0` |

- **Seeds.** Each variant has one seed per mode. The brand scale (`--color-brand-25` to `950`) is
  generated from it in oklch, with the same lightness at each step. `npm run themes` regenerates
  the CSS from `src/styles/themes/variants.ts`.
- **Contrast.** `npm run contrast` checks text tokens at 4.5:1 and icons, solid fills, control
  borders, focus rings, the logo and chart series at 3:1, in light and dark, for every variant.
- **Switching live.** `@eylulg/ui/themes/all.css` scopes every variant to
  `[data-ui-variant="<name>"]`, so a page can switch variants by changing one attribute.
- **Typed matrix.** `import { variants, variantNames } from '@eylulg/ui/themes'` returns the seeds
  and scales.
- **Own brand.** To change one decision instead of a variant, set `--color-brand-seed` and
  `--color-brand-seed-dark` after the library CSS. Keep the light seed at 4.5:1 against white and
  the dark seed at 4.5:1 against the dark page.

## Components

| Component                     | Import                         | Notes                                                                                              |
| ----------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `Avatar`                      | `@eylulg/ui/avatar`            | Image with initials fallback, status, sizes, `AvatarGroup`                                         |
| `Badge`                       | `@eylulg/ui/badge`             | Ten colours, dot, icon                                                                             |
| `Breadcrumbs`                 | `@eylulg/ui/breadcrumbs`       | Current page, router links                                                                         |
| `Button`                      | `@eylulg/ui/button`            | Five variants, three sizes, loading, icons, renders a link with `href`, `buttonStyles()`           |
| `Card`                        | `@eylulg/ui/card`              | Header, body and footer slots, interactive card as one link or button                              |
| `Charts`                      | `@eylulg/ui/chart`             | `LineChart`, `BarChart`, `HeatGrid`, `ChartLegend` in plain SVG (see below)                        |
| `Checkbox`                    | `@eylulg/ui/checkbox`          | Indeterminate, hint, invalid                                                                       |
| `CodeBlock`                   | `@eylulg/ui/code-block`        | Labelled, keyboard scrollable, optional copy button                                                |
| `Combobox`                    | `@eylulg/ui/combobox`          | Async loading, sections, empty state                                                               |
| `CommandPalette`              | `@eylulg/ui/command-palette`   | Search, groups, shortcuts, `useCommandPaletteShortcut`, nested pages                               |
| `DatePicker, DateRangePicker` | `@eylulg/ui/date-picker`       | Segmented input, calendar popover                                                                  |
| `Dialog`                      | `@eylulg/ui/dialog`            | Focus trap and restore, `alertdialog` role, three sizes                                            |
| `Drawer`                      | `@eylulg/ui/drawer`            | Left, right or bottom sheet                                                                        |
| `DropdownMenu`                | `@eylulg/ui/dropdown-menu`     | Sections, checkbox and radio items, shortcuts, submenus                                            |
| `EmptyState`                  | `@eylulg/ui/empty-state`       | Icon, title, description, actions                                                                  |
| `FileDropZone`                | `@eylulg/ui/file-drop-zone`    | Drop or pick files, accepted types checked on both paths                                           |
| `IconButton`                  | `@eylulg/ui/icon-button`       | Requires `aria-label`                                                                              |
| `Input`                       | `@eylulg/ui/input`             | Label, hint, error, icons                                                                          |
| `Kbd`                         | `@eylulg/ui/kbd`               | Keys and key combinations                                                                          |
| `PageHeader`                  | `@eylulg/ui/page-header`       | Title, description, actions, breadcrumbs                                                           |
| `Pagination`                  | `@eylulg/ui/pagination`        | Buttons, or links with `getPageHref`                                                               |
| `Popover`                     | `@eylulg/ui/popover`           | Non modal panel                                                                                    |
| `ProgressBar`                 | `@eylulg/ui/progress-bar`      | Tones, value label, indeterminate                                                                  |
| `RadioGroup`                  | `@eylulg/ui/radio-group`       | Vertical or horizontal                                                                             |
| `SegmentedControl`            | `@eylulg/ui/segmented-control` | One of a few views, icons                                                                          |
| `Select`                      | `@eylulg/ui/select`            | Static or dynamic items, typeahead, option descriptions                                            |
| `Skeleton`                    | `@eylulg/ui/skeleton`          | Text, circle and rectangle                                                                         |
| `Spinner`                     | `@eylulg/ui/spinner`           | Decorative, or announced with a label                                                              |
| `Stat`                        | `@eylulg/ui/stat`              | Value, detail line, trend announced in words, `Sparkline`                                          |
| `Switch`                      | `@eylulg/ui/switch`            | Two sizes, hint                                                                                    |
| `Table`                       | `@eylulg/ui/table`             | Sortable columns, row selection, sticky header, empty state                                        |
| `Tabs`                        | `@eylulg/ui/tabs`              | Horizontal or vertical                                                                             |
| `Tag`                         | `@eylulg/ui/tag`               | Removable, selectable                                                                              |
| `Textarea`                    | `@eylulg/ui/textarea`          | Label, hint, error, optional resize                                                                |
| `Toast`                       | `@eylulg/ui/toast`             | `ToastProvider` and `useToast`, four variants, one `action` button                                 |
| `Tooltip`                     | `@eylulg/ui/tooltip`           | Hover and focus, Escape, four placements                                                           |
| `cx`                          | `@eylulg/ui/cx`                | Class joiner that resolves Tailwind conflicts with tailwind-merge; `@eylulg/ui/cx-lite` skips that |

Icons come from `lucide-react`, a peer dependency. Components that take an icon accept the
component itself, for example `Plus`. The library re-exports none.

**Toast.** React Aria's toast API is still exported as `UNSTABLE_`, so Toast is built in this
library: a labelled region with a polite live list. Timers pause while a toast is hovered or
focused. When a toast that holds focus closes, focus returns to the control you came from.

**Card.** An interactive card (`href` or `onPress`) stretches its title link over the whole card.
Actions in `CardHeader` and `CardFooter` stay separate tab stops. A control inside `CardBody`
needs `relative z-10` to be clickable.

## Charts

`@eylulg/ui/chart` draws with plain SVG and has no chart library behind it.

```tsx
import { LineChart } from '@eylulg/ui/chart';

<LineChart
  title='Requests per day'
  x={days}
  series={[
    { id: 'chat', label: 'Chat', values: chat },
    { id: 'search', label: 'Search', values: search },
  ]}
  locale='en-GB'
/>;
```

- Series colours are `--ui-chart-1` to `--ui-chart-6`. They are the same in every variant and
  checked at 3:1 against every surface. Past six series, the rest share a muted colour and differ
  by marker shape and dash.
- Each chart is a named figure with a generated summary. Tab enters the plot once, arrow keys,
  Home and End move between points, and Escape closes the tooltip. The data is also a table behind
  a "Show table" button.
- Charts take the width of their container. Numbers and dates go through `Intl` with `locale`.

## App chrome

`@eylulg/ui/chrome` holds the parts every project shares.

| Export            | What it does                                                                                                      | Server safe |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| `AppShell`        | Skip link, header, optional sidebar, main landmark, footer; `maxWidth` and `contentClassName`                     | yes         |
| `TopNav`          | Logo and product name, links via any `LinkComponent`, `center`, `actions` and `compactActions` slots, mobile menu | no          |
| `SidebarNav`      | Sections, collapsible groups, an optional action per item, arrow keys, `aria-current`                             | no          |
| `ThemeToggle`     | Light, dark and system, or one icon button with `compact`; stores the choice in localStorage                      | no          |
| `useTheme`        | `{ theme, resolved, setTheme }` for a command palette or settings page                                            | no          |
| `themeInitScript` | Inline script for `<head>` that applies the stored theme before first paint (also `@eylulg/ui/theme-script`)      | yes         |
| `ProjectSwitcher` | Menu of the projects, current one marked                                                                          | no          |
| `SiteFooter`      | One band: project links, GitHub and LinkedIn, a line about the code and the library; `children` for attributions  | yes         |
| `BrandLogo`       | The EG horse logo, in the brand green in every theme. Default logo of `TopNav`                                    | no          |
| `BrandMark`       | The "eg" monogram in the active brand colour                                                                      | yes         |
| `BrandLoader`     | An animated loading mark                                                                                          | no          |

The project list is `projects` in `@eylulg/ui/projects` (`id`, `name`, `description`, `url`,
`plannedUrl`, `variant`, `repoUrl`). `ProjectSwitcher` and `SiteFooter` read it, and both accept a
`projects` prop to replace it. A project with `url: null` links to its repository. Every chrome
part takes a `labels` object for translation; missing keys keep the English text.

## Development

```bash
npm install
npm run storybook        # http://localhost:6006
npm test                 # Vitest, Testing Library, vitest-axe, theme contrast check
npm run typecheck && npm run lint && npm run format:check
npm run knip             # unused files, exports and dependencies
npm run build            # dist/ with ESM, types, styles.css and theme files
npm run size             # bundle size budget
```

## Contributing

1. Commits follow Conventional Commits. commitlint checks them in a Husky hook and in CI, and
   semantic-release reads them to pick the version.
2. A component lives in `src/components/<Name>/` with `<Name>.tsx`, `<Name>.stories.tsx`,
   `index.ts` and `__tests__/<Name>.test.tsx`. Add its name to `scripts/components.ts`, export it
   from `src/index.ts` and add an entry to `exports` in `package.json`.
3. Tests cover behaviour this library adds over React Aria: states, rules, focus placement, logic.
   One behaviour per test, queries by role and name, one axe run per component.
4. Components use semantic tokens only (`text-primary`, not `text-gray-900`), so every variant
   keeps working.
5. CI runs typecheck, lint, format, knip, commitlint, tests, both builds, the size budget and a
   gitleaks scan. Dependabot opens grouped updates monthly.

## Releases

semantic-release runs on pushes to `main`: it tags, publishes to npm with provenance, creates a
GitHub release and updates `CHANGELOG.md`. The latest version on npm is 1.2.0. Releases are paused
for now.

## License

[MIT](./LICENSE) © Eylül Güneş
