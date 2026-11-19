# Performance

Numbers for `@eylulg/ui`, how they were measured and what did and did not shrink.

## How it is measured

`npm run build && npm run measure` bundles the built package the way a consumer's bundler does (Rolldown, the bundler behind Vite, minified, code splitting on, `react` and `react-dom` external, everything else included) and prints gzip kilobytes. "First load" is the entry chunk plus every chunk it imports statically. "Total" adds the lazy chunks. The consumer landing is a page with `TopNav`, `ProjectSwitcher`, `ThemeToggle`, `SiteFooter`, `Button`, `Input`, `Card`, `Switch` and `Select`. Before numbers come from the commit before this pass, built and measured with the same script.

`npm run size` (size-limit, esbuild, brotli) guards the same entries in CI. It reports first load with React Aria included for the overlay components, and the library's own code for the rest.

## Before and after (gzip kB)

| Entry                                                                                                    | First load before | First load after |  Delta | Total before | Total after |
| -------------------------------------------------------------------------------------------------------- | ----------------: | ---------------: | -----: | -----------: | ----------: |
| @eylulg/ui/avatar                                                                                        |              9.48 |             9.48 |  +0.00 |         9.48 |        9.48 |
| @eylulg/ui/badge                                                                                         |              9.13 |             9.13 |  +0.00 |         9.13 |        9.13 |
| @eylulg/ui/breadcrumbs                                                                                   |             20.56 |            20.56 |  +0.00 |        20.56 |       20.56 |
| @eylulg/ui/button                                                                                        |             23.82 |            23.84 |  +0.02 |        23.82 |       23.84 |
| @eylulg/ui/card                                                                                          |             22.26 |            22.26 |  +0.00 |        22.26 |       22.26 |
| @eylulg/ui/chart                                                                                         |               n/a |            15.13 |    new |          n/a |       15.13 |
| @eylulg/ui/checkbox                                                                                      |             24.39 |            24.39 |  +0.00 |        24.39 |       24.39 |
| @eylulg/ui/chrome                                                                                        |             68.65 |            36.31 | -32.34 |        71.72 |       79.89 |
| @eylulg/ui/code-block                                                                                    |             23.43 |            23.46 |  +0.03 |        23.43 |       23.46 |
| @eylulg/ui/combobox                                                                                      |             71.40 |            71.40 |  +0.00 |        71.40 |       71.40 |
| @eylulg/ui/command-palette                                                                               |             60.73 |             0.92 | -59.81 |        60.73 |       61.34 |
| @eylulg/ui/date-picker                                                                                   |             89.83 |            89.83 |  +0.00 |        89.83 |       89.83 |
| @eylulg/ui/dialog                                                                                        |             37.52 |            20.21 | -17.31 |        37.52 |       39.46 |
| @eylulg/ui/drawer                                                                                        |             37.70 |            20.22 | -17.48 |        37.70 |       39.63 |
| @eylulg/ui/dropdown-menu                                                                                 |             59.49 |            49.40 | -10.09 |        59.49 |       60.42 |
| @eylulg/ui/empty-state                                                                                   |              9.06 |             9.06 |  +0.00 |         9.06 |        9.06 |
| @eylulg/ui/file-drop-zone                                                                                |             48.71 |            48.76 |  +0.05 |        48.71 |       48.76 |
| @eylulg/ui/icon-button                                                                                   |             22.86 |            22.85 |  -0.01 |        22.86 |       22.85 |
| @eylulg/ui/input                                                                                         |             19.93 |            19.93 |  +0.00 |        19.93 |       19.93 |
| @eylulg/ui/kbd                                                                                           |              8.89 |             8.89 |  +0.00 |         8.89 |        8.89 |
| @eylulg/ui/page-header                                                                                   |              8.97 |             8.97 |  +0.00 |         8.97 |        8.97 |
| @eylulg/ui/pagination                                                                                    |             23.89 |            23.89 |  +0.00 |        23.89 |       23.89 |
| @eylulg/ui/popover                                                                                       |             33.88 |            25.46 |  -8.42 |        33.88 |       34.49 |
| @eylulg/ui/progress-bar                                                                                  |             13.63 |            13.63 |  +0.00 |        13.63 |       13.63 |
| @eylulg/ui/projects                                                                                      |              0.93 |             0.93 |  +0.00 |         0.93 |        0.93 |
| @eylulg/ui/radio-group                                                                                   |             26.14 |            26.14 |  +0.00 |        26.14 |       26.14 |
| @eylulg/ui/segmented-control                                                                             |             23.36 |            23.36 |  +0.00 |        23.36 |       23.36 |
| @eylulg/ui/select                                                                                        |             66.57 |            66.57 |  +0.00 |        66.57 |       66.57 |
| @eylulg/ui/skeleton                                                                                      |              8.90 |             8.90 |  +0.00 |         8.90 |        8.90 |
| @eylulg/ui/spinner                                                                                       |             10.41 |            10.41 |  +0.00 |        10.41 |       10.41 |
| @eylulg/ui/stat                                                                                          |             11.12 |            11.12 |  +0.00 |        11.12 |       11.12 |
| @eylulg/ui/switch                                                                                        |             22.54 |            22.54 |  +0.00 |        22.54 |       22.54 |
| @eylulg/ui/table                                                                                         |             71.16 |            71.19 |  +0.03 |        71.16 |       71.19 |
| @eylulg/ui/tabs                                                                                          |             38.76 |            38.76 |  +0.00 |        38.76 |       38.76 |
| @eylulg/ui/tag                                                                                           |             53.55 |            53.55 |  +0.00 |        53.55 |       53.55 |
| @eylulg/ui/textarea                                                                                      |             19.66 |            19.66 |  +0.00 |        19.66 |       19.66 |
| @eylulg/ui/theme-script                                                                                  |              0.40 |             0.40 |  +0.00 |         0.40 |        0.40 |
| @eylulg/ui/themes                                                                                        |              3.17 |             3.17 |  +0.00 |         3.17 |        3.17 |
| @eylulg/ui/toast                                                                                         |             25.43 |             9.55 | -15.88 |        25.43 |       26.14 |
| @eylulg/ui/tooltip                                                                                       |             21.89 |            13.61 |  -8.28 |        21.89 |       22.45 |
| @eylulg/ui                                                                                               |            210.13 |           206.65 |  -3.48 |       210.13 |      217.70 |
| Consumer landing (TopNav, ProjectSwitcher, ThemeToggle, SiteFooter, Button, Input, Card, Switch, Select) |             80.87 |            79.84 |  -1.03 |        83.94 |       91.63 |
| Same landing without Select                                                                              |             71.84 |            41.14 | -30.70 |        74.91 |       83.43 |
| { Button } from index                                                                                    |             23.68 |            23.68 |  +0.00 |        23.68 |       23.68 |

First load drops where an overlay used to ride along with its trigger: the chrome entry 68.7 to 36.3 kB, command palette 60.7 to 0.9, dialog 37.5 to 20.2, drawer 37.7 to 20.2, toast 25.4 to 9.6, tooltip 21.9 to 13.6, popover 33.9 to 25.5, dropdown menu 59.5 to 49.4. Total rises by about 1 kB per split entry for the extra chunk wrapper and the loader. A landing without a `Select` goes from 71.8 to 41.1 kB.

The chart entry is new in this pass: 15.1 kB gzip for all three charts, legend, tooltip and table together, with no overlay split. It holds no chart library and no tailwind-merge (it uses cx-lite); it does include React Aria's focus ring hook and prop merging. A page that imports only `LineChart` pays 9.2 kB brotli of the library's own code plus those hooks (`npm run size`).

## What loads when

| Part                                     | Trigger renders                                              | Overlay code loads                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `Dialog`, `Drawer`, `Popover`            | at once (`DialogTrigger`, `DrawerTrigger`, `PopoverTrigger`) | on hover or focus of the trigger, at the latest when `isOpen` becomes true                                       |
| `DropdownMenu`                           | at once                                                      | same                                                                                                             |
| `Tooltip`                                | at once                                                      | on hover or focus of the trigger, before the delay ends                                                          |
| `CommandPalette`                         | no trigger                                                   | when `isOpen` becomes true; Cmd or Ctrl pressed through `useCommandPaletteShortcut` starts the download early    |
| `ToastProvider`                          | live region at once                                          | the toast markup, about two seconds after mount (so an offline error toast can still show) or on the first toast |
| `ProjectSwitcher`, `ThemeToggle compact` | a plain button                                               | the menu, on hover or focus, at the latest on the first press, which then opens it                               |
| `TopNav` mobile menu                     | menu button                                                  | on the first press (unchanged)                                                                                   |

The first open on a slow connection can therefore take a moment, and opening is asynchronous on that first open: `await screen.findByRole('menu')` in a test, not `getByRole`. A press while the code is still loading is not lost: the trigger already holds the open state, and the overlay appears when the code arrives. If the download fails (offline), nothing opens and the next press tries again. The second open is synchronous because the code is shared by every instance on the page.

Preloading on hover and focus works through React Aria's `ButtonContext`, so it covers triggers that are React Aria buttons (`Button`, `IconButton`). A trigger that is something else loads on press. Nothing is added when the trigger already sits inside a component that provides Button props (a `Dialog` with `slot="close"` buttons).

### Many triggers on one page

A row of menu triggers (a table with a menu per row) costs one context provider and one subscription to a shared loader per trigger. No chunk is requested per row: the first hover, focus or open fetches one module for the whole page. `DropdownMenuItem` elements inside a closed menu are created by your render but not rendered.

## What did not shrink, and why

- **Select, Combobox, DatePicker, DateRangePicker.** React Aria's `Select` and `ComboBox` build their collection from a hidden copy of the popover's `ListBox` at mount, so the list code must exist for the selected value to show. The date pickers import their popover and calendar contexts from the same React Aria module files as the components themselves. Bundlers assign a whole module file to one chunk, so any file used by both the trigger and the overlay lands in the first-load chunk with everything either side needs. Splitting them needs the triggers rebuilt on React Aria hooks, which use private React Aria modules today. A landing with a `Select` still pays about 39 kB for it (the `Select` itself, the list and the popover), which is why the landing with `Select` moved by 1 kB only.
- **React Aria's floor.** `Button` alone is 12.4 kB gzip of React Aria (press, focus and hover handling shared by every control), plus 8.5 kB of tailwind-merge. Every control pays this once.
- **`cx` and tailwind-merge.** tailwind-merge is 8.5 kB gzip and every component imports `cx`, because components merge a consumer `className` over their defaults. Replacing it inside the components would change which class wins, so `cx` stays. Consumers who only join classes in their own markup can use `@eylulg/ui/cx-lite` (93 B). The library's own components still carry tailwind-merge.
- **Button link form.** Pulling React Aria's `Link` in next to `Button` adds 0.7 kB gzip (12.35 to 13.06 kB measured with the plain bundle), because the press and focus code is shared. A lazy `LinkButton` would cost a request for less than that, so `Button` with `href` is unchanged.

## cx or cx-lite

|                                                               | `@eylulg/ui/cx`                                                           | `@eylulg/ui/cx-lite`                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Joins class names, skips falsy values                         | yes                                                                       | yes                                                                 |
| Resolves Tailwind conflicts (`px-4` then `px-6` keeps `px-6`) | yes, with tailwind-merge                                                  | no, both stay                                                       |
| Size                                                          | 8.5 kB gzip                                                               | 93 B                                                                |
| Use for                                                       | merging a `className` prop into defaults, anywhere a later class must win | conditional classes in your own markup where no two classes compete |

## Table hydration

On a server rendered page, React Aria's Table removed and recreated its header and body right after hydration. React Aria names every collection node without an id from a counter in its own document; the server and the client count in a different order, so the header and body got new keys and React replaced their DOM. The first row link then became a late largest contentful paint candidate that waited on JavaScript.

`TableHeader` and `TableBody` now pass fixed ids, so the server markup is adopted as is. Measured with a `MutationObserver` on a server rendered Table (`renderToString` on the server, `hydrateRoot` in Chromium, 2 columns and 2 rows, and again with selection, `items` and `columns`):

|        | Nodes removed after hydration |
| ------ | ----------------------------- |
| Before | `THEAD`, `TBODY`              |
| After  | none                          |

A regression test hydrates server markup in jsdom and asserts that the same `thead` and `tbody` elements survive. Rows and cells were not recreated in either test.
