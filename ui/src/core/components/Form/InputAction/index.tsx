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

interface Props {
  name: string;
  icon: string;
  iconColor?: string;
  defaultValue: string;
  isDisabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}

const InputAction = ({
  name,
  icon,
  iconColor = 'dark',
  defaultValue,
  onClick,
  isDisabled = false,
  className
}: Props) => {
  return (
    <Styled.Wrapper className={className} data-testid={`input-action-${name}`}>
      <Styled.Input
        name={name}
        disabled={isDisabled}
        defaultValue={defaultValue}
      />
      <Styled.Action
        data-testid={`input-action-${name}-button`}
        onClick={onClick}
      >
        <Styled.Icon name={icon} color={iconColor} size="15px" />
      </Styled.Action>
    </Styled.Wrapper>
  );
};

export default InputAction;
