import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { CodeBlock } from '../CodeBlock';

const code = 'npm install @eylulg/ui';

describe('CodeBlock', () => {
  it('copies the text and announces it', async () => {
    const user = userEvent.setup();
    render(
      <CodeBlock label='Install command' copyable>
        {code}
      </CodeBlock>,
    );

    await user.click(screen.getByRole('button', { name: 'Copy code' }));

    expect(await screen.findByText('Copied')).toBeInTheDocument();
    await expect(navigator.clipboard.readText()).resolves.toBe(code);
  });

  it('is a named, focusable block so a keyboard user can scroll it', async () => {
    const user = userEvent.setup();
    render(<CodeBlock label='Install command'>{code}</CodeBlock>);

    await user.tab();

    expect(screen.getByRole('group', { name: 'Install command' })).toHaveFocus();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <div>
        <CodeBlock label='Plain'>{code}</CodeBlock>
        <CodeBlock label='Copyable' copyable wrap>
          {code}
        </CodeBlock>
      </div>
    ));
  });
});
