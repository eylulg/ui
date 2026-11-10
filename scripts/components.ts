/**
 * Single source of truth for the public component entry points.
 * Used by the Vite library build and by the package exports check.
 */
export const components = [
  'Avatar',
  'Badge',
  'Breadcrumbs',
  'Button',
  'Card',
  'Checkbox',
  'CodeBlock',
  'Combobox',
  'CommandPalette',
  'DatePicker',
  'Dialog',
  'Drawer',
  'DropdownMenu',
  'EmptyState',
  'IconButton',
  'Input',
  'Kbd',
  'PageHeader',
  'Pagination',
  'Popover',
  'ProgressBar',
  'RadioGroup',
  'SegmentedControl',
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
