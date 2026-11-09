import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { Drawer, DrawerTrigger } from '../components/Drawer/Drawer';
import { IconButton } from '../components/IconButton/IconButton';
import { Anchor } from './Anchor';
import { BrandMark } from './BrandMark';
import type { LinkComponent, NavLink } from './types';

export interface TopNavProps {
  productName: string;
  /** Logo before the product name. Defaults to the shared BrandMark. */
  logo?: ReactNode;
  /** Where the logo and product name link to. */
  homeHref?: string;
  links?: NavLink[];
  /** Your router's link, such as Next.js `Link` or React Router's `Link`. */
  LinkComponent?: LinkComponent;
  /** Right hand slot, usually ProjectSwitcher and ThemeToggle. */
  actions?: ReactNode;
  /** Extra content for the mobile menu, such as the app's SidebarNav. */
  mobileMenu?: ReactNode;
  /** Accessible name of the primary navigation. */
  navLabel?: string;
}

const header = 'sticky top-0 z-40 border-b border-subtle bg-primary/90 backdrop-blur';
const bar = 'mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8';
const brand = [
  'flex min-w-0 items-center gap-2 rounded-md font-display text-md font-semibold text-primary',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
].join(' ');
const desktopNav = 'ml-4 hidden md:block';
const desktopList = 'flex items-center gap-1';
const navLink = [
  'block rounded-md px-3 py-1.5 text-sm font-medium text-tertiary hover:bg-hover hover:text-primary',
  'aria-[current=page]:text-brand',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
].join(' ');
const mobileLink = [
  'block rounded-md px-item-x py-item-y text-md font-medium text-secondary hover:bg-hover',
  'aria-[current=page]:bg-brand-subtle aria-[current=page]:text-brand',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
].join(' ');
const spacer = 'flex-1';
const desktopActions = 'hidden items-center gap-2 md:flex';
const mobileActions = 'flex flex-wrap items-center gap-2 border-t border-subtle pt-4';
const mobileList = 'flex flex-col gap-1';

/**
 * Top bar shared by every project: logo and product name, primary links, a
 * right hand slot for ProjectSwitcher and ThemeToggle, and below the md
 * breakpoint a menu button that opens the same content in a Drawer.
 */
export function TopNav({
  productName,
  logo = <BrandMark />,
  homeHref = '/',
  links = [],
  LinkComponent = Anchor,
  actions,
  mobileMenu,
  navLabel = 'Main',
}: TopNavProps) {
  return (
    <header className={header}>
      <div className={bar}>
        <LinkComponent href={homeHref} className={brand}>
          {logo}
          <span className="truncate">{productName}</span>
        </LinkComponent>
        {links.length > 0 && (
          <nav aria-label={navLabel} className={desktopNav}>
            <ul className={desktopList}>
              {links.map((link) => (
                <li key={link.href}>
                  <LinkComponent
                    href={link.href}
                    className={navLink}
                    aria-current={link.isCurrent ? 'page' : undefined}
                  >
                    {link.label}
                  </LinkComponent>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className={spacer} />
        {actions && <div className={desktopActions}>{actions}</div>}
        <DrawerTrigger>
          <IconButton icon={Menu} aria-label="Open menu" variant="tertiary" className="md:hidden" />
          <Drawer title={productName} side="left" size="sm" closeLabel="Close menu">
            {({ close }) => (
              <div className="flex flex-col gap-4">
                {links.length > 0 && (
                  <nav aria-label={navLabel}>
                    <ul className={mobileList}>
                      {links.map((link) => (
                        <li key={link.href}>
                          <LinkComponent
                            href={link.href}
                            className={mobileLink}
                            aria-current={link.isCurrent ? 'page' : undefined}
                            onClick={close}
                          >
                            {link.label}
                          </LinkComponent>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
                {mobileMenu}
                {actions && <div className={mobileActions}>{actions}</div>}
              </div>
            )}
          </Drawer>
        </DrawerTrigger>
      </div>
    </header>
  );
}
