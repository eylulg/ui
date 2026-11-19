import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { BrandMark } from '../BrandMark';

describe('BrandMark', () => {
  it('is an image named by its title', () => {
    render(<BrandMark title='Eylül Güneş' />);

    expect(screen.getByRole('img', { name: 'Eylül Güneş' })).toBeInTheDocument();
  });

  it('is hidden from assistive technology without a title', () => {
    render(<BrandMark />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <BrandMark title='Eylül Güneş' />);
  });
});
