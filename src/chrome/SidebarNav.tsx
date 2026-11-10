import { ChevronDown } from 'lucide-react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Button, Disclosure, DisclosurePanel, Heading } from 'react-aria-components';
import { focusRing } from '../internal/focusRing';
import { Anchor } from './Anchor';
import type { LinkComponent, NavLink } from './types';

export interface SidebarNavItem extends NavLink {
  /** An icon element such as `<Inbox />`. Elements, not components, so a server component can pass them. */
  icon?: ReactNode;
  /** Trailing content such as a count. */
  badge?: ReactNode;
  /**
   * A secondary control beside the link, such as an IconButton that adds a
   * child item. It is a sibling of the link, not inside it, so both stay
   * separate tab stops and arrow keys reach it. Give it its own accessible name.
   */
  action?: ReactNode;
}

export interface SidebarNavSection {
  id: string;
  title?: string;
  items: SidebarNavItem[];
  /** Lets the user fold the section away. Needs a title. */
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface SidebarNavProps {
  sections: SidebarNavSection[];
  LinkComponent?: LinkComponent;
  'aria-label'?: string;
}

const nav = 'flex flex-col gap-4 p-3';
const list = 'flex flex-col gap-0.5';
const sectionTitle = 'px-item-x pb-1 text-xs font-semibold text-tertiary';
const toggle = [
  'flex w-full cursor-pointer items-center justify-between rounded-sm px-item-x pb-1 text-xs font-semibold text-tertiary data-hovered:text-secondary',
  focusRing,
].join(' ');
const chevron =
  'size-3.5 transition-transform group-data-expanded:rotate-180 motion-reduce:transition-none';
const row = 'flex items-center gap-1';
const link = [
  'flex min-w-0 flex-1 items-center gap-2 rounded-md px-item-x py-item-y text-sm font-medium text-secondary hover:bg-hover hover:text-primary',
  'aria-[current=page]:bg-brand-subtle aria-[current=page]:text-brand',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-tertiary aria-[current=page]:[&_svg]:text-fg-brand',
].join(' ');
const badge = 'ml-auto text-xs text-tertiary';

const focusable = 'a[href], button:not([disabled])';
const moves: Record<string, (index: number, count: number) => number> = {
  ArrowDown: (index, count) => (index + 1) % count,
  ArrowUp: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_index, count) => count - 1,
};

function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
  const move = moves[event.key];
  if (!move) return;
  const targets = [...event.currentTarget.querySelectorAll<HTMLElement>(focusable)].filter(
    (element) => !element.closest('[hidden]'),
  );
  const index = targets.indexOf(document.activeElement as HTMLElement);
  if (index === -1) return;
  event.preventDefault();
  targets[move(index, targets.length)]?.focus();
}

function Items({
  items,
  LinkComponent,
}: {
  items: SidebarNavItem[];
  LinkComponent: LinkComponent;
}) {
  return (
    <ul className={list}>
      {items.map((item) => (
        <li key={item.href} className={row}>
          <LinkComponent
            href={item.href}
            className={link}
            aria-current={item.isCurrent ? 'page' : undefined}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
            {item.badge && <span className={badge}>{item.badge}</span>}
          </LinkComponent>
          {item.action && <span className="shrink-0">{item.action}</span>}
        </li>
      ))}
    </ul>
  );
}

/**
 * Sidebar navigation for app style layouts. Tab enters and leaves it; inside,
 * the arrow keys, Home and End move between links and section toggles.
 * Sections can be collapsible, and the current page is marked for assistive
 * technology with aria-current.
 */
export function SidebarNav({
  sections,
  LinkComponent = Anchor,
  'aria-label': ariaLabel = 'Sidebar',
}: SidebarNavProps) {
  return (
    // Arrow keys are delegated from the landmark to the links and toggles inside it.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <nav aria-label={ariaLabel} className={nav} onKeyDown={handleKeyDown}>
      {sections.map((section) =>
        section.collapsible && section.title ? (
          <Disclosure
            key={section.id}
            defaultExpanded={section.defaultExpanded ?? true}
            className="group"
          >
            <Heading level={2}>
              <Button slot="trigger" className={toggle}>
                {section.title}
                <ChevronDown aria-hidden="true" className={chevron} />
              </Button>
            </Heading>
            <DisclosurePanel>
              <Items items={section.items} LinkComponent={LinkComponent} />
            </DisclosurePanel>
          </Disclosure>
        ) : (
          <section key={section.id} aria-label={section.title}>
            {section.title && <h2 className={sectionTitle}>{section.title}</h2>}
            <Items items={section.items} LinkComponent={LinkComponent} />
          </section>
        ),
      )}
    </nav>
  );
}
