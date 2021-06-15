import { Story } from '@storybook/react';
import Trigger, { Props } from 'core/components/Modal/Trigger';

export default {
  title: 'Components/Modal/Trigger',
  component: Trigger,
};

const Template: Story<Props> = (props: Props) => <Trigger {...props} />;
export const trigger = Template.bind({});
trigger.args = {
  title: 'Confirm?',
  dismissLabel: 'cancel',
  continueLabel: 'ok',
};
