/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactNode } from 'react';
import Styled from './styled';
import { HEADINGS_FONT_SIZE } from './enums';

interface Props {
  fontSize?: HEADINGS_FONT_SIZE;
  color?: string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  weight?: 'normal' | 'bold' | 'light';
  align?: 'left' | 'center' | 'right';
  children: ReactNode;
  className?: string;
  title?: string;
}

const Text = (props: Props) => {
  const {
    color = 'primary',
    weight = 'normal',
    align = 'left',
    fontStyle = 'normal',
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
      fontStyle={fontStyle}
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
