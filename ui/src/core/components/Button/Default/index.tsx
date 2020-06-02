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
import Styled from './styled';

export interface Props {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  size?: 'EXTRA_SMALL' | 'SMALL' | 'LARGE' | 'EXTRA_LARGE';
  id?: string;
  type?: 'button' | 'reset' | 'submit';
}

export enum HEIGHT {
  EXTRA_SMALL = '30px',
  SMALL = '40px',
  LARGE = '50px',
  EXTRA_LARGE = '60px'
}

const Button = ({
  children,
  onClick,
  className,
  id,
  isLoading,
  isDisabled = false,
  type = 'button',
  size = 'SMALL',
  ...rest
}: Props) => (
  <Styled.Button
    data-testid={`button-default-${id}`}
    className={className}
    onClick={onClick}
    size={size}
    type={type}
    disabled={isDisabled || isLoading}
    {...rest}
  >
    {isLoading ? (
      <Styled.Loading name="loading" size={HEIGHT[size]} />
    ) : (
      children
    )}
  </Styled.Button>
);

export default Button;
