import { Story } from '@storybook/react';
import ModalDefault, { Props } from 'core/components/Modal/ModalDefault';

export default {
  title: 'Components/Modal/Default',
  component: ModalDefault,
};

const Template: Story<Props> = (props: Props) => <ModalDefault {...props} />;
export const modalDefault = Template.bind({});
modalDefault.args = {
  children: 'content',
};
modalDefault.storyName = 'Default';
