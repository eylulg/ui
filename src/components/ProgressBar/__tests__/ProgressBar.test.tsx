import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it.each([
    { props: { value: 40 }, shown: '40%' },
    { props: { value: 3, maxValue: 8, valueLabel: '3 of 8 files' }, shown: '3 of 8 files' },
  ])('shows the value text $shown', ({ props, shown }) => {
    render(<ProgressBar label='Upload' {...props} />);

    expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveTextContent(shown);
  });

  it.each([
    { hideValue: true, isIndeterminate: false },
    { hideValue: false, isIndeterminate: true },
  ])('hides the value text with $hideValue or indeterminate $isIndeterminate', (props) => {
    render(<ProgressBar label='Upload' value={40} {...props} />);

    expect(screen.getByRole('progressbar', { name: 'Upload' })).not.toHaveTextContent('40%');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <ProgressBar label='Storage' value={72} tone='warning' />
        <ProgressBar aria-label='Sync' isIndeterminate size='sm' />
        <ProgressBar
          label='Checks'
          value={3}
          maxValue={8}
          valueLabel='3 of 8 passed'
          tone='success'
        />
      </div>
    ));
  });
});
