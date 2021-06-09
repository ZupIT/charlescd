import { Story } from '@storybook/react';
import Badge, { Props } from 'core/components/Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: 'Badge was only created for Dark mode',
      },
    },
  },
};

const Template: Story<Props> = (props: Props) => <Badge {...props} />;

export const badge = Template.bind({});
badge.args = {
  label: 'text',
};

badge.storyName = 'Badge';