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

import React, { Fragment, useEffect, useState } from 'react';
import map from 'lodash/map';
import some from 'lodash/some';
import method from 'lodash/method';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import InfiniteScroll from 'core/components/InfiniteScroll';
import MenuItem from './MenuItem';
import Loader from './Loaders';
import Styled from './styled';

import {
  UserGroupPagination,
  UserGroupPaginationItem
} from '../interfaces/UserGroupsPagination';
import { useFindAllUserGroup } from '../hooks';
import { useGlobalState } from 'core/state/hooks';

interface ListProps {
  // list: UserGroupPagination;
  selectedItems: string[];
  onSelect: (id: string) => void;
}

interface Props extends ListProps {
  onCreate: () => void;
}

const UserGroupMenu = ({ onCreate, selectedItems, onSelect }: Props) => {
  const [name, setName] = useState<string>('');
  const [getUserGroups, loading] = useFindAllUserGroup();
  const { list } = useGlobalState(({ userGroups }) => userGroups);

  useEffect(() => {
    const page = 0;
    console.log('name', name);
    getUserGroups(name, page);
  }, [name]);

  const loadMore = (page: number) => {
    getUserGroups(name, page);
  };

  const renderList = ({ selectedItems, onSelect }: ListProps) => (
    <InfiniteScroll
      hasMore={!list.last}
      loadMore={loadMore}
      isLoading={loading}
      loader={<Styled.Loader />}
    >
      {map(list?.content, item => (
        <MenuItem
          key={item.id}
          id={item.id}
          name={item.name}
          isActive={some(selectedItems, method('includes', item.id))}
          onSelect={onSelect}
        />
      ))}
    </InfiniteScroll>
  );

  return (
    <Fragment>
      <Styled.Actions>
        <Styled.Button onClick={onCreate}>
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create user group</Text.h5>
          </LabeledIcon>
        </Styled.Button>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput resume onSearch={setName} />
        <Styled.List data-testid="user-group-menu">
          {isEmpty(list?.content) && loading ? (
            <Loader.List />
          ) : (
            renderList({ selectedItems, onSelect })
          )}
        </Styled.List>
      </Styled.Content>
    </Fragment>
  );
};

export default UserGroupMenu;
