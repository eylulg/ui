import { ALargeSmall } from 'lucide-react';
import { ToggleButton } from 'react-aria-components';
import { focusRing } from '../internal/focusRing';
import { cx } from '../utils/cx';
import { useTextSize } from './useTextSize';

export interface TextSizeToggleProps {
  /** Accessible name. Defaults to "Compact text". */
  'aria-label'?: string;
  className?: string;
}

const button = [
  'inline-flex size-control-md cursor-pointer items-center justify-center rounded-md border border-default bg-primary text-fg-tertiary transition-colors',
  'data-hovered:bg-hover data-hovered:text-fg-secondary',
  'data-selected:border-brand data-selected:bg-brand-subtle data-selected:text-brand',
  focusRing,
].join(' ');

/**
 * Switches the page between compact and default text, next to ThemeToggle.
 * Pressed means compact. Built on `useTextSize`: it starts from the theme
 * variant's default and remembers the visitor's choice.
 */
export function TextSizeToggle({
  'aria-label': ariaLabel = 'Compact text',
  className,
}: TextSizeToggleProps) {
  const { size, setSize } = useTextSize();

  function handleChange(compact: boolean) {
    setSize(compact ? 'compact' : 'default');
  }

  return (
    <ToggleButton
      aria-label={ariaLabel}
      isSelected={size === 'compact'}
      onChange={handleChange}
      className={cx(button, className)}
    >
      <ALargeSmall aria-hidden='true' className='size-4' />
    </ToggleButton>
  );
}
