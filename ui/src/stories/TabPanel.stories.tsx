import { Story } from '@storybook/react';
import TabPanel, { Props } from 'core/components/TabPanel';

export default {
  title: 'Components/Tab Panel',
  component: TabPanel,
};

const Template: Story<Props> = (props: Props) => <TabPanel {...props} />;
export const tabPanel = Template.bind({});
tabPanel.args = {
  children: 'Tab',
};
