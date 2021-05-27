import { Story } from '@storybook/react';
import CardBase from 'core/components/Card/Base';
import CardBody, { Props as CardBodyProps } from 'core/components/Card/Body';

export default {
  title: 'Components/Cards/Body',
  component: CardBody,
  parameters: {
    docs: {
      description: {
        component:
          'This component is used to wrap the main content of the card',
      },
    },
  },
};

const Template: Story<CardBodyProps> = (props: CardBodyProps) => {
  return (
    <CardBase color="gray">
      <CardBody {...props}>body</CardBody>
    </CardBase>
  );
};
export const body = Template.bind({});
body.args = {
  children: '...',
};
