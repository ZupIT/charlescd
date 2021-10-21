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
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import getQueryStrings from 'core/utils/query';
import UsersComparationItem from 'modules/Users/Comparation/Item';
import Styled from './styled';
import CreateUser from '../Create';
import { CreateTabID } from '../constants';

interface Props {
  onChange: (userStatus: string) => void;
}

const UsersComparation = ({ onChange }: Props) => {
  const query = getQueryStrings();
  const users = query.getAll('user');

  const renderItems = () =>
    map(reverse(users), email =>
      email !== CreateTabID ? (
        <UsersComparationItem
          key={email}
          email={email}
          onChange={(delUserStatus: string) => onChange(delUserStatus)}
        />
      ) : (
        <CreateUser
          key={CreateTabID}
          onFinish={(createUserStatus: string) => onChange(createUserStatus)}
        />
      )
    );

  return (
    <Styled.Wrapper data-testid="users-comparation">
      {renderItems()}
    </Styled.Wrapper>
  );
};

export default UsersComparation;
