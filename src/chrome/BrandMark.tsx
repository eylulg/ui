import type { SVGProps } from 'react';

export interface BrandMarkProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Accessible name. Without it the mark is decorative and hidden. */
  title?: string;
  /** Rendered width and height in pixels. */
  size?: number;
}

const tile = 'fill-(--ui-bg-brand-solid)';
const letter = 'fill-(--ui-text-on-solid)';

/**
 * The shared "eg" monogram. It fills with the active brand colour, so each
 * project's variant tints it while the shape stays the same everywhere.
 */
export function BrandMark({ title, size = 28, ...props }: BrandMarkProps) {
  const labelled = Boolean(title);
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role={labelled ? 'img' : undefined}
      aria-label={title}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      {...props}
    >
      <rect width="32" height="32" rx="8" className={tile} />
      <path
        className={letter}
        d="M14.6 19.4h-6.5c.2 1.6 1.4 2.5 3 2.5 1.1 0 2-.4 2.6-1.2l.6.6c-.8 1-2 1.6-3.3 1.6-2.4 0-4.2-1.7-4.2-4.3s1.7-4.3 4-4.3c2.3 0 3.8 1.7 3.8 4.2v.9Zm-6.5-1h5.2c-.1-1.4-1.1-2.3-2.5-2.3s-2.5.9-2.7 2.3Z"
      />
      <path
        className={letter}
        d="M24.9 14.5v7.8c0 2.6-1.6 4-4 4-1.4 0-2.6-.4-3.5-1.2l.6-.8c.8.7 1.8 1 2.9 1 1.8 0 2.8-.9 2.8-2.9v-1.1c-.6.9-1.7 1.4-2.9 1.4-2.2 0-3.9-1.6-3.9-3.9s1.7-3.9 3.9-3.9c1.2 0 2.3.5 2.9 1.5v-1.4h1.2Zm-1.2 3.8c0-1.7-1.2-2.9-2.8-2.9s-2.8 1.2-2.8 2.9 1.2 2.9 2.8 2.9 2.8-1.2 2.8-2.9Z"
      />
    </svg>
  );
}
