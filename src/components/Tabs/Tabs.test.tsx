import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

function Example(props: Partial<React.ComponentProps<typeof Tabs>>) {
  return (
    <Tabs {...props}>
      <TabList aria-label="Account">
        <Tab id="profile">Profile</Tab>
        <Tab id="billing">Billing</Tab>
        <Tab id="team" isDisabled>
          Team
        </Tab>
        <Tab id="security">Security</Tab>
      </TabList>
      <TabPanel id="profile">Profile settings</TabPanel>
      <TabPanel id="billing">Billing settings</TabPanel>
      <TabPanel id="team">Team settings</TabPanel>
      <TabPanel id="security">Security settings</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a tablist with the first tab selected', () => {
    render(<Example />);
    expect(screen.getByRole('tablist', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Profile settings');
  });

  it('moves with arrow keys, skipping disabled tabs', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Example onSelectionChange={onSelectionChange} />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Billing settings');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveFocus();
    expect(onSelectionChange).toHaveBeenLastCalledWith('security');
  });

  it('jumps with Home and End', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus();
  });

  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => <Example />);
    await expectNoA11yViolations(() => (
      <Example orientation="vertical" defaultSelectedKey="billing" />
    ));
  });
});
