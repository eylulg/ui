/**
 * Single source of truth for the public component entry points.
 * Used by the Vite library build and by the package exports check.
 */
export const components = [
  'Badge',
  'Button',
  'Checkbox',
  'Combobox',
  'CommandPalette',
  'Dialog',
  'Drawer',
  'DropdownMenu',
  'IconButton',
  'Input',
  'Kbd',
  'Popover',
  'ProgressBar',
  'RadioGroup',
  'Select',
  'Skeleton',
  'Spinner',
  'Switch',
  'Tabs',
  'Tag',
  'Textarea',
  'Toast',
  'Tooltip',
] as const;

export type ComponentName = (typeof components)[number];
