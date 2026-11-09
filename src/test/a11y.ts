import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { configureAxe } from 'vitest-axe';
import { expect } from 'vitest';

export const themes = ['light', 'dark'] as const;
export type Theme = (typeof themes)[number];

/**
 * Components are rendered in isolation, so page level rules (landmarks, a
 * single h1) do not apply. jsdom has no layout engine, so colour contrast
 * cannot be computed here; it is checked in Storybook with addon-a11y.
 */
const axe = configureAxe({
  rules: {
    region: { enabled: false },
    'page-has-heading-one': { enabled: false },
    'landmark-one-main': { enabled: false },
    'color-contrast': { enabled: false },
  },
});

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

/**
 * Renders the element under the light and the dark theme and asserts that axe
 * reports no violations in either. `interact` can open overlays first so their
 * portalled content is part of the audit.
 */
export async function expectNoA11yViolations(
  ui: () => ReactElement,
  interact?: (result: RenderResult) => Promise<void> | void,
) {
  for (const theme of themes) {
    setTheme(theme);
    const result = render(ui());
    await interact?.(result);
    const results = await axe(document.body);
    expect(results, `axe violations in ${theme} theme`).toHaveNoViolations();
    result.unmount();
  }
  setTheme('light');
}
