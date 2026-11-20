import { useId } from 'react';
import { brandLogoPath } from './brandLogoPath';

export interface BrandLoaderProps {
  /** Text read aloud while loading. */
  label?: string;
  /** Rendered width and height in pixels. */
  size?: number;
  className?: string;
}

/**
 * The logo drawing itself like a brush stroke, for a page that is on its way.
 * A wide stroke along the logo's outline reveals the filled shape, which then
 * holds, fades and starts again. The dash is 0.42 of the path, just over its
 * longest part, so every part draws at the same pace and none waits. Under reduced motion it shows the still logo.
 */
export function BrandLoader({ label = 'Loading', size = 64, className }: BrandLoaderProps) {
  const maskId = useId();
  return (
    <span role='status' className={className}>
      <svg
        viewBox='-0.5 -0.5 101 101'
        width={size}
        height={size}
        aria-hidden='true'
        focusable='false'
        className='motion-safe:animate-brand-fade'
      >
        <mask id={maskId} maskUnits='userSpaceOnUse' x='-10' y='-10' width='120' height='120'>
          <path
            d={brandLogoPath}
            pathLength={1}
            fill='none'
            stroke='white'
            strokeWidth={14}
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeDasharray={0.42}
            strokeDashoffset={0}
            className='motion-safe:animate-brand-draw'
          />
        </mask>
        <path
          className='fill-(--ui-logo)'
          fillRule='evenodd'
          d={brandLogoPath}
          mask={`url(#${maskId})`}
        />
      </svg>
      <span className='sr-only'>{label}</span>
    </span>
  );
}
