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
import some from 'lodash/some';
import method from 'lodash/method';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import MenuItem from './MenuItem';
import Styled from './styled';
import Loader from './Loaders';

import { UserGroupPaginationItem } from '../interfaces/UserGroupsPagination';

interface ListProps {
  items: UserGroupPaginationItem[];
  selectedItems: string[];
  onSelect: (id: string) => void;
}

interface Props extends ListProps {
  onSearch: (name: string) => void;
  onCreate: () => void;
  isLoading: boolean;
}

const UserGroupList = ({ items, selectedItems, onSelect }: ListProps) => (
  <>
    {map(items, item => (
      <MenuItem
        key={item.id}
        id={item.id}
        name={item.name}
        isActive={some(selectedItems, method('includes', item.id))}
        onSelect={onSelect}
      />
    ))}
  </>
);

const UserGroupMenu = ({ onSearch, onCreate, isLoading, ...rest }: Props) => {
  return (
    <>
      <Styled.Actions>
        <Styled.Button onClick={onCreate}>
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create user group</Text.h5>
          </LabeledIcon>
        </Styled.Button>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput resume onSearch={onSearch} />
        <Styled.List>
          {isEmpty(rest.items) && isLoading ? (
            <Loader.List />
          ) : (
            <UserGroupList {...rest} />
          )}
        </Styled.List>
      </Styled.Content>
    </>
  );
};

export default UserGroupMenu;
