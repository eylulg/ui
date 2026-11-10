import { useContext, type ReactNode } from 'react';
import { ButtonContext } from 'react-aria-components';
import type { LazyModule } from './lazyModule';

interface PreloadOnIntentProps {
  module: Pick<LazyModule<unknown>, 'preload'>;
  children: ReactNode;
}

/**
 * Starts loading an overlay when a React Aria Button inside it is hovered or
 * focused, so the code has usually arrived by the time the trigger is pressed.
 * A trigger that is not a React Aria Button still loads on press. Inside a
 * component that already provides Button props (a Dialog with `slot="close"`
 * buttons, a Select) nothing is added, so those props keep working.
 */
export function PreloadOnIntent({ module, children }: PreloadOnIntentProps) {
  const inherited = useContext(ButtonContext);
  if (inherited && Object.keys(inherited).length > 0) return children;
  return (
    <ButtonContext.Provider value={{ onHoverStart: module.preload, onFocus: module.preload }}>
      {children}
    </ButtonContext.Provider>
  );
}
