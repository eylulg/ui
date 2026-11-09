import type { LinkProps } from './types';

/** Default LinkComponent: a plain anchor. */
export function Anchor({ href, children, ...props }: LinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
