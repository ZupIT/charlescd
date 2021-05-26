import { Story } from '@storybook/react';
import TabPanel, { Props } from 'core/components/TabPanel';

export default {
  title: 'Components/TabPanel',
  component: TabPanel,
};

const Template: Story<Props> = (props: Props) => <TabPanel {...props} />;
export const tabpanel = Template.bind({});
tabpanel.args = {
  children: 'Tab',
};
