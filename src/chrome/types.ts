import type { AnchorHTMLAttributes, ComponentType, ReactNode } from 'react';

/**
 * A link component such as Next.js `Link` or React Router's `Link`. It
 * receives `href`, `className`, `aria-current`, `onClick` and `children`.
 * Defaults to a plain `<a>`.
 */
export type LinkProps = Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'className' | 'aria-current' | 'onClick'
> & {
  href: string;
  children?: ReactNode;
};

export type LinkComponent = ComponentType<LinkProps>;

export interface NavLink {
  href: string;
  label: string;
  /** Marks the link as the current page (aria-current="page"). */
  isCurrent?: boolean;
}
