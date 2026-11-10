import { Monitor, Moon, Sun } from 'lucide-react';
import { ToggleButton, ToggleButtonGroup, type Key } from 'react-aria-components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/DropdownMenu/DropdownMenu';
import { IconButton } from '../components/IconButton/IconButton';
import { focusRing } from '../internal/focusRing';
import type { IconComponent } from '../internal/types';
import { cx } from '../utils/cx';
import { useTheme, type ThemePreference } from './useTheme';

export interface ThemeToggleLabels {
  light: string;
  dark: string;
  system: string;
  /** Accessible name of the whole control. */
  ariaLabel: string;
}

export interface ThemeToggleProps {
  /** Accessible name of the group. Overrides `labels.ariaLabel`. */
  'aria-label'?: string;
  /** Translated texts. Missing keys keep the English default. */
  labels?: Partial<ThemeToggleLabels>;
  /**
   * One icon button that opens a menu of the three choices, for tight spaces
   * such as the top bar at 375px. The default shows the three choices inline.
   */
  compact?: boolean;
  className?: string;
}

const defaultLabels: ThemeToggleLabels = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
  ariaLabel: 'Colour theme',
};

const icons: Record<ThemePreference, IconComponent> = { light: Sun, dark: Moon, system: Monitor };
const choices: ThemePreference[] = ['light', 'dark', 'system'];

const group = 'inline-flex items-center gap-0.5 rounded-md border border-default bg-primary p-0.5';
const button = [
  'inline-flex size-control-xs min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-sm text-fg-tertiary transition-colors',
  'data-hovered:bg-hover data-hovered:text-fg-secondary',
  'data-selected:bg-tertiary data-selected:text-fg-primary',
  focusRing,
].join(' ');

function isPreference(value: Key | undefined): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Light, dark and system theme switch built on `useTheme`: it writes the
 * `dark-mode` class on <html>, remembers the choice in localStorage and
 * follows the operating system while set to system. Pair it with
 * themeInitScript in <head> so the first paint already has the right theme.
 */
export function ThemeToggle({
  'aria-label': ariaLabelProp,
  labels,
  compact = false,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const text = { ...defaultLabels, ...labels };
  const ariaLabel = ariaLabelProp ?? text.ariaLabel;

  function handleSelectionChange(keys: Set<Key> | 'all') {
    if (keys === 'all') return;
    const [next] = keys;
    if (isPreference(next)) setTheme(next);
  }

  if (compact) {
    return (
      <DropdownMenu>
        <IconButton
          icon={icons[theme]}
          aria-label={ariaLabel}
          variant="tertiary"
          className={className}
        />
        <DropdownMenuContent
          placement="bottom end"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[theme]}
          onSelectionChange={handleSelectionChange}
        >
          {choices.map((id) => (
            <DropdownMenuItem key={id} id={id} icon={icons[id]}>
              {text[id]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[theme]}
      onSelectionChange={handleSelectionChange}
      className={cx(group, className)}
    >
      {choices.map((id) => {
        const Icon = icons[id];
        return (
          <ToggleButton key={id} id={id} aria-label={text[id]} className={button}>
            <Icon aria-hidden="true" className="size-4" />
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
