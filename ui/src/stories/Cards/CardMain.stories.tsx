import { Story } from '@storybook/react';
import CardMain, { Props } from 'core/components/Card/Main';

export default {
  title: 'Components/Cards/Main',
  component: CardMain,
};

const Template: Story<Props> = (props: Props) => <CardMain {...props} />;
export const main = Template.bind({});
main.args = {
  children: '...',
};
