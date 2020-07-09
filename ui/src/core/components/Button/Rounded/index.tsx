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

import React from 'react';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';
import { PrimaryColors } from 'core/interfaces/PrimaryColors';

export interface Props {
  children: string;
  isLoading?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  name?: string;
  icon?: string;
  color?: PrimaryColors;
  isDisabled?: boolean;
  backgroundColor?: 'default' | 'primary';
  size?: 'default' | 'small';
}

const ButtonRounded = ({
  children,
  name,
  icon,
  color,
  onClick,
  isLoading,
  className,
  isDisabled,
  backgroundColor = 'default',
  size = 'default',
  ...rest
}: Props) => (
  <Styled.Button
    {...rest}
    data-testid={`button-iconRounded-${name}`}
    onClick={onClick}
    disabled={isLoading || isDisabled}
    className={className}
    backgroundColor={backgroundColor}
    size={size}
  >
    {isLoading ? (
      <Icon name="loading" size="15px" color={color} />
    ) : (
      icon && <Icon name={icon} size="15px" color={color} />
    )}
    <Text.h5 color={color} weight="bold" align="left">
      {children}
    </Text.h5>
  </Styled.Button>
);

export default ButtonRounded;
