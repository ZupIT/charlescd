import { Story } from '@storybook/react';
import FullScreen, { Props } from 'core/components/Modal/FullScreen';

export default {
  title: 'Components/Modal/FullScreen',
  component: FullScreen,
};

const Template: Story<Props> = (props: Props) => <FullScreen {...props} />;
export const fullScreen = Template.bind({});
fullScreen.args = {
  children: 'content',
};

fullScreen.storyName = 'FullScreen';
