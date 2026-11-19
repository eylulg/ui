import { useState, type ReactNode } from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  composeRenderProps,
  type Key,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from 'react-aria-components';
import { focusRing } from '../../internal/focusRing';
import type { IconComponent } from '../../internal/types';
import { cx } from '../../utils/cx';

export type SegmentedControlSize = 'sm' | 'md';

export interface SegmentedControlProps extends Omit<
  ToggleButtonGroupProps,
  'selectionMode' | 'selectedKeys' | 'defaultSelectedKeys' | 'onSelectionChange' | 'children'
> {
  /** Accessible name of the group, such as "View". Required unless `aria-labelledby` is set. */
  'aria-label'?: string;
  /** The chosen segment, for a controlled control. */
  selectedKey?: Key;
  /** The segment chosen at first, for an uncontrolled control. */
  defaultSelectedKey?: Key;
  /** Called with the id of the segment the user chose. One segment is always chosen. */
  onSelectionChange?: (key: Key) => void;
  size?: SegmentedControlSize;
  /** SegmentedControlItem elements. */
  children: ReactNode;
}

export interface SegmentedControlItemProps extends Omit<ToggleButtonProps, 'children' | 'id'> {
  id: Key;
  /** Leading icon component, for example from lucide-react. */
  icon?: IconComponent;
  /** Text of the segment. Without it, pass `aria-label`. */
  children?: ReactNode;
}

const group =
  'group/segmented inline-flex items-center gap-0.5 rounded-md border border-default bg-secondary p-0.5';
const segment = [
  'h-control-sm px-3 text-sm group-data-[size=sm]/segmented:h-control-xs group-data-[size=sm]/segmented:px-2.5 group-data-[size=sm]/segmented:text-xs',
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-sm font-medium whitespace-nowrap text-secondary transition-colors',
  'data-hovered:bg-hover data-hovered:text-primary',
  'data-selected:bg-primary data-selected:text-primary data-selected:shadow-xs',
  'data-disabled:cursor-not-allowed data-disabled:text-disabled',
  focusRing,
].join(' ');

/**
 * A switch between a few views of the same content, such as list or board and
 * write or preview. One segment is always chosen. Tab enters the group, the
 * arrow keys move focus between segments, and Space or Enter chooses the
 * focused one. Use Tabs instead when each choice shows its own panel of content.
 */
export function SegmentedControl({
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  size = 'md',
  className,
  children,
  ...props
}: SegmentedControlProps) {
  const [uncontrolledKey, setUncontrolledKey] = useState(defaultSelectedKey);
  const current = selectedKey ?? uncontrolledKey;

  function handleSelectionChange(keys: Set<Key>) {
    const [next] = keys;
    if (next === undefined || next === current) return;
    setUncontrolledKey(next);
    onSelectionChange?.(next);
  }

  return (
    <ToggleButtonGroup
      {...props}
      data-size={size}
      selectionMode='single'
      disallowEmptySelection
      selectedKeys={current === undefined ? [] : [current]}
      onSelectionChange={handleSelectionChange}
      className={composeRenderProps(className, (consumer) => cx(group, consumer))}
    >
      {children}
    </ToggleButtonGroup>
  );
}

export function SegmentedControlItem({
  icon: Icon,
  children,
  className,
  ...props
}: SegmentedControlItemProps) {
  return (
    <ToggleButton
      {...props}
      className={composeRenderProps(className, (consumer) => cx(segment, consumer))}
    >
      {Icon && <Icon aria-hidden='true' className='size-4 shrink-0' />}
      {children}
    </ToggleButton>
  );
}
