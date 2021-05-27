import { Story } from '@storybook/react';
import CardBase from 'core/components/Card/Base';
import CardHeader, {
  Props as CardHeaderProps,
} from 'core/components/Card/Header';

export default {
  title: 'Components/Cards/Header',
  component: CardHeader,
  parameters: {
    docs: {
      description: {
        component: 'Basic component to attach header an card',
      },
    },
  },
};

const Template: Story<CardHeaderProps> = (props: CardHeaderProps) => {
  return (
    <CardBase color="gray">
      <CardHeader {...props}>header</CardHeader>
    </CardBase>
  );
};
export const header = Template.bind({});
header.args = {
  children: '...',
};
