import { Monitor, Moon, Sun } from 'lucide-react';
import type { IconComponent } from '../internal/types';
import type { ThemePreference } from './useTheme';

export const icons: Record<ThemePreference, IconComponent> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};
export const choices: ThemePreference[] = ['light', 'dark', 'system'];
