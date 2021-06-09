import { Story } from '@storybook/react';
import Wizard, { Props } from 'core/components/Modal/Wizard';

export default {
  title: 'Components/Modal/Wizard',
  component: Wizard,
};

const Template: Story<Props> = (props: Props) => <Wizard {...props} />;
export const wizard = Template.bind({});
wizard.args = {};
