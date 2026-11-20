import { useRef } from 'react';
import type { Key } from 'react-aria-components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/DropdownMenu/DropdownMenu';
import { IconButton } from '../components/IconButton/IconButton';
import { useOpenAfterFocus } from '../internal/useLazyMenuTrigger';
import { cx } from '../utils/cx';
import { choices, compactFrame, icons } from './themeChoices';
import type { ThemeToggleLabels } from './ThemeToggle';
import type { ThemePreference } from './useTheme';

interface ThemeToggleMenuProps {
  theme: ThemePreference;
  ariaLabel: string;
  text: ThemeToggleLabels;
  className: string | undefined;
  onSelectionChange: (keys: Set<Key> | 'all') => void;
}

/**
 * The real compact menu behind ThemeToggle. ThemeToggle loads this module on
 * the first press, and the menu opens as soon as it mounts.
 */
export function ThemeToggleMenu({
  theme,
  ariaLabel,
  text,
  className,
  onSelectionChange,
}: ThemeToggleMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useOpenAfterFocus(triggerRef);

  return (
    <DropdownMenu isOpen={isOpen} onOpenChange={setIsOpen}>
      <IconButton
        ref={triggerRef}
        icon={icons[theme]}
        aria-label={ariaLabel}
        variant='tertiary'
        className={cx(compactFrame, className)}
      />
      <DropdownMenuContent
        placement='bottom end'
        selectionMode='single'
        disallowEmptySelection
        selectedKeys={[theme]}
        onSelectionChange={onSelectionChange}
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
