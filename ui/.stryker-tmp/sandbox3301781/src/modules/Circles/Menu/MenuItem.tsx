// @ts-nocheck
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
import { useHistory } from 'react-router';
import useQueryStrings from 'core/utils/query';
import Text from 'core/components/Text';
import { addParam, delParam } from 'core/utils/path';
import routes from 'core/constants/routes';
import Styled from './styled';

interface Props {
  id: string;
  name: string;
}

const MenuItem = ({ id, name }: Props) => {
  const history = useHistory();
  const query = useQueryStrings();

  const isActive = () => query.getAll('circle').includes(id);

  const toggleCircle = () =>
    isActive()
      ? delParam('circle', routes.circlesComparation, history, id)
      : addParam('circle', routes.circlesComparation, history, id);

  return (
    <Styled.Link
      onClick={toggleCircle}
      isActive={isActive()}
      data-testid={`menu-item-circle-${id}`}
    >
      <Styled.ListItem icon="circle-menu" isActive={isActive()}>
        <Text tag="H4" color="light">{name}</Text>
      </Styled.ListItem>
    </Styled.Link>
  );
};

export default MenuItem;
