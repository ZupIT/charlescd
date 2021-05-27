import { Story } from '@storybook/react';
import Text, { Props } from 'core/components/Text';

export default {
  title: 'Components/Text',
  component: Text,
};

const Template: Story<Props> = (props: Props) => <Text {...props} />;
export const text = Template.bind({});
text.args = {
  children: 'Text'
};
