interface ChartTableProps {
  id: string;
  /** The chart title, which names the table. */
  caption: string;
  /** Header cells, the first for the row names. */
  head: string[];
  rows: string[][];
}

/**
 * Safari and Firefox only let keyboard users scroll a region that can take focus, and a wide table
 * scrolls sideways on a phone.
 */
const scrollable = { tabIndex: 0 };

/** The data of a chart as a real table, for anyone who wants exact values or cannot use the plot. */
export function ChartTable({ id, caption, head, rows }: ChartTableProps) {
  const [corner = '', ...columns] = head;
  return (
    <div
      id={id}
      role='region'
      aria-label={caption}
      className='max-w-full overflow-x-auto rounded-md outline-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-solid'
      {...scrollable}
    >
      <table className='w-full border-collapse text-left text-sm'>
        <caption className='sr-only'>{caption}</caption>
        <thead>
          <tr>
            <th
              scope='col'
              className='border-b border-default py-1.5 pr-4 font-medium text-tertiary'
            >
              {corner}
            </th>
            {columns.map((name) => (
              <th
                key={name}
                scope='col'
                className='border-b border-default px-2 py-1.5 text-right font-medium whitespace-nowrap text-tertiary'
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name = '', ...cells]) => (
            <tr key={name}>
              <th
                scope='row'
                className='border-b border-subtle py-1.5 pr-4 font-medium text-primary'
              >
                {name}
              </th>
              {cells.map((cell, index) => (
                <td
                  key={columns[index] ?? index}
                  className='border-b border-subtle px-2 py-1.5 text-right font-data text-primary tabular-nums'
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
