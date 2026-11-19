export type MarkerShape =
  'circle' | 'square' | 'diamond' | 'triangle' | 'triangle-down' | 'hexagon';

/** The SVG path of a marker centred on x, y whose circumscribed circle has radius r. */
export function markerPath(shape: MarkerShape, x: number, y: number, r: number): string {
  const points = (angles: number[], radius: number) =>
    angles
      .map((angle, index) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        return `${index === 0 ? 'M' : 'L'}${(x + radius * Math.cos(rad)).toFixed(2)} ${(y + radius * Math.sin(rad)).toFixed(2)}`;
      })
      .join('') + 'Z';
  switch (shape) {
    case 'circle':
      return `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
    case 'square':
      return points([45, 135, 225, 315], r * Math.SQRT2 * 0.82);
    case 'diamond':
      return points([0, 90, 180, 270], r * 1.2);
    case 'triangle':
      return points([0, 120, 240], r * 1.25);
    case 'triangle-down':
      return points([180, 300, 60], r * 1.25);
    case 'hexagon':
      return points([0, 60, 120, 180, 240, 300], r * 1.1);
  }
}

export type BarEnd = 'top' | 'right' | 'bottom' | 'left' | 'none';

/**
 * A bar with a rounded data end and a square base. `top` rounds the upper corners of a column,
 * `right` the right corners of a horizontal bar, `bottom` and `left` the same for a bar that
 * grows below or to the left of zero, and `none` draws a plain rectangle (the inner segments of a
 * stack).
 */
export function barPath(
  x: number,
  y: number,
  width: number,
  height: number,
  end: BarEnd,
  radius = 4,
): string {
  if (width <= 0 || height <= 0) return '';
  if (end === 'none') return `M${x} ${y}h${width}v${height}h${-width}Z`;
  if (end === 'top') {
    const r = Math.min(radius, width / 2, height);
    return `M${x} ${y + height}V${y + r}a${r} ${r} 0 0 1 ${r} ${-r}h${width - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}V${y + height}Z`;
  }
  if (end === 'bottom') {
    const r = Math.min(radius, width / 2, height);
    return `M${x} ${y}h${width}V${y + height - r}a${r} ${r} 0 0 1 ${-r} ${r}H${x + r}a${r} ${r} 0 0 1 ${-r} ${-r}Z`;
  }
  if (end === 'left') {
    const r = Math.min(radius, height / 2, width);
    return `M${x + width} ${y}H${x + r}a${r} ${r} 0 0 0 ${-r} ${r}V${y + height - r}a${r} ${r} 0 0 0 ${r} ${r}H${x + width}Z`;
  }
  const r = Math.min(radius, height / 2, width);
  return `M${x} ${y}H${x + width - r}a${r} ${r} 0 0 1 ${r} ${r}V${y + height - r}a${r} ${r} 0 0 1 ${-r} ${r}H${x}Z`;
}
