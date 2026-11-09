import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  composeRenderProps,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components';
import { focusRing } from '../../internal/focusRing';
import { cx } from '../../utils/cx';

export type TabsProps = AriaTabsProps;

/** Arrow keys move between tabs, Home and End jump to the first and last. */
export function Tabs({ className, ...props }: TabsProps) {
  return (
    <AriaTabs
      {...props}
      className={composeRenderProps(className, (consumer, { orientation }) =>
        cx('flex gap-4', orientation === 'vertical' ? 'flex-row' : 'flex-col', consumer),
      )}
    />
  );
}

export type TabListProps<T extends object> = AriaTabListProps<T>;

export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={composeRenderProps(className, (consumer, { orientation }) =>
        cx(
          'flex gap-1',
          orientation === 'vertical'
            ? 'flex-col border-r border-subtle pr-2'
            : 'border-b border-subtle',
          consumer,
        ),
      )}
    />
  );
}

export type TabProps = AriaTabProps;

export function Tab({ className, ...props }: TabProps) {
  return (
    <AriaTab
      {...props}
      className={composeRenderProps(className, (consumer) =>
        cx(
          'relative -mb-px cursor-pointer rounded-t-sm border-b-2 border-transparent px-3 py-2 text-sm font-semibold text-tertiary transition-colors',
          'data-hovered:text-secondary',
          'data-selected:border-brand data-selected:text-brand',
          'data-disabled:cursor-not-allowed data-disabled:text-disabled',
          focusRing,
          consumer,
        ),
      )}
    />
  );
}

export type TabPanelProps = AriaTabPanelProps;

export function TabPanel({ className, ...props }: TabPanelProps) {
  return (
    <AriaTabPanel
      {...props}
      className={composeRenderProps(className, (consumer) =>
        cx('rounded-md text-sm text-secondary', focusRing, consumer),
      )}
    />
  );
}
