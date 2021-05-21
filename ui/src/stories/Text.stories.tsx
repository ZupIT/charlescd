import { Story, Meta } from '@storybook/react';
import Text, { Props } from 'core/components/Text';

const argTypes = {
  color: {
    description: 'string',
    defaultValue: 'primary',
    control: {
      type: 'select',
      options: [
        'dark',
        'error',
        'light',
        'medium',
        'primary',
        'success',
        'warning',
        'stable',
        'link',
      ],
    },
  },
  weight: {
    description: 'string',
    defaultValue: 'normal',
    control: {
      type: 'select',
      options: ['light', 'normal', 'bold'],
    },
  },
  align: {
    description: 'string',
    defaultValue: 'left',
    control: {
      type: 'select',
      options: ['left', 'center', 'right'],
    },
  },
  lineHeight: {
    description:
      '`string` the default value is the `fontsize` **h1: 32px, h2: 18px, h3: 16px, h4: 14px, h5: 12px, h6: 10px**',
    control: {
      type: 'text',
    },
  },
  fontStyle: {
    description: 'string',
    defaultValue: 'normal',
    control: {
      type: 'select',
      options: ['normal', 'italic', 'oblique'],
    },
  },
  role: {
    description: 'string',
    defaultvalue: '',
  },
  onClick: {
    description: 'function',
  },
  children: {
    description: 'ReactNode',
  },
};

const params = {
  docs: {
    source: {
      type: 'code',
    },
  },
};

export default {
  title: 'Components/Text',
  component: Text.h1,
  argTypes,
} as Meta;

const TemplateH1: Story<Props> = ({
  color,
  weight,
  align,
  lineHeight,
  fontStyle,
  role,
  onClick,
  children,
}: Props) => (
  <Text.h1
    color={color}
    weight={weight}
    align={align}
    lineHeight={lineHeight}
    fontStyle={fontStyle}
    role={role}
    onClick={onClick}
  >
    {children}
  </Text.h1>
);

export const h1 = TemplateH1.bind({});
h1.parameters = params;
h1.args = {
  children: 'Text h1',
};

const TemplateH2: Story<Props> = (props: Props) => <Text.h2 {...props} />;
export const h2 = TemplateH2.bind({});
h2.parameters = params;
h2.args = {
  children: 'Text h2',
};

const TemplateH3: Story<Props> = (props: Props) => <Text.h3 {...props} />;
export const h3 = TemplateH3.bind({});
h3.parameters = params;
h3.args = {
  children: 'Text h3',
};

const TemplateH4: Story<Props> = (props: Props) => <Text.h4 {...props} />;
export const h4 = TemplateH4.bind({});
h4.parameters = params;
h4.args = {
  children: 'Text h4',
};

const TemplateH5: Story<Props> = (props: Props) => <Text.h5 {...props} />;
export const h5 = TemplateH5.bind({});
h5.parameters = params;
h5.args = {
  children: 'Text h5',
};

const TemplateH6: Story<Props> = (props: Props) => <Text.h6 {...props} />;
export const h6 = TemplateH6.bind({});
h6.parameters = params;
h6.args = {
  children: 'Text h6',
};
