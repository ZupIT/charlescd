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

import React, { memo } from 'react';
import Text from 'core/components/Text';
import Styled from './styled';

interface Props {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: () => void;
}

const MenuItem = ({ id, name, isActive, onSelect }: Props) => (
  <Styled.Link
    onClick={onSelect}
    isActive={isActive}
    data-testid={`menu-users-${id}`}
  >
    <Styled.ListItem icon="user">
      <Text.h4 color="light">{name}</Text.h4>
    </Styled.ListItem>
  </Styled.Link>
);

export default memo(MenuItem);
