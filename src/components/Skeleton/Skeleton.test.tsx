import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['text', 'circle', 'rect'] as const)('renders the %s shape', (shape) => {
    const { container } = render(<Skeleton shape={shape} />);
    expect(container.firstChild).toHaveAttribute('data-shape', shape);
  });

  it('renders multiple text lines', () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.firstChild?.childNodes).toHaveLength(3);
  });

  it('has no axe violations in light and dark inside a busy region', async () => {
    await expectNoA11yViolations(() => (
      <div aria-busy="true" aria-label="Loading profile" role="region">
        <Skeleton shape="circle" />
        <Skeleton lines={2} />
        <Skeleton shape="rect" />
      </div>
    ));
  });
});
