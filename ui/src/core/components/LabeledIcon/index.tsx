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
import Icon from 'core/components/Icon';
import Styled from './styled';

export interface Props {
  children: ReactNode;
  icon: string;
  marginContent?: string;
  size?: string;
  className?: string;
  isActive?: boolean;
  onClick?: Function;
}

const LabeledIcon = ({
  children,
  icon,
  className,
  size = '15px',
  isActive,
  marginContent = '5px',
  onClick
}: Props) => {
  return (
    <Styled.Wrapper
      className={className}
      data-testid={`labeledIcon-${icon}`}
      onClick={() => onClick && onClick()}
    >
      <Icon name={icon} size={size} color="dark" isActive={isActive} />
      <Styled.Label marginContent={marginContent}>{children}</Styled.Label>
    </Styled.Wrapper>
  );
};

export default LabeledIcon;
