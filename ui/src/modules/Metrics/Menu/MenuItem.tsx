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
import { useHistory } from 'react-router-dom';
import startsWith from 'lodash/startsWith';
import { getActiveMenuId } from 'core/utils/menu';
import Styled from './styled';

export interface Props {
  id: string;
  name: string;
  route: string;
}

const MenuItem = ({ route, id, name }: Props) => {
  const history = useHistory();
  const activeMenuId = getActiveMenuId();
  const isActive = startsWith(activeMenuId, id);

  return (
    <Styled.Link onClick={() => history.push(route)} isActive={isActive}>
      <Styled.ListItem icon="metrics" marginContent="8px" isActive={isActive}>
        <Styled.Item color="light">{name}</Styled.Item>
      </Styled.ListItem>
    </Styled.Link>
  );
};

export default MenuItem;
