import type { MarkerShape } from './geometry';

export interface SeriesStyle {
  stroke: string;
  fill: string;
  swatch: string;
  shape: MarkerShape;
  /** SVG dash pattern. Only the colourless overflow series are dashed. */
  dash?: string;
}

const shapes: MarkerShape[] = [
  'circle',
  'square',
  'diamond',
  'triangle',
  'triangle-down',
  'hexagon',
];

const palette = [
  { stroke: 'stroke-chart-1', fill: 'fill-chart-1', swatch: 'bg-chart-1' },
  { stroke: 'stroke-chart-2', fill: 'fill-chart-2', swatch: 'bg-chart-2' },
  { stroke: 'stroke-chart-3', fill: 'fill-chart-3', swatch: 'bg-chart-3' },
  { stroke: 'stroke-chart-4', fill: 'fill-chart-4', swatch: 'bg-chart-4' },
  { stroke: 'stroke-chart-5', fill: 'fill-chart-5', swatch: 'bg-chart-5' },
  { stroke: 'stroke-chart-6', fill: 'fill-chart-6', swatch: 'bg-chart-6' },
];

const overflow = {
  stroke: 'stroke-chart-muted',
  fill: 'fill-chart-muted',
  swatch: 'bg-chart-muted',
};
const dashes = ['6 4', '2 4', '8 3 2 3'];

/**
 * Colour, marker shape and dash of the series at `index`. The first six get a hue each, in a fixed
 * order, never cycled. Further series share the muted colour and are told apart by shape and dash.
 */
export function seriesStyle(index: number): SeriesStyle {
  const shape = shapes[index % shapes.length] ?? 'circle';
  const colour = palette[index];
  if (colour) return { ...colour, shape };
  return { ...overflow, shape, dash: dashes[(index - palette.length) % dashes.length] };
}
