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

import { ReactNode } from 'react';
import Styled from './styled';
import { baseFontSize } from './constants';

export interface Props {
  tag: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
  lineHeight?: number;
  color?: string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  weight?: 'normal' | 'bold' | 'light';
  align?: 'left' | 'center' | 'right';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  title?: string;
}


export const Text = (props: Props) => {
  const {
    tag,
    color = 'primary',
    weight = 'normal',
    align = 'left',
    fontStyle = 'normal',
    lineHeight,
    children,
    className,
    onClick,
    role = '',
    title, 
  } = props;

  const fontSize = baseFontSize[tag];

  return (
    <Styled.Text
      {...props}
      color={color}
      onClick={onClick}
      align={align}
      weight={weight}
      fontSize={fontSize}
      fontStyle={fontStyle}
      className={className}
      lineHeight={lineHeight}
      role={role}
      title={title}
    >
      {children}
    </Styled.Text>
  );
};

export default Text;
