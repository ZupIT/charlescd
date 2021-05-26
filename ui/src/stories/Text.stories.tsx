import { Story } from '@storybook/react';
import { Text, Props } from 'core/components/Text';
import { HEADINGS_FONT_SIZE } from 'core/components/Text/enums';

export default {
  title: 'Components/Text',
  component: Text,
  argTypes: {
    fontSize: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: false,
      },
    },
  },
};

const TemplateH1: Story<Props> = (props: Props) => (
  <Text fontSize={HEADINGS_FONT_SIZE.h1} {...props} />
);
export const h1 = TemplateH1.bind({});
h1.args = {
  children: 'text',
};
h1.parameters = {
  docs: {
    source: {
      // type: 'code',
      // code: `<Text.h1 \n color="primary"\n>\ntext</Text.h1>`,
    },
  },
};

const TemplateH2: Story<Props> = (props: Props) => (
  <Text fontSize={HEADINGS_FONT_SIZE.h2} {...props} />
);
export const h2 = TemplateH2.bind({});
h2.args = {
  children: 'text',
};
h2.parameters = {
  docs: {
    source: {
      type: 'code',
      code: '<Text.h2 {...props}>text</Text.h2>',
    },
  },
};

const TemplateH3: Story<Props> = (props: Props) => (
  <Text fontSize={HEADINGS_FONT_SIZE.h3} {...props} />
);
export const h3 = TemplateH3.bind({});
h3.args = {
  children: 'text',
};
h3.parameters = {
  docs: {
    source: {
      type: 'code',
      code: '<Text.h3 {...props}>text</Text.h3>',
    },
  },
};

const TemplateH4: Story<Props> = (props: Props) => (
  <Text fontSize={HEADINGS_FONT_SIZE.h3} {...props} />
);
export const h4 = TemplateH4.bind({});
h4.args = {
  children: 'text',
};
h4.parameters = {
  docs: {
    source: {
      type: 'code',
      code: '<Text.h4 {...props}>text</Text.h4>',
    },
  },
};

const TemplateH5: Story<Props> = (props: Props) => (
  <Text fontSize={HEADINGS_FONT_SIZE.h3} {...props} />
);
export const h5 = TemplateH5.bind({});
h5.args = {
  children: 'text',
};
h5.parameters = {
  docs: {
    source: {
      type: 'code',
      code: '<Text.h5 {...props}>text</Text.h5>',
    },
  },
};

const TemplateH6: Story<Props> = (props: Props) => (
  <Text fontSize={HEADINGS_FONT_SIZE.h3} {...props} />
);
export const h6 = TemplateH6.bind({});
h6.args = {
  children: 'text',
};
h6.parameters = {
  docs: {
    source: {
      type: 'code',
      code: '<Text.h6 {...props}>text</Text.h6>',
    },
  },
};
