import { createContext, useContext, type HTMLAttributes, type ReactNode } from 'react';
import { Button, Link, type LinkProps, type PressEvent } from 'react-aria-components';
import { cx } from '../../utils/cx';

export type CardHeadingLevel = 2 | 3 | 4;

interface CardAction {
  href?: string;
  target?: LinkProps['target'];
  rel?: string;
  onPress?: (event: PressEvent) => void;
}

export interface CardProps extends CardAction, HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
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
  'relative flex flex-col gap-stack rounded-xl border border-subtle bg-elevated p-card text-primary shadow-xs';

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
 * in the header actions and the footer stay separately reachable.
 */
export function Card({ href, target, rel, onPress, className, children, ...props }: CardProps) {
  const interactive = Boolean(href ?? onPress);
  return (
    <CardActionContext.Provider value={{ href, target, rel, onPress }}>
      <div {...props} className={cx(surface, interactive && interactiveSurface, className)}>
        {children}
      </div>
    </CardActionContext.Provider>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  const { href, target, rel, onPress } = useContext(CardActionContext);

  if (href) {
    return (
      <Link
        data-card-action
        href={href}
        target={target}
        rel={rel}
        onPress={onPress}
        className={stretched}
      >
        {children}
      </Link>
    );
  }
  if (onPress) {
    return (
      <Button data-card-action onPress={onPress} className={stretched}>
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
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Heading className="font-display text-md font-semibold text-primary">
          <CardTitle>{title}</CardTitle>
        </Heading>
        {description && <p className="text-sm text-tertiary">{description}</p>}
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
