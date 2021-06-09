import { Story } from '@storybook/react';
import Link, { Props } from 'core/components/Link';

export default {
  title: 'Components/Link',
  component: Link,
};

const Template: Story<Props> = (props: Props) => <Link {...props} />;
export const link = Template.bind({});
link.args = {
  href: 'https://charlescd.io',
  children: 'Link'
};
