import { Story } from '@storybook/react';
import Avatar, { Props } from 'core/components/Avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
};

const Template: Story<Props> = (props: Props) => <Avatar {...props} />;
export const avatar = Template.bind({});
avatar.args = {
  name: 'Charles'
};
