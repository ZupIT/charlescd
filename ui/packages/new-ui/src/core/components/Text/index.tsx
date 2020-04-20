import React, { ReactNode } from 'react';
import Styled from './styled';
import { HEADINGS_FONT_SIZE } from './enums';

interface Props {
  fontSize?: HEADINGS_FONT_SIZE;
  color?: 'primary' | 'dark' | 'error' | 'light' | 'medium' | 'success';
  weight?: 'normal' | 'bold' | 'light';
  align?: 'left' | 'center' | 'right';
  children: ReactNode;
  className?: string;
}

const Text = (props: Props) => {
  const {
    color = 'primary',
    weight = 'normal',
    align = 'left',
    fontSize,
    children,
    className
  } = props;

  return (
    <Styled.Text
      {...props}
      color={color}
      align={align}
      weight={weight}
      fontSize={fontSize}
      className={className}
    >
      {children}
    </Styled.Text>
  );
};

const TextComponent = {
  h1: (props: Props) => <Text fontSize={HEADINGS_FONT_SIZE.h1} {...props} />,
  h2: (props: Props) => <Text fontSize={HEADINGS_FONT_SIZE.h2} {...props} />,
  h3: (props: Props) => <Text fontSize={HEADINGS_FONT_SIZE.h3} {...props} />,
  h4: (props: Props) => <Text fontSize={HEADINGS_FONT_SIZE.h4} {...props} />,
  h5: (props: Props) => <Text fontSize={HEADINGS_FONT_SIZE.h5} {...props} />,
  h6: (props: Props) => <Text fontSize={HEADINGS_FONT_SIZE.h6} {...props} />
};

export default TextComponent;
