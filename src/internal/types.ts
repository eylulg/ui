import type { ComponentType, SVGProps } from 'react';

/** Any icon component that accepts SVG props, such as a lucide-react icon. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
