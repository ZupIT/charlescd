import { Story } from '@storybook/react';
import ButtonDefault, { Props } from 'core/components/Button/ButtonDefault';

export default {
  title: 'Components/Button',
  component: ButtonDefault,
  parameters: {
    docs: {
      description: {
        component: 'To create a new customized button, you should extend ButtonDefault component',
      },
    },
  },
};

const Template: Story<Props> = (props: Props) => <ButtonDefault {...props} />;
export const buttonDefault = Template.bind({});
buttonDefault.args = {
  children: 'text',
};

buttonDefault.storyName = 'Default';