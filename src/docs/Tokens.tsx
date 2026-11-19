const steps = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const scales = ['brand', 'gray', 'success', 'warning', 'error'] as const;

export function ColorScales() {
  return (
    <div className='not-prose my-6 flex flex-col gap-4'>
      {scales.map((scale) => (
        <div key={scale} className='flex flex-col gap-1'>
          <span className='font-mono text-xs text-secondary'>--color-{scale}-*</span>
          <div className='grid grid-cols-6 gap-1 sm:grid-cols-12'>
            {steps.map((step) => (
              <div key={step} className='flex flex-col gap-1'>
                <div
                  className='h-10 rounded-sm ring-1 ring-default ring-inset'
                  style={{ background: `var(--color-${scale}-${step})` }}
                />
                <span className='text-center font-mono text-xs text-tertiary'>{step}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SemanticToken {
  utility: string;
  variable: string;
  light: string;
  dark: string;
  property: 'color' | 'background' | 'border';
}

export const semanticTokens: SemanticToken[] = [
  {
    utility: 'text-primary',
    variable: '--ui-text-primary',
    light: 'gray-900',
    dark: 'gray-50',
    property: 'color',
  },
  {
    utility: 'text-secondary',
    variable: '--ui-text-secondary',
    light: 'gray-700',
    dark: 'gray-300',
    property: 'color',
  },
  {
    utility: 'text-tertiary',
    variable: '--ui-text-tertiary',
    light: 'gray-600',
    dark: 'gray-400',
    property: 'color',
  },
  {
    utility: 'text-disabled',
    variable: '--ui-text-disabled',
    light: 'gray-500',
    dark: 'gray-500',
    property: 'color',
  },
  {
    utility: 'text-brand',
    variable: '--ui-text-brand',
    light: 'brand-700',
    dark: 'brand-300',
    property: 'color',
  },
  {
    utility: 'text-error',
    variable: '--ui-text-error',
    light: 'error-700',
    dark: 'error-300',
    property: 'color',
  },
  {
    utility: 'text-on-solid',
    variable: '--ui-text-on-solid',
    light: 'white',
    dark: 'white',
    property: 'color',
  },
  {
    utility: 'bg-primary',
    variable: '--ui-bg-primary',
    light: 'white',
    dark: 'gray-950',
    property: 'background',
  },
  {
    utility: 'bg-secondary',
    variable: '--ui-bg-secondary',
    light: 'gray-50',
    dark: 'gray-900',
    property: 'background',
  },
  {
    utility: 'bg-tertiary',
    variable: '--ui-bg-tertiary',
    light: 'gray-100',
    dark: 'gray-800',
    property: 'background',
  },
  {
    utility: 'bg-elevated',
    variable: '--ui-bg-elevated',
    light: 'white',
    dark: 'gray-900',
    property: 'background',
  },
  {
    utility: 'bg-brand-solid',
    variable: '--ui-bg-brand-solid',
    light: 'brand-600',
    dark: 'brand-600',
    property: 'background',
  },
  {
    utility: 'bg-brand-subtle',
    variable: '--ui-bg-brand-subtle',
    light: 'brand-50',
    dark: 'brand-600 at 18%',
    property: 'background',
  },
  {
    utility: 'bg-error-solid',
    variable: '--ui-bg-error-solid',
    light: 'error-600',
    dark: 'error-600',
    property: 'background',
  },
  {
    utility: 'border-default',
    variable: '--ui-border-default',
    light: 'gray-300',
    dark: 'gray-700',
    property: 'border',
  },
  {
    utility: 'border-control',
    variable: '--ui-border-control',
    light: 'gray-500',
    dark: 'gray-500',
    property: 'border',
  },
  {
    utility: 'border-subtle',
    variable: '--ui-border-subtle',
    light: 'gray-200',
    dark: 'gray-800',
    property: 'border',
  },
  {
    utility: 'border-brand',
    variable: '--ui-border-brand',
    light: 'brand-600',
    dark: 'brand-400',
    property: 'border',
  },
  {
    utility: 'border-error',
    variable: '--ui-border-error',
    light: 'error-600',
    dark: 'error-400',
    property: 'border',
  },
  {
    utility: 'ring-focus / outline-focus',
    variable: '--ui-border-focus',
    light: 'brand-500',
    dark: 'brand-400',
    property: 'border',
  },
  {
    utility: 'text-fg-secondary',
    variable: '--ui-fg-secondary',
    light: 'gray-600',
    dark: 'gray-300',
    property: 'color',
  },
  {
    utility: 'text-fg-brand',
    variable: '--ui-fg-brand',
    light: 'brand-600',
    dark: 'brand-400',
    property: 'color',
  },
  {
    utility: 'text-fg-success',
    variable: '--ui-fg-success',
    light: 'success-600',
    dark: 'success-400',
    property: 'color',
  },
  {
    utility: 'text-fg-warning',
    variable: '--ui-fg-warning',
    light: 'warning-600',
    dark: 'warning-400',
    property: 'color',
  },
  {
    utility: 'text-fg-error',
    variable: '--ui-fg-error',
    light: 'error-600',
    dark: 'error-400',
    property: 'color',
  },
];

export function SemanticTokenTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Preview</th>
          <th>Utility</th>
          <th>Variable</th>
          <th>Light</th>
          <th>Dark</th>
        </tr>
      </thead>
      <tbody>
        {semanticTokens.map((token) => (
          <tr key={token.variable}>
            <td>
              <span
                aria-hidden='true'
                className='inline-block size-6 rounded-sm ring-1 ring-default ring-inset'
                style={{ background: `var(${token.variable})` }}
              />
            </td>
            <td>
              <code>{token.utility}</code>
            </td>
            <td>
              <code>{token.variable}</code>
            </td>
            <td>{token.light}</td>
            <td>{token.dark}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const scaleRows = {
  radius: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
  shadow: ['xs', 'sm', 'md', 'lg', 'xl'],
  text: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
};

export function RadiusAndShadowTable() {
  return (
    <div className='not-prose my-6 flex flex-wrap gap-6'>
      {scaleRows.radius.map((name) => (
        <div key={name} className='flex flex-col items-center gap-2'>
          <div
            className='size-14 border border-strong bg-secondary'
            style={{ borderRadius: `var(--radius-${name})` }}
          />
          <code className='text-xs'>rounded-{name}</code>
        </div>
      ))}
      {scaleRows.shadow.map((name) => (
        <div key={name} className='flex flex-col items-center gap-2'>
          <div
            className='size-14 rounded-md bg-elevated'
            style={{ boxShadow: `var(--shadow-${name})` }}
          />
          <code className='text-xs'>shadow-{name}</code>
        </div>
      ))}
    </div>
  );
}

export function TypeScale() {
  return (
    <div className='not-prose my-6 flex flex-col gap-3'>
      {scaleRows.text.map((name) => (
        <div key={name} className='flex items-baseline gap-4'>
          <code className='w-20 shrink-0 text-xs text-tertiary'>text-{name}</code>
          <span
            className='text-primary'
            style={{
              fontSize: `var(--text-${name})`,
              lineHeight: `var(--text-${name}--line-height)`,
            }}
          >
            Accessible by default
          </span>
        </div>
      ))}
    </div>
  );
}
