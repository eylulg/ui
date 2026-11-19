import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { List } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { SegmentedControl, SegmentedControlItem } from '../SegmentedControl';

function View({ onSelectionChange }: { onSelectionChange?: (key: unknown) => void }) {
  return (
    <SegmentedControl
      aria-label='View'
      defaultSelectedKey='list'
      onSelectionChange={onSelectionChange}
    >
      <SegmentedControlItem id='list'>List</SegmentedControlItem>
      <SegmentedControlItem id='board'>Board</SegmentedControlItem>
    </SegmentedControl>
  );
}

describe('SegmentedControl', () => {
  it('starts on the default segment, and the arrow keys move focus before Space chooses', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<View onSelectionChange={onSelectionChange} />);

    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Board' })).toHaveFocus();
    await user.keyboard(' ');

    expect(screen.getByRole('radio', { name: 'Board' })).toBeChecked();
    expect(onSelectionChange).toHaveBeenCalledWith('board');
  });

  it('keeps one segment chosen when the chosen one is pressed again', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<View onSelectionChange={onSelectionChange} />);

    await user.click(screen.getByRole('radio', { name: 'List' }));

    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <View />
        <SegmentedControl aria-label='Layout' size='sm' defaultSelectedKey='a'>
          <SegmentedControlItem id='a' icon={List} aria-label='List layout' />
          <SegmentedControlItem id='b' isDisabled>
            Disabled
          </SegmentedControlItem>
        </SegmentedControl>
      </div>
    ));
  });
});
