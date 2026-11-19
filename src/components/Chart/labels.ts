import type { ChartLabels } from './types';

const defaultLabels: ChartLabels = {
  showTable: 'Show table',
  hideTable: 'Hide table',
  empty: 'No data to show.',
  noData: 'No data',
  total: 'Total',
  category: 'Category',
  date: 'Date',
  value: 'Value',
  row: 'Row',
};

/** The labels a consumer passed, over the English defaults. */
export function chartLabels(labels?: Partial<ChartLabels>): ChartLabels {
  return { ...defaultLabels, ...labels };
}
