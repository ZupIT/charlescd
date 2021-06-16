import { Story, Meta } from '@storybook/react';
import Layer, { Props } from 'core/components/Layer';

export default {
  title: 'Components/Layer',
  component: Layer,
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#1c1c1e', color: '#98989e', width: '200px', height: '100px', padding: '10px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Wrapper that adds spacing and animation to a children content.',
      },
    },
  },
} as Meta;

const Template: Story<Props> = (props: Props) => <Layer {...props} />;
export const layer = Template.bind({});
layer.args = {
  children: 'my content inside Layer',
};