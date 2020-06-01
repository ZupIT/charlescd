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
import Text from 'core/components/Text';
import Card from 'core/components/Card';
import Styled from './styled';

export interface Props {
  title: string;
  children: ReactNode;
}

const CardRole = ({ title, children }: Props) => {
  const renderIcon = <Icon name="info" color="dark" size="15px" />;

  return (
    <Styled.Card>
      <Card.Header action={renderIcon}>
        <Text.h4 color="light" weight="bold">
          {title}
        </Text.h4>
      </Card.Header>
      <Styled.Body>{children}</Styled.Body>
    </Styled.Card>
  );
};

export default CardRole;
