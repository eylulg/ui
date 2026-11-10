import type { ReactNode } from 'react';
import { Drawer } from '../components/Drawer/Drawer';
import type { LinkComponent, NavLink } from './types';

export interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  productName: string;
  closeLabel: string;
  navLabel: string;
  links: NavLink[];
  LinkComponent: LinkComponent;
  center?: ReactNode;
  actions?: ReactNode;
  mobileMenu?: ReactNode;
}

const mobileLink = [
  'block rounded-md px-item-x py-item-y text-md font-medium text-secondary hover:bg-hover',
  'aria-[current=page]:bg-brand-subtle aria-[current=page]:text-brand',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
].join(' ');
const mobileActions = 'flex flex-wrap items-center gap-2 border-t border-subtle pt-4';
const mobileList = 'flex flex-col gap-1';

/**
 * The drawer behind TopNav's menu button. TopNav loads this module on the
 * first press, so pages that never open the menu do not download the Drawer.
 */
export function MobileMenu({
  isOpen,
  onOpenChange,
  productName,
  closeLabel,
  navLabel,
  links,
  LinkComponent,
  center,
  actions,
  mobileMenu,
}: MobileMenuProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={productName}
      side="left"
      size="sm"
      closeLabel={closeLabel}
    >
      {({ close }) => (
        <div className="flex flex-col gap-4">
          {center}
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
  );
}
