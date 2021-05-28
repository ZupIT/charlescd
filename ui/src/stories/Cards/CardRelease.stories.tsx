import { Story } from '@storybook/react';
import CardRelease, { Props } from 'core/components/Card/Release';

export default {
  title: 'Components/Cards/Release',
  component: CardRelease,
};

const Template: Story<Props> = (props: Props) => <CardRelease {...props} />;
export const release = Template.bind({});
release.args = {
  status: 'DEPLOYED',
  description: '...',
};
