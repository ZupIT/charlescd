import { Story } from '@storybook/react';
import CardConfig, {
  Props as CardConfigProps,
} from 'core/components/Card/Config';
import CardExpand from 'core/components/Card/Expand';
import CardBody from 'core/components/Card/Body';
import { useState } from 'react';

export default {
  title: 'Components/Cards/Expand',
  component: CardExpand,
};

const Template: Story<CardConfigProps> = (props: CardConfigProps) => {
  const [toggle, setToggle] = useState(false);
  return (
    <CardConfig {...props}>
      <CardBody onClick={() => setToggle(true)}>click here</CardBody>
      {toggle && (
        <CardExpand onClick={() => setToggle(false)}>expand content</CardExpand>
      )}
    </CardConfig>
  );
};

export const expand = Template.bind({});
expand.args = {};
expand.parameters = {
  docs: {
    source: {
      type: 'code',
    },
  },
};
