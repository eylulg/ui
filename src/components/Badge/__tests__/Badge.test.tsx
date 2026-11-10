import { Star } from 'lucide-react';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        {(
          [
            'gray',
            'brand',
            'success',
            'warning',
            'error',
            'blue',
            'purple',
            'pink',
            'orange',
            'indigo',
          ] as const
        ).map((color) => (
          <Badge key={color} color={color} dot icon={Star}>
            {color}
          </Badge>
        ))}
      </div>
    ));
  });
});
