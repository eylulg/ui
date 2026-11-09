import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Tag, TagGroup } from './Tag';

const initial = [
  { id: 'react', name: 'React' },
  { id: 'aria', name: 'React Aria' },
  { id: 'tailwind', name: 'Tailwind' },
];

function RemovableTags() {
  const [items, setItems] = useState(initial);
  return (
    <TagGroup
      label="Skills"
      items={items}
      onRemove={(keys) => setItems((current) => current.filter((item) => !keys.has(item.id)))}
    >
      {(item) => <Tag id={item.id}>{item.name}</Tag>}
    </TagGroup>
  );
}

describe('Tag', () => {
  it('renders a labelled grid of tags', () => {
    render(
      <TagGroup label="Stack">
        <Tag>React</Tag>
        <Tag>Vite</Tag>
      </TagGroup>,
    );
    expect(screen.getByRole('grid', { name: 'Stack' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('shows no remove button unless onRemove is set', () => {
    render(
      <TagGroup label="Stack">
        <Tag>React</Tag>
      </TagGroup>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('removes a tag with its remove button', async () => {
    const user = userEvent.setup();
    render(<RemovableTags />);
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    expect(removeButtons).toHaveLength(3);
    await user.click(removeButtons[0]!);
    expect(screen.queryByText('React')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('moves with arrow keys and removes with Backspace', async () => {
    const user = userEvent.setup();
    render(<RemovableTags />);
    await user.tab();
    expect(screen.getByRole('row', { name: 'React' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('row', { name: 'React Aria' })).toHaveFocus();
    await user.keyboard('{Backspace}');
    expect(screen.queryByRole('row', { name: 'React Aria' })).not.toBeInTheDocument();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <RemovableTags />);
    await expectNoA11yViolations(() => (
      <TagGroup label="Filters" selectionMode="multiple" defaultSelectedKeys={['a']}>
        <Tag id="a">Open</Tag>
        <Tag id="b">Closed</Tag>
      </TagGroup>
    ));
  });
});
