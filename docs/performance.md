# Performance

Bundle sizes for `@eylulg/ui` and the choices behind them.

## How it is measured

`npm run build && npm run measure` bundles the built package the way a consumer's bundler does
(Rolldown, minified, code splitting on, `react` and `react-dom` external) and prints gzip
kilobytes. "First load" is the entry chunk plus the chunks it imports statically. "Total" adds the
lazy chunks.

`npm run size` (size-limit, esbuild, brotli) enforces budgets in CI. It reports the library's own
code, plus React Aria for the overlay components.

## Sizes (gzip kB)

| Entry                                                                                 | First load |  Total |
| ------------------------------------------------------------------------------------- | ---------: | -----: |
| `@eylulg/ui/button`                                                                   |      23.88 |  23.88 |
| `@eylulg/ui/input`                                                                    |      19.97 |  19.97 |
| `@eylulg/ui/select`                                                                   |      66.61 |  66.61 |
| `@eylulg/ui/table`                                                                    |      71.24 |  71.24 |
| `@eylulg/ui/date-picker`                                                              |      89.86 |  89.86 |
| `@eylulg/ui/chart`                                                                    |      15.17 |  15.17 |
| `@eylulg/ui/dialog`                                                                   |      20.25 |  39.51 |
| `@eylulg/ui/dropdown-menu`                                                            |      49.43 |  60.45 |
| `@eylulg/ui/command-palette`                                                          |       0.95 |  61.38 |
| `@eylulg/ui/chrome`                                                                   |      41.01 |  84.68 |
| Landing page with every chrome part, `Button`, `Input`, `Card`, `Switch` and `Select` |      83.31 |  95.15 |
| The same landing without `Select`                                                     |      44.49 |  86.80 |
| `@eylulg/ui` (the whole index)                                                        |     216.60 | 227.55 |

The overlay entries have a small first load because the overlay code loads later. Each split adds
about 1 kB to the total for the chunk wrapper and the loader. `npm run measure` prints every
entry.

The chart entry has no chart library and no tailwind-merge (it uses `cx-lite`). It includes React
Aria's focus ring hook and prop merging.

## What loads when

| Part                                     | Trigger renders                                              | Overlay code loads                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `Dialog`, `Drawer`, `Popover`            | at once (`DialogTrigger`, `DrawerTrigger`, `PopoverTrigger`) | on hover or focus of the trigger, at the latest when `isOpen` becomes true                                       |
| `DropdownMenu`                           | at once                                                      | same                                                                                                             |
| `Tooltip`                                | at once                                                      | on hover or focus of the trigger, before the delay ends                                                          |
| `CommandPalette`                         | no trigger                                                   | when `isOpen` becomes true; Cmd or Ctrl pressed through `useCommandPaletteShortcut` starts the download early    |
| `ToastProvider`                          | live region at once                                          | the toast markup, about two seconds after mount (so an offline error toast can still show) or on the first toast |
| `ProjectSwitcher`, `ThemeToggle compact` | a plain button                                               | the menu, on hover or focus, at the latest on the first press, which then opens it                               |
| `TopNav` mobile menu                     | menu button                                                  | on the first press                                                                                               |

The first open on a slow connection can take a moment, and it is asynchronous: use
`await screen.findByRole('menu')` in a test, not `getByRole`. A press while the code is loading is
not lost, because the trigger already holds the open state and the overlay appears when the code
arrives. If the download fails (offline), nothing opens and the next press tries again. Later
opens are synchronous, because every instance on the page shares the code.

Preloading on hover and focus works through React Aria's `ButtonContext`, so it covers triggers
that are React Aria buttons (`Button`, `IconButton`). Any other trigger loads on press.

A table with a menu trigger per row costs one context provider and one subscription to a shared
loader per trigger. No chunk is requested per row.

## What did not shrink

- **Select, Combobox, DatePicker, DateRangePicker.** React Aria's `Select` and `ComboBox` build
  their collection from a hidden copy of the popover's `ListBox` at mount, so the list code has to
  be there for the selected value to show. The date pickers import their popover and calendar
  contexts from the same React Aria files as the components. A bundler puts a whole file in one
  chunk, so anything shared by the trigger and the overlay lands in the first load. Splitting them
  would mean rebuilding the triggers on React Aria hooks that use private modules. A page with a
  `Select` pays about 39 kB for it.
- **React Aria's floor.** `Button` alone is 12.35 kB gzip of React Aria (press, focus and hover
  handling that every control shares), plus 8.5 kB of tailwind-merge.
- **`cx` and tailwind-merge.** Every component imports `cx`, because components merge a consumer
  `className` over their defaults. Replacing tailwind-merge inside the components would change
  which class wins, so it stays.
- **Button as a link.** Adding React Aria's `Link` next to `Button` costs 0.7 kB gzip, because the
  press and focus code is shared. A lazy `LinkButton` would cost a request for less than that.

## cx or cx-lite

|                                                               | `@eylulg/ui/cx`                          | `@eylulg/ui/cx-lite`                             |
| ------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| Joins class names, skips falsy values                         | yes                                      | yes                                              |
| Resolves Tailwind conflicts (`px-4` then `px-6` keeps `px-6`) | yes, with tailwind-merge                 | no, both stay                                    |
| Size (gzip)                                                   | 8.70 kB                                  | 0.30 kB                                          |
| Use for                                                       | merging a `className` prop into defaults | conditional classes where no two classes compete |

## Table hydration

On a server rendered page, React Aria's Table removed and recreated its header and body right
after hydration. React Aria names collection nodes without an id from a counter, and the server
and the client counted in a different order, so React replaced the DOM. The first row link then
became a late largest contentful paint candidate that waited on JavaScript.

`TableHeader` and `TableBody` now pass fixed ids, so the server markup is kept. Measured with a
`MutationObserver` on a server rendered Table (`renderToString`, then `hydrateRoot` in Chromium),
the header and body were removed after hydration before the change and nothing was after. A test
hydrates server markup in jsdom and asserts that the same `thead` and `tbody` elements survive.
