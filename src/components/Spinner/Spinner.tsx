import { LoaderCircle } from 'lucide-react';
import { cx } from '../../utils/cx';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /**
   * Announced text, such as "Loading issues". With a label the spinner is a
   * polite status region; without one it is decorative and hidden from
   * assistive technology, so the surrounding UI must convey the state.
   */
  label?: string;
  size?: SpinnerSize;
  className?: string;
}

const sizes: Record<SpinnerSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-8',
};

/* Reduced motion slows the spin rather than stopping it, so progress stays visible. */
const spin = 'shrink-0 animate-spin text-fg-brand motion-reduce:[animation-duration:3s]';

export function Spinner({ label, size = 'md', className }: SpinnerProps) {
  const icon = (
    <LoaderCircle aria-hidden="true" className={cx(spin, sizes[size], !label && className)} />
  );
  if (!label) return icon;
  return (
    <span role="status" className={cx('inline-flex', className)}>
      {icon}
      <span className="sr-only">{label}</span>
    </span>
  );
}
