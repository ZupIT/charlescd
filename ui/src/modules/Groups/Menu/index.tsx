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

import React, { Fragment, useEffect, useState, useCallback } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import InfiniteScroll from 'core/components/InfiniteScroll';
import { useDispatch, useGlobalState } from 'core/state/hooks';
import MenuItem from './MenuItem';
import Styled from './styled';
import { isActiveById } from '../helpers';
import { useFindAllUserGroup } from '../hooks';
import { resetUserGroupsAction } from '../state/actions';
import { UserGroup } from '../interfaces/UserGroups';

interface Props {
  onCreate: () => void;
  onSelect: (id: string) => void;
}

const UserGroupMenu = ({ onCreate, onSelect }: Props) => {
  const dispatch = useDispatch();
  const [name, setName] = useState<string>('');
  const [getUserGroups, loading] = useFindAllUserGroup();
  const { list } = useGlobalState(({ userGroups }) => userGroups);
  const isRenderEmpty = isEmpty(list.content) && !loading;

  const onChange = useCallback(() => {
    const page = 0;
    dispatch(resetUserGroupsAction());
    getUserGroups(name, page);
  }, [dispatch, getUserGroups, name]);

  useEffect(() => {
    onChange();
  }, [name, onChange]);

  const loadMore = (page: number) => {
    getUserGroups(name, page);
  };

  const renderItem = ({ id, name }: UserGroup) => (
    <MenuItem
      key={id}
      id={id}
      name={name}
      isActive={isActiveById(id)}
      onSelect={onSelect}
    />
  );

  const renderEmpty = () => (
    <Styled.Empty>
      <Text.h3 color="dark">No User group was found</Text.h3>
    </Styled.Empty>
  );

  const renderList = (data: UserGroup[]) =>
    map(data, item => renderItem(item))

  const renderContent = () => (
    <InfiniteScroll
      hasMore={!list.last}
      loadMore={loadMore}
      isLoading={loading}
      loader={<Styled.Loader />}
    >
      {isRenderEmpty ? renderEmpty() : renderList(list.content)}
    </InfiniteScroll>
  );

  return (
    <Fragment>
      <Styled.Actions data-testid="user-groups-action">
        <Styled.Button onClick={onCreate} id="create-user-group">
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create user group</Text.h5>
          </LabeledIcon>
        </Styled.Button>
      </Styled.Actions>
      <Styled.Content data-testid="user-groups-menu">
        <Styled.SearchInput resume onSearch={setName} maxLength={64} />
        {renderContent()}
      </Styled.Content>
    </Fragment>
  );
};

export default UserGroupMenu;
