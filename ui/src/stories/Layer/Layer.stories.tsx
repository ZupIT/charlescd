import { Story, Meta } from '@storybook/react';
import Layer, { Props } from 'core/components/Layer';
import Styled from './styled';

export default {
  title: 'Components/Layer',
  component: Layer,
  parameters: {
    docs: {
      description: {
        component: 'Wrapper that adds spacing and animation to a children content.',
      },
    },
  },
} as Meta;

const Template: Story<Props> = (props: Props) => {
  return(
    <Styled.Outside>
      <Layer {...props}>
        <Styled.Content>my content inside Layer</Styled.Content>
      </Layer>
    </Styled.Outside>
  );
};
export const layer = Template.bind({});