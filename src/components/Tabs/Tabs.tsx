import { useEffect, useRef } from 'react';
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

// Brings the selected tab into view when the list scrolls sideways.
function scrollSelectedIntoView(list: HTMLElement) {
  const tab = list.querySelector('[aria-selected="true"]');
  if (!tab) return;
  const listBox = list.getBoundingClientRect();
  const tabBox = tab.getBoundingClientRect();
  if (tabBox.left < listBox.left) list.scrollLeft -= listBox.left - tabBox.left;
  else if (tabBox.right > listBox.right) list.scrollLeft += tabBox.right - listBox.right;
}

export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  // The tabs mount after the list, so watch for them and for selection changes.
  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const observer = new MutationObserver(() => scrollSelectedIntoView(list));
    observer.observe(list, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-selected'],
    });
    scrollSelectedIntoView(list);
    return () => observer.disconnect();
  }, []);
  return (
    <AriaTabList
      {...props}
      ref={ref}
      className={composeRenderProps(className, (consumer, { orientation }) =>
        cx(
          'flex gap-1',
          orientation === 'vertical'
            ? 'flex-col border-r border-subtle pr-2'
            : '[scrollbar-width:none] overflow-x-auto border-b border-subtle [&::-webkit-scrollbar]:hidden',
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
          'touch-target relative -mb-px shrink-0 cursor-pointer rounded-t-sm border-b-2 border-transparent px-3 py-item-y text-sm font-semibold whitespace-nowrap text-tertiary transition-colors',
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
