import { Story } from '@storybook/react';
import LabeledIcon, { Props } from 'core/components/LabeledIcon';

export default {
  title: 'Components/LabeledIcon',
  component: LabeledIcon,
};

const Template: Story<Props> = (props: Props) => <LabeledIcon {...props} />;
export const labeledIcon = Template.bind({});
labeledIcon.args = {
  children: 'Change password',
  icon: 'account',
};

labeledIcon.storyName = 'LabeledIcon';