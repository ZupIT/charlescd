import { Story } from '@storybook/react';
import Editor, { Props } from 'core/components/Editor';

export default {
  title: 'Components/Editor',
  component: Editor,
};

const Template: Story<Props> = (props: Props) => <Editor {...props} />;
export const editor = Template.bind({});
editor.args = {
  width: '400px',
  height: '200px',
};
