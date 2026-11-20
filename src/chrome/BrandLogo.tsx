import type { SVGProps } from 'react';
import { brandLogoPath } from './brandLogoPath';

export interface BrandLogoProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Accessible name. Without it the logo is decorative and hidden. */
  title?: string;
  /** Rendered width and height in pixels. At 48 and below it draws with a thin outline. */
  size?: number;
}

/**
 * Eylül Güneş's logo: a calligraphic E and G whose strokes form a horse's
 * head. It is one path in the brand green, light green in dark mode, in every
 * theme. At 48px and below a same-colour stroke of 2 thickens the thin strokes.
 */
export function BrandLogo({ title, size = 64, ...props }: BrandLogoProps) {
  const labelled = Boolean(title);
  const small = size <= 48;
  return (
    <svg
      viewBox={small ? '-1.5 -1.5 103 103' : '-0.5 -0.5 101 101'}
      width={size}
      height={size}
      role={labelled ? 'img' : undefined}
      aria-label={title}
      aria-hidden={labelled ? undefined : true}
      focusable='false'
      {...props}
    >
      <path
        className='fill-(--ui-logo) stroke-(--ui-logo)'
        strokeWidth={small ? 2 : 0}
        strokeLinejoin='round'
        fillRule='evenodd'
        d={brandLogoPath}
      />
    </svg>
  );
}
