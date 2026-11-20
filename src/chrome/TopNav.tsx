import { Menu } from 'lucide-react';
import { lazy, Suspense, useState, type ReactNode } from 'react';
import { Anchor } from './Anchor';
import { BrandLogo } from './BrandLogo';
import type { LinkComponent, NavLink } from './types';

// Loaded on the first press of the menu button, so the Drawer stays out of the first chunk.
const MobileMenu = lazy(() =>
  import('./MobileMenu').then((module) => ({ default: module.MobileMenu })),
);

export interface TopNavLabels {
  /** Accessible name of the logo link. */
  portfolio: string;
  openMenu: string;
  closeMenu: string;
}

export interface TopNavProps {
  productName: string;
  /** Logo before the product name. Defaults to the shared BrandLogo. */
  logo?: ReactNode;
  /** Where the product name links to: the app's own home. */
  homeHref?: string;
  /**
   * Where the logo links to. When it equals `homeHref`, as on the portfolio
   * itself, the logo and the name are one link.
   */
  portfolioHref?: string;
  links?: NavLink[];
  /** Your router's link, such as Next.js `Link` or React Router's `Link`. */
  LinkComponent?: LinkComponent;
  /**
   * Middle slot between the links and the actions, such as a search field or a
   * command palette button. Shown from the md breakpoint and at the top of the
   * mobile menu.
   */
  center?: ReactNode;
  /** Right hand slot, usually ThemeToggle. Shown from the md breakpoint and in the mobile menu. */
  actions?: ReactNode;
  /**
   * Controls that stay in the bar below the md breakpoint, next to the menu
   * button, such as `<ThemeToggle compact />`. Hidden from md up, where
   * `actions` takes over, so do not repeat a control in both.
   */
  compactActions?: ReactNode;
  /** Extra content for the mobile menu, such as the app's SidebarNav. */
  mobileMenu?: ReactNode;
  /** Accessible name of the primary navigation. */
  navLabel?: string;
  /** Translated texts. Missing keys keep the English default. */
  labels?: Partial<TopNavLabels>;
}

const defaultLabels: TopNavLabels = {
  portfolio: "Eylül's portfolio",
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
};

const header = 'sticky top-0 z-40 border-b border-default bg-secondary/90 backdrop-blur';
const bar = 'mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8';
const brandFocus =
  'touch-target relative rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';
const brandText = 'font-display text-md font-semibold text-primary';
const brand = `flex min-w-0 items-center gap-2 ${brandText} ${brandFocus}`;
const brandPair = 'flex min-w-0 items-center gap-2';
const logoLink = `shrink-0 ${brandFocus}`;
const nameLink = `min-w-0 truncate ${brandText} ${brandFocus}`;
const desktopNav = 'ml-4 hidden md:block';
const desktopList = 'flex items-center gap-1';
const navLink = [
  'block rounded-md px-3 py-1.5 text-sm font-medium text-tertiary hover:bg-hover hover:text-primary',
  'aria-[current=page]:text-brand',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
].join(' ');
const spacer = 'flex-1';
const desktopSpacer = 'hidden flex-1 md:block';
const desktopCenter = 'hidden min-w-0 items-center md:flex';
const desktopActions = 'hidden items-center gap-2 md:flex';
// A native button keeps react-aria-components out of the first load of a page that never opens the menu.
const menuButton = [
  'touch-target relative inline-flex size-control-md cursor-pointer items-center justify-center rounded-md text-secondary hover:bg-hover hover:text-primary md:hidden',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
].join(' ');
const compactBar = 'flex items-center gap-1 md:hidden';

/**
 * Top bar shared by every project: logo and product name, primary links, a
 * right hand slot for ProjectSwitcher and ThemeToggle, and below the md
 * breakpoint a menu button that opens the same content in a Drawer.
 */
export function TopNav({
  productName,
  logo = <BrandLogo size={32} />,
  homeHref = '/',
  portfolioHref = 'https://eylulg.github.io/',
  links = [],
  LinkComponent = Anchor,
  center,
  actions,
  compactActions,
  mobileMenu,
  navLabel = 'Main',
  labels,
}: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const text = { ...defaultLabels, ...labels };

  function handleOpenMenu() {
    setHasOpened(true);
    setIsOpen(true);
  }

  return (
    <header className={header}>
      <div className={bar}>
        {portfolioHref === homeHref ? (
          <LinkComponent href={homeHref} className={brand}>
            {logo}
            <span className='truncate'>{productName}</span>
          </LinkComponent>
        ) : (
          <div className={brandPair}>
            <LinkComponent href={portfolioHref} className={logoLink}>
              {logo}
              <span className='sr-only'>{text.portfolio}</span>
            </LinkComponent>
            <LinkComponent href={homeHref} className={nameLink}>
              {productName}
            </LinkComponent>
          </div>
        )}
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
        {center && (
          <>
            <div className={desktopCenter}>{center}</div>
            <div className={desktopSpacer} />
          </>
        )}
        {actions && <div className={desktopActions}>{actions}</div>}
        {compactActions && <div className={compactBar}>{compactActions}</div>}
        <button
          type='button'
          aria-label={text.openMenu}
          aria-haspopup='dialog'
          aria-expanded={isOpen}
          className={menuButton}
          onClick={handleOpenMenu}
        >
          <Menu aria-hidden='true' className='size-5' />
        </button>
        {hasOpened && (
          <Suspense fallback={null}>
            <MobileMenu
              isOpen={isOpen}
              onOpenChange={setIsOpen}
              productName={productName}
              closeLabel={text.closeMenu}
              navLabel={navLabel}
              links={links}
              LinkComponent={LinkComponent}
              center={center}
              actions={actions}
              mobileMenu={mobileMenu}
            />
          </Suspense>
        )}
      </div>
    </header>
  );
}
