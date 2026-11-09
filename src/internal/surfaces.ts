/** Floating surface for popovers, menus and listboxes. */
export const popoverSurface =
  'overflow-auto rounded-lg border border-subtle bg-elevated p-1 text-primary shadow-lg outline-none';

/** A row in a menu, listbox or command list. Sized by the density tokens. */
export const listItem =
  'flex cursor-pointer items-center gap-2 rounded-sm px-item-x py-item-y text-sm text-primary outline-none select-none data-focused:bg-hover data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-focus data-pressed:bg-tertiary data-disabled:cursor-not-allowed data-disabled:text-disabled';

/** Small uppercase heading above a group of list items. */
export const listSectionHeader = 'px-item-x pt-2 pb-1 text-xs font-semibold text-tertiary';

/** A thin divider between groups of list items. */
export const listSeparator = 'mx-1 my-1 h-px bg-(--ui-border-subtle)';
