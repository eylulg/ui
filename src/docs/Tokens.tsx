const steps = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const scales = ['brand', 'gray', 'success', 'warning', 'error'] as const;
const seeds = ['brand-seed', 'brand-seed-dark'] as const;

export function ColorScales() {
  return (
    <div className='not-prose my-6 flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <span className='font-mono text-xs text-secondary'>--color-brand-seed, -seed-dark</span>
        <div className='grid grid-cols-6 gap-1 sm:grid-cols-12'>
          {seeds.map((seed) => (
            <div key={seed} className='flex flex-col gap-1'>
              <div
                className='h-10 rounded-sm ring-1 ring-default ring-inset'
                style={{ background: `var(--color-${seed})` }}
              />
              <span className='text-center font-mono text-xs text-tertiary'>
                {seed === 'brand-seed' ? 'light' : 'dark'}
              </span>
            </div>
          ))}
        </div>
      </div>
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
    light: '#2c2521, ink',
    dark: '#f3ede5, cream',
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
    light: 'seed, 20% toward black',
    dark: 'dark seed',
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
    dark: 'gray-950',
    property: 'color',
  },
  {
    utility: 'bg-primary',
    variable: '--ui-bg-primary',
    light: 'gray-25, card',
    dark: 'gray-900, card',
    property: 'background',
  },
  {
    utility: 'bg-secondary',
    variable: '--ui-bg-secondary',
    light: 'gray-100, sand page',
    dark: 'gray-950, brown page',
    property: 'background',
  },
  {
    utility: 'bg-tertiary',
    variable: '--ui-bg-tertiary',
    light: 'gray-200',
    dark: 'gray-800',
    property: 'background',
  },
  {
    utility: 'bg-elevated',
    variable: '--ui-bg-elevated',
    light: 'gray-25',
    dark: '#312b26',
    property: 'background',
  },
  {
    utility: 'bg-brand-solid',
    variable: '--ui-bg-brand-solid',
    light: 'seed',
    dark: 'dark seed',
    property: 'background',
  },
  {
    utility: 'bg-brand-subtle',
    variable: '--ui-bg-brand-subtle',
    light: 'seed 24% on #fbf7f1',
    dark: 'seed 32% on #211d1a',
    property: 'background',
  },
  {
    utility: 'bg-error-solid',
    variable: '--ui-bg-error-solid',
    light: 'error-600',
    dark: 'error-300',
    property: 'background',
  },
  {
    utility: 'border-default',
    variable: '--ui-border-default',
    light: 'gray-300',
    dark: 'gray-800',
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
    dark: '#36302b',
    property: 'border',
  },
  {
    utility: 'border-brand',
    variable: '--ui-border-brand',
    light: 'seed',
    dark: 'dark seed',
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
    light: 'seed',
    dark: 'dark seed',
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
    light: 'seed',
    dark: 'dark seed',
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
