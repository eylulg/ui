import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { Key } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Tag, TagGroup } from '../Tag';

const initial = [
  { id: 'react', name: 'React' },
  { id: 'aria', name: 'React Aria' },
  { id: 'tailwind', name: 'Tailwind' },
];

function RemovableTags() {
  const [items, setItems] = useState(initial);

  function handleRemove(keys: Set<Key>) {
    setItems((current) => current.filter((item) => !keys.has(item.id)));
  }

  return (
    <TagGroup label="Skills" items={items} onRemove={handleRemove}>
      {(item) => <Tag id={item.id}>{item.name}</Tag>}
    </TagGroup>
  );
}

describe('Tag', () => {
  it('removes a tag with its remove button', async () => {
    const user = userEvent.setup();
    render(<RemovableTags />);

    await user.click(screen.getAllByRole('button', { name: /remove/i })[0] ?? document.body);

    expect(screen.queryByRole('row', { name: 'React' })).not.toBeInTheDocument();
  });

  it('shows no remove button without onRemove', () => {
    render(
      <TagGroup label="Stack">
        <Tag>React</Tag>
      </TagGroup>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <RemovableTags />
        <TagGroup label="Filters" selectionMode="multiple" defaultSelectedKeys={['a']}>
          <Tag id="a">Open</Tag>
          <Tag id="b">Closed</Tag>
        </TagGroup>
      </div>
    ));
  });
});
