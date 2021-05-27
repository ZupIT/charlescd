import { Story } from '@storybook/react';
import ButtonRounded, { Props } from 'core/components/Button/ButtonRounded';

export default {
  title: 'Components/Button',
  component: ButtonRounded,
  parameters: {
    layout: 'centered'
  },
};

const Template: Story<Props> = (props: Props) => <ButtonRounded {...props} />;
export const buttonRounded = Template.bind({});
buttonRounded.args = {
  children: 'my button',
};

buttonRounded.storyName = 'Rounded';