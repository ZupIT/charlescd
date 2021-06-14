import { Story } from '@storybook/react';
import InputLink, { Props } from 'core/components/Form/InputLink';

export default {
  title: 'Components/Form/Input',
  component: InputLink,
};

const Template: Story<Props> = (props: Props) => <InputLink {...props} />;
export const inputLink = Template.bind({});
inputLink.args = {
  name: 'link',
  href: 'https://charlescd.io'
};
