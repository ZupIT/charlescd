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
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import routes from 'core/constants/routes';
import { UserPaginationItem } from '../interfaces/UserPagination';
import MenuItem from './MenuItem';
import Styled from './styled';
import Loader from './Loaders';
import useQueryStrings from 'core/utils/query';
import { addParam, delParam } from 'core/utils/path';

interface Props {
  items: UserPaginationItem[];
  onSearch: (name: string) => void;
  isLoading: boolean;
}

const UserMenu = ({ items, onSearch, isLoading }: Props) => {
  const history = useHistory();
  const query = useQueryStrings();

  const isActive = (id: string) => query.getAll('user').includes(id);

  const toggleUser = (id: string) =>
    isActive(id)
      ? delParam('user', routes.usersComparation, history, id)
      : addParam('user', routes.usersComparation, history, id);

  const renderUsers = () =>
    map(items, ({ email, name }: UserPaginationItem) => (
      <MenuItem
        key={email}
        id={email}
        name={name}
        isActive={isActive(email)}
        onSelect={() => toggleUser(email)}
      />
    ));

  return (
    <>
      <Styled.Actions>
        <Styled.Link onClick={() => toggleUser('create')} isActive={false}>
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create user</Text.h5>
          </LabeledIcon>
        </Styled.Link>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput resume onSearch={onSearch} />
        <Styled.List>
          {isEmpty(items) && isLoading ? <Loader.List /> : renderUsers()}
        </Styled.List>
      </Styled.Content>
    </>
  );
};

export default UserMenu;
