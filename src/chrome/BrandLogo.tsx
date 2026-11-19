import type { SVGProps } from 'react';

export interface BrandLogoProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Accessible name. Without it the logo is decorative and hidden. */
  title?: string;
  /** Rendered width and height in pixels. Below 32 use BrandMark, which reads at tab size. */
  size?: number;
}

const letters = 'fill-(--ui-logo-letters)';
const lines = 'fill-(--ui-logo-lines)';

/**
 * Eylül Güneş's logo, a draft: a horse's head in brush strokes. A slanted
 * script E is the neck and mane, a script G the cheek, and tapering ink lines
 * draw the ear, the face and the muzzle. Its colours are the same in every
 * project: green letters and ink lines, light green and cream in dark mode.
 */
export function BrandLogo({ title, size = 64, ...props }: BrandLogoProps) {
  const labelled = Boolean(title);
  return (
    <svg
      viewBox='0 0 200 200'
      width={size}
      height={size}
      role={labelled ? 'img' : undefined}
      aria-label={title}
      aria-hidden={labelled ? undefined : true}
      focusable='false'
      {...props}
    >
      <g transform='translate(14 8) scale(0.9)'>
        <g className={letters}>
          <g transform='translate(128 46) skewX(-32) translate(-128 -46)'>
            <path d='M128 46 C110 40 88 46 86 62 C84 76 96 84 106 88 C94 82 88 74 90 63 C93 50 110 46 128 50 Z' />
            <path d='M106 88 C80 96 70 124 80 150 C90 172 116 184 146 178 C116 182 92 170 86 150 C78 126 88 102 106 88 Z' />
          </g>
          <path d='M146 80 C134 66 108 72 108 96 C108 118 128 128 146 120 C130 126 114 116 113 96 C112 76 132 70 146 80 Z' />
          <path d='M146 120 C149 112 148 106 146 104 L132 104 C138 105 142 106 144 108 C145 112 146 116 146 120 Z' />
        </g>
        <g className={lines}>
          <path d='M128 48 C124 34 126 22 134 12 C131 24 131 36 132 47 Z' />
          <path d='M134 12 C138 24 142 34 147 42 C141 36 137 26 134 12 Z' />
          <path d='M145 40 C160 58 176 84 188 112 C174 86 158 62 145 46 Z' />
          <path d='M188 112 C195 126 184 134 170 132 C182 129 190 123 188 112 Z' />
          <path d='M170 132 C163 134 156 133 152 129 C158 131 164 132 170 132 Z' />
        </g>
      </g>
    </svg>
  );
}
