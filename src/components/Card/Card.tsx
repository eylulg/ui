import {
  createContext,
  useContext,
  type AriaAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button, Link, type LinkProps, type PressEvent } from 'react-aria-components';
import { cx } from '../../utils/cx';

export type CardHeadingLevel = 2 | 3 | 4;

type AriaProps = Partial<
  Pick<
    AriaAttributes,
    'aria-label' | 'aria-describedby' | 'aria-keyshortcuts' | 'aria-current' | 'aria-haspopup'
  >
>;

interface CardAction extends AriaProps {
  href?: string;
  target?: LinkProps['target'];
  rel?: string;
  onPress?: (event: PressEvent) => void;
}

export type CardPadding = 'default' | 'none';

export interface CardProps extends CardAction, HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * `none` removes the padding and clips the content to the rounded corners,
   * for media cards where an image runs to the edge. Give the text parts their
   * own padding, for example `<CardBody className="p-card">`.
   */
  padding?: CardPadding;
}

export interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Secondary actions, such as an IconButton or a DropdownMenu. Stay reachable in an interactive card. */
  actions?: ReactNode;
  headingLevel?: CardHeadingLevel;
  className?: string;
}

export interface CardSlotProps {
  children: ReactNode;
  className?: string;
}

const CardActionContext = createContext<CardAction>({});

const headings = { 2: 'h2', 3: 'h3', 4: 'h4' } as const;

const surface =
  'relative flex flex-col rounded-xl border border-subtle bg-elevated text-primary shadow-xs';
const paddings: Record<CardPadding, string> = {
  default: 'gap-stack p-card',
  none: 'overflow-hidden',
};

const interactiveSurface =
  'transition-colors hover:border-strong hover:bg-secondary has-[[data-card-action][data-focus-visible]]:outline-2 has-[[data-card-action][data-focus-visible]]:outline-offset-2 has-[[data-card-action][data-focus-visible]]:outline-focus';

const stretched =
  'cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-xl after:content-[""]';

/** Lifts nested controls above the stretched link so they stay clickable. */
const raised = 'relative z-10';

const headerActions = [raised, 'flex shrink-0 items-center gap-2'].join(' ');

/**
 * A surface that groups related content. Pass `href` or `onPress` to make
 * the whole card one link or button, named by the CardHeader title; controls
 * in the header actions and the footer stay separately reachable. On an
 * interactive card, `aria-keyshortcuts`, `aria-describedby`, `aria-label`,
 * `aria-current` and `aria-haspopup` go to that link or button, where assistive
 * technology looks for them, instead of to the surrounding div.
 */
export function Card({
  href,
  target,
  rel,
  onPress,
  padding = 'default',
  className,
  children,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-keyshortcuts': ariaKeyShortcuts,
  'aria-current': ariaCurrent,
  'aria-haspopup': ariaHasPopup,
  ...props
}: CardProps) {
  const interactive = Boolean(href ?? onPress);
  const aria: AriaProps = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-keyshortcuts': ariaKeyShortcuts,
    'aria-current': ariaCurrent,
    'aria-haspopup': ariaHasPopup,
  };
  return (
    <CardActionContext.Provider value={interactive ? { href, target, rel, onPress, ...aria } : {}}>
      <div
        {...props}
        {...(interactive ? {} : aria)}
        className={cx(surface, paddings[padding], interactive && interactiveSurface, className)}
      >
        {children}
      </div>
    </CardActionContext.Provider>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  const {
    href,
    target,
    rel,
    onPress,
    'aria-keyshortcuts': keyShortcuts,
    ...aria
  } = useContext(CardActionContext);

  // React Aria drops aria-keyshortcuts from the props it renders, so it is set on the element.
  function applyKeyShortcuts(element: HTMLElement | null) {
    if (element && keyShortcuts) element.setAttribute('aria-keyshortcuts', keyShortcuts);
  }

  if (href) {
    return (
      <Link
        data-card-action
        href={href}
        target={target}
        rel={rel}
        onPress={onPress}
        className={stretched}
        ref={applyKeyShortcuts}
        {...aria}
      >
        {children}
      </Link>
    );
  }
  if (onPress) {
    return (
      <Button
        data-card-action
        onPress={onPress}
        className={stretched}
        ref={applyKeyShortcuts}
        {...aria}
      >
        {children}
      </Button>
    );
  }
  return children;
}

export function CardHeader({
  title,
  description,
  actions,
  headingLevel = 3,
  className,
}: CardHeaderProps) {
  const Heading = headings[headingLevel];
  return (
    <div className={cx('flex items-start gap-3', className)}>
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <Heading className='font-display text-md font-semibold text-primary'>
          <CardTitle>{title}</CardTitle>
        </Heading>
        {description && <p className='text-sm text-tertiary'>{description}</p>}
      </div>
      {actions && <div className={headerActions}>{actions}</div>}
    </div>
  );
}

export function CardBody({ children, className }: CardSlotProps) {
  return <div className={cx('text-sm text-secondary', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardSlotProps) {
  return (
    <div
      className={cx(
        raised,
        'flex flex-wrap items-center justify-end gap-3 border-t border-subtle pt-stack',
        className,
      )}
    >
      {children}
    </div>
  );
}
