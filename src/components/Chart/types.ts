export interface ChartSeries {
  /** Stable key. Also the identity of the series: keep it the same when data is filtered. */
  id: string;
  /** Name shown in the legend, the tooltip and the table. */
  label: string;
  /** One value per x position or category. `null` leaves a gap. */
  values: Array<number | null>;
  /**
   * Which of the six series colours to use, 0 to 5. Defaults to the position in the `series`
   * array. Set it when a filter removes series, so the ones that remain keep their colour.
   */
  colorIndex?: number;
}

export type XValue = Date | number | string;

export interface ChartLabels {
  showTable: string;
  hideTable: string;
  empty: string;
  /** Stands for a missing value in a tooltip, an accessible name and a heat grid cell. */
  noData: string;
  /** The total row of a stacked bar tooltip and the last column of its table. */
  total: string;
  /** Default first table header of a bar chart and of a line chart with named x values. */
  category: string;
  /** Default first table header of a line chart with dates. */
  date: string;
  /** Default first table header of a line chart with numeric x values. */
  value: string;
  /** Default first table header and row header label of a heat grid. */
  row: string;
}

export interface ChartBaseProps {
  /** The accessible name of the chart. Shown above it unless `hideTitle` is set. */
  title: string;
  hideTitle?: boolean;
  /**
   * A one or two sentence description for assistive technology. Without it the chart writes one
   * from the data, in English. Pass your own to localise it.
   */
  summary?: string;
  /** BCP 47 tag for number and date formatting. Defaults to the runtime locale. */
  locale?: string;
  /** Text for the table toggle, the empty state and the words the chart adds to your data. */
  labels?: Partial<ChartLabels>;
  /** Height of the whole chart in pixels, including the axes. The plot is shorter by the margins. */
  height?: number;
  /** Draws the chart on a bordered card surface. */
  isCard?: boolean;
  className?: string;
}
