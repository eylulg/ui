import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/a11y';
import { Tab, TabList, TabPanel, Tabs } from '../Tabs';

describe('Tabs', () => {
  it('has no axe violations in light and dark', async () => {
    await expectNoA11yViolations(() => (
      <Tabs>
        <TabList aria-label='Account'>
          <Tab id='profile'>Profile</Tab>
          <Tab id='billing'>Billing</Tab>
          <Tab id='team' isDisabled>
            Team
          </Tab>
        </TabList>
        <TabPanel id='profile'>Profile settings</TabPanel>
        <TabPanel id='billing'>Billing settings</TabPanel>
        <TabPanel id='team'>Team settings</TabPanel>
      </Tabs>
    ));
  });
});
