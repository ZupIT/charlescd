import { Story } from '@storybook/react';
import Layer, { Props } from 'core/components/Layer';

export default {
  title: 'Components/Layer',
  component: Layer,
};

const Template: Story<Props> = (props: Props) => <Layer {...props} />;
export const layer = Template.bind({});
layer.args = {
  children: 'My content here',
};