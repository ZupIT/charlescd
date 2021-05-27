import { Story } from '@storybook/react';
import CardConfig, { Props } from 'core/components/Card/Config';

export default {
  title: 'Components/Cards/Config',
  component: CardConfig,
  argTypes: {
    icon: {
      description:
        'You should use an svg name (cores/assests/svg) e.g. **workspace**',
    },
  },
};

const Template: Story<Props> = (props: Props) => <CardConfig {...props} />;
export const config = Template.bind({});
config.args = {
  children: '...',
  icon: 'workspace',
};
