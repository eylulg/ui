import { render, screen } from '@testing-library/react';
import { Star } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Badge } from './Badge';

const colors = ['gray', 'brand', 'success', 'warning', 'error'] as const;

describe('Badge', () => {
  it('renders its text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it.each(colors)('exposes the %s color', (color) => {
    render(<Badge color={color}>{color}</Badge>);
    expect(screen.getByText(color)).toHaveAttribute('data-color', color);
  });

  it('hides the dot and icon from assistive technology', () => {
    const { container } = render(
      <Badge dot icon={Star}>
        Featured
      </Badge>,
    );
    const decorations = container.querySelectorAll('[aria-hidden="true"]');
    expect(decorations).toHaveLength(2);
  });

  it('merges a custom className', () => {
    render(<Badge className="px-4">Wide</Badge>);
    const badge = screen.getByText('Wide');
    expect(badge.className).toContain('px-4');
    expect(badge.className).not.toContain('px-2.5');
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        {colors.map((color) => (
          <Badge key={color} color={color} dot>
            {color}
          </Badge>
        ))}
      </div>
    ));
  });
});
