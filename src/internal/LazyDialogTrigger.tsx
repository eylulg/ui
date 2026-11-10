import { DialogTrigger, type DialogTriggerProps } from 'react-aria-components';
import type { LazyModule } from './lazyModule';
import { PreloadOnIntent } from './PreloadOnIntent';

interface LazyDialogTriggerProps extends DialogTriggerProps {
  module: Pick<LazyModule<unknown>, 'preload'>;
}

/** React Aria's DialogTrigger that also preloads the overlay it opens. */
export function LazyDialogTrigger({ module, ...props }: LazyDialogTriggerProps) {
  return (
    <PreloadOnIntent module={module}>
      <DialogTrigger {...props} />
    </PreloadOnIntent>
  );
}
