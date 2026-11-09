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
  'DatePicker',
  'Dialog',
  'Drawer',
  'DropdownMenu',
  'IconButton',
  'Input',
  'Kbd',
  'Pagination',
  'Popover',
  'ProgressBar',
  'RadioGroup',
  'Select',
  'Skeleton',
  'Spinner',
  'Stat',
  'Switch',
  'Table',
  'Tabs',
  'Tag',
  'Textarea',
  'Toast',
  'Tooltip',
] as const;

export type ComponentName = (typeof components)[number];
