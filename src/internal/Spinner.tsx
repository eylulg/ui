import { LoaderCircle } from 'lucide-react';
import { cx } from '../utils/cx';

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle aria-hidden='true' className={cx('size-4 animate-spin', className)} />;
}
