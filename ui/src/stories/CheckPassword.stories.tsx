import { Story } from '@storybook/react';
import CheckPassword, { Props } from 'core/components/CheckPassword';

export default {
  title: 'Components/CheckPassword',
  component: CheckPassword,
};

const Template: Story<Props> = (props: Props) => <CheckPassword {...props} />;
export const password = Template.bind({});
password.args = {};

password.storyName = 'CheckPassword';
