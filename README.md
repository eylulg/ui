# @eylulg/ui

[![CI](https://github.com/eylulg/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/eylulg/ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/storybook-live-ff4785)](https://eylulg.github.io/ui/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

An accessible React 19 component library with a token based theme, light and dark modes, and
per component entry points. Built and maintained by [Eylül Güneş](https://github.com/eylulg).

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
- **Accessibility is tested, not assumed.** Every component has keyboard tests and an axe audit
  in both themes. Storybook runs axe on every story, including colour contrast.

## Install

```bash
npm install @eylulg/ui
```

`react` and `react-dom` 19 are peer dependencies.

## Usage

Import the stylesheet once, at the root of your app:

```tsx
import '@eylulg/ui/styles.css';
```

Then use components from the index or from a per component entry point:

```tsx
import { Button } from '@eylulg/ui/button';
import { Dialog, DialogTrigger } from '@eylulg/ui/dialog';
import { Input } from '@eylulg/ui/input';
import { ToastProvider, useToast } from '@eylulg/ui/toast';

function InviteDialog() {
  const { toast } = useToast();
  return (
    <DialogTrigger>
      <Button>Invite teammate</Button>
      <Dialog
        title="Invite teammate"
        description="They will get an email with a sign in link."
        footer={({ close }) => (
          <>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                toast({ title: 'Invitation sent', variant: 'success' });
                close();
              }}
            >
              Send invite
            </Button>
          </>
        )}
      >
        <Input label="Email" type="email" isRequired />
      </Dialog>
    </DialogTrigger>
  );
}

export function App() {
  return (
    <ToastProvider>
      <InviteDialog />
    </ToastProvider>
  );
}
```

### Dark mode

Add the `dark` class to `<html>` or to any container. Everything inside follows.

```ts
document.documentElement.classList.toggle('dark', prefersDark);
```

### Using the tokens in your own Tailwind 4 app

If your app already runs Tailwind 4, import the tokens instead of the compiled stylesheet and let
your build generate the component classes. This avoids shipping Tailwind's preflight twice.

```css
@import 'tailwindcss';
@import '@eylulg/ui/theme.css';
@source '../node_modules/@eylulg/ui/dist';
```

You then get utilities such as `bg-brand-600`, `text-secondary` and `border-control` in your own
markup.

## Overriding the brand scale

The brand scale is eleven CSS variables, `--color-brand-25` to `--color-brand-950`. Redefine them
after the library stylesheet and every semantic token that uses the brand (primary buttons, focus
rings, selected states, links) follows:

```css
@import '@eylulg/ui/styles.css';

:root {
  --color-brand-50: #fdf2f8;
  --color-brand-100: #fce7f3;
  --color-brand-200: #fbcfe8;
  --color-brand-300: #f9a8d4;
  --color-brand-400: #f472b6;
  --color-brand-500: #ec4899;
  --color-brand-600: #db2777;
  --color-brand-700: #be185d;
  --color-brand-800: #9d174d;
  --color-brand-900: #831843;
}
```

Keep `brand-600` and `brand-700` at a contrast ratio of at least 4.5:1 against white, because
primary buttons and brand text rely on them. To change a single decision rather than the whole
scale, override the semantic variable instead, for example
`:root { --ui-bg-brand-solid: var(--color-brand-700); }`.

The full token reference, with swatches for both themes, is on the
[Introduction page](https://eylulg.github.io/ui/?path=/docs/introduction--docs) of the Storybook.

## Components

| Component    | Import                   | Built on (React Aria)                              | Highlights                                                                                 |
| ------------ | ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `Button`     | `@eylulg/ui/button`      | `Button`                                           | primary, secondary, tertiary, destructive; sm, md, lg; loading; leading and trailing icons |
| `IconButton` | `@eylulg/ui/icon-button` | `Button`                                           | Required `aria-label`, same variants, loading                                              |
| `Input`      | `@eylulg/ui/input`       | `TextField`, `Input`, `Group`                      | Label, hint, error, leading and trailing icons, two sizes                                  |
| `Textarea`   | `@eylulg/ui/textarea`    | `TextField`, `TextArea`                            | Label, hint, error, optional resize                                                        |
| `Select`     | `@eylulg/ui/select`      | `Select`, `Popover`, `ListBox`                     | Static or dynamic items, typeahead, label, hint, error                                     |
| `Checkbox`   | `@eylulg/ui/checkbox`    | `Checkbox`                                         | Indeterminate, hint, invalid                                                               |
| `RadioGroup` | `@eylulg/ui/radio-group` | `RadioGroup`, `Radio`                              | Vertical or horizontal, roving focus, hint, error                                          |
| `Switch`     | `@eylulg/ui/switch`      | `Switch`                                           | Two sizes, hint                                                                            |
| `Badge`      | `@eylulg/ui/badge`       | none (static)                                      | gray, brand, success, warning, error; dot; icon                                            |
| `Tag`        | `@eylulg/ui/tag`         | `TagGroup`, `TagList`, `Tag`                       | Removable with button or Delete and Backspace, selectable                                  |
| `Tooltip`    | `@eylulg/ui/tooltip`     | `TooltipTrigger`, `Tooltip`, `OverlayArrow`        | Opens on hover and focus, closes on Escape, four placements                                |
| `Toast`      | `@eylulg/ui/toast`       | none (see note)                                    | `ToastProvider` and `useToast`, four variants, pause on hover and focus                    |
| `Dialog`     | `@eylulg/ui/dialog`      | `DialogTrigger`, `ModalOverlay`, `Modal`, `Dialog` | Focus trap and restore, `alertdialog` role, three sizes                                    |
| `Tabs`       | `@eylulg/ui/tabs`        | `Tabs`, `TabList`, `Tab`, `TabPanel`               | Horizontal or vertical, arrow keys, Home and End                                           |
| `Skeleton`   | `@eylulg/ui/skeleton`    | none (static)                                      | text, circle, rect; multi line; respects reduced motion                                    |
| `cx`         | `@eylulg/ui/cx`          |                                                    | `tailwind-merge` based class joiner, last class wins                                       |

Icons come from [`lucide-react`](https://lucide.dev). Any component that accepts an icon takes a
component such as `Plus` from `lucide-react`, or any component that accepts SVG props.

**A note on Toast.** React Aria's toast API is still exported as `UNSTABLE_` and may change in a
minor release, so the Toast here is a small in house implementation: a labelled region that is
always in the DOM with a polite live list inside, so screen readers announce each toast as it
appears, and timers that pause while a toast is hovered or focused. It can move to React Aria
once that API is stable.

## Development

```bash
npm install
npm run storybook        # docs and playground on http://localhost:6006
npm test                 # Vitest, Testing Library, vitest-axe
npm run typecheck
npm run lint
npm run build            # dist/ with ESM, type declarations and styles.css
npm run size             # bundle size budget
npm run build-storybook  # static Storybook in storybook-static/
```

## Contributing

1. **Conventional Commits are required.** Releases are fully automated by semantic-release, which
   reads commit messages to choose the next version and write the changelog.
   - `fix(button): keep width while loading` releases a patch.
   - `feat(select): support sections` releases a minor.
   - A `BREAKING CHANGE:` footer, or `!` after the type, releases a major.
   - `docs`, `test`, `chore`, `refactor`, `build` and `ci` do not release.
2. **One folder per component** in `src/components/<Name>/` with exactly these files:
   `<Name>.tsx`, `<Name>.stories.tsx`, `<Name>.test.tsx` and `index.ts`. Add the name to
   `scripts/components.ts`, export it from `src/index.ts` and add an entry to `exports` in
   `package.json`.
3. **One test file per component.** It must cover rendering, keyboard interaction where the
   component is interactive, and `expectNoA11yViolations`, which runs axe in light and dark.
4. **One story per variant**, so the a11y panel and visual review cover each of them.
5. **Only semantic tokens in components.** Use `text-primary` rather than `text-gray-900`, so that
   themes keep working.
6. Run `npm run typecheck && npm run lint && npm test` before opening a pull request. CI runs the
   same checks plus both builds and the size budget.

## Releases

Pushing to `main` runs `.github/workflows/release.yml`. semantic-release analyses the commits since
the last tag, publishes to npm with provenance, creates a GitHub release, and commits the updated
`CHANGELOG.md` and version back to `main`. The workflow needs an `NPM_TOKEN` repository secret; until
it is added the job skips the release step with a notice and nothing is published.

## License

[MIT](./LICENSE) © Eylül Güneş
