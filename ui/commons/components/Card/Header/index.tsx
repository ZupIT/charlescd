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

export interface Props {
  icon?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}

const CardHeader = ({ icon, children, action }: Props) => {
  const renderIcon = () => <Styled.Icon>{icon}</Styled.Icon>;

  const renderAction = () => <Styled.Action>{action}</Styled.Action>;

  return (
    <Styled.CardHeader>
      {icon && renderIcon()}
      {children}
      {action && renderAction()}
    </Styled.CardHeader>
  );
};

export default CardHeader;
