import { Children, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarProps {
  /** Full name. Used as the accessible name and for the initials fallback. */
  name: string;
  /** Image URL. Falls back to initials when missing or when it fails to load. */
  src?: string;
  size?: AvatarSize;
  /** Presence dot in the corner, announced as text. */
  status?: AvatarStatus;
  /** Overrides the announced status text, for example "Online since 9:00". */
  statusLabel?: string;
  className?: string;
}

const sizes: Record<AvatarSize, { avatar: string; dot: string }> = {
  xs: { avatar: 'size-6 text-xs', dot: 'size-1.5' },
  sm: { avatar: 'size-8 text-xs', dot: 'size-2' },
  md: { avatar: 'size-10 text-sm', dot: 'size-2.5' },
  lg: { avatar: 'size-12 text-md', dot: 'size-3' },
  xl: { avatar: 'size-14 text-lg', dot: 'size-3.5' },
};

const statuses: Record<AvatarStatus, { dot: string; label: string }> = {
  online: { dot: 'bg-fg-success', label: 'Online' },
  away: { dot: 'bg-fg-warning', label: 'Away' },
  busy: { dot: 'bg-fg-error', label: 'Busy' },
  offline: { dot: 'bg-fg-tertiary', label: 'Offline' },
};

const surface =
  'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-subtle font-semibold text-brand ring-1 ring-default select-none';

const dotBase =
  'absolute right-0 bottom-0 rounded-full outline-2 outline-(--ui-bg-primary) outline-solid';

/**
 * Up to two initials from a name: the first letter of the first and last
 * words, or the first letter of a single name. Extra whitespace is ignored and
 * letters outside the Basic Multilingual Plane stay whole.
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0];
  if (!first) return '';
  const last = words.length > 1 ? words[words.length - 1] : undefined;
  const letters = [first, last].map((word) => (word ? (Array.from(word)[0] ?? '') : ''));
  return letters.join('').toLocaleUpperCase();
}

function AvatarImage({ name, src, sizeClass }: { name: string; src?: string; sizeClass: string }) {
  const [failed, setFailed] = useState(false);

  function handleError() {
    setFailed(true);
  }

  if (!src || failed) {
    return (
      <span role="img" aria-label={name} className={cx(surface, sizeClass)}>
        <span aria-hidden="true">{getInitials(name)}</span>
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={handleError}
      className={cx(surface, 'object-cover', sizeClass)}
    />
  );
}

/**
 * A person's picture, with an initials fallback when there is no image or it
 * fails to load. The name is always the accessible name.
 */
export function Avatar({ name, src, size = 'md', status, statusLabel, className }: AvatarProps) {
  return (
    <span className={cx('relative inline-flex shrink-0', className)}>
      <AvatarImage key={src} name={name} src={src} sizeClass={sizes[size].avatar} />
      {status && (
        <>
          <span aria-hidden="true" className={cx(dotBase, statuses[status].dot, sizes[size].dot)} />
          <span className="sr-only">{statusLabel ?? statuses[status].label}</span>
        </>
      )}
    </span>
  );
}

export interface AvatarGroupProps {
  /** Avatar elements. */
  children: ReactNode;
  /** Accessible name of the group, such as "Reviewers". */
  'aria-label': string;
  /** Maximum avatars shown before a "+N" counter. */
  max?: number;
  /** Size of the "+N" counter. Match it to the avatars. */
  size?: AvatarSize;
  className?: string;
}

/** Overlapping avatars with a "+N" counter for the rest. */
export function AvatarGroup({
  children,
  'aria-label': ariaLabel,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const items = Children.toArray(children);
  const visible = items.slice(0, max);
  const hidden = items.length - visible.length;
  return (
    <div role="group" aria-label={ariaLabel} className={cx('flex -space-x-2', className)}>
      {visible}
      {hidden > 0 && (
        <span
          role="img"
          aria-label={`${hidden} more`}
          className={cx(surface, 'bg-tertiary text-secondary', sizes[size].avatar)}
        >
          <span aria-hidden="true">+{hidden}</span>
        </span>
      )}
    </div>
  );
}
