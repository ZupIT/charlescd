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
import Styled from './styled';
import { useHistory } from 'react-router-dom';
import useQueryStrings from 'core/utils/query';
import { addParam, delParam } from 'core/utils/path';
import routes from 'core/constants/routes';

interface Props {
  id: string;
  name: string;
  email: string;
}

const MenuItem = ({ id, name, email }: Props) => {
  const history = useHistory();
  const query = useQueryStrings();

  const isActive = () => query.getAll('user').includes(id);

  const toggleUser = () =>
    isActive()
      ? delParam('user', routes.usersComparation, history, id)
      : addParam('user', routes.usersComparation, history, id);

  return (
    <Styled.Link
      onClick={() => toggleUser()}
      isActive={isActive()}
      data-testid={`menu-users-${email}`}
    >
      <Styled.ListItem icon="user">
        <Text.h4 color="light">{name}</Text.h4>
      </Styled.ListItem>
    </Styled.Link>
  );
};

export default MenuItem;
