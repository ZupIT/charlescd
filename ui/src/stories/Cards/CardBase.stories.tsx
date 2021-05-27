import { Story } from '@storybook/react';
import CardBase, { Props } from 'core/components/Card/Base';

export default {
  title: 'Components/Cards/Base',
  component: CardBase,
  parameters: {
    docs: {
      description: {
        component: 'Basic component to create any card',
      },
    },
  },
};

const Template: Story<Props> = (props: Props) => <CardBase {...props} />;
export const base = Template.bind({});
base.args = {
  children: '...',
  color: 'gray',
};
