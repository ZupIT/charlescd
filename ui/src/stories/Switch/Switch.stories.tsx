import { Story } from '@storybook/react';
import Switch, { Props } from 'core/components/Switch';

export default {
  title: 'Components/Switch',
  component: Switch,
};

const Template: Story<Props> = (props: Props) => <Switch {...props} />;
export const switchComponent = Template.bind({});
switchComponent.args = {
  label: 'Global',
};

switchComponent.storyName = 'Switch';
