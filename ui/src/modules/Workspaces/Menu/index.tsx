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

import React, { useEffect, useCallback, useState } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import { isRoot, isIDMEnabled } from 'core/utils/auth';
import MenuItem from './MenuItem';
import Styled from './styled';
import { useWorkspaces } from '../hooks';
import { useGlobalState, useDispatch } from 'core/state/hooks';
import { getProfileByKey } from 'core/utils/profile';
import { useWorkspacesByUser } from 'modules/Users/hooks';
import InfiniteScroll from 'core/components/InfiniteScroll';
import { resetContentAction } from '../state/actions';
import {WorkspacePaginationItem} from '../interfaces/WorkspacePagination';
interface Props {
  onCreate: () => void;
  selectedWorkspace: (name: string) => void;
}

const WorkspaceMenu = ({
  onCreate,
  selectedWorkspace
}: Props) => {
  const [filterWorkspace, , loading] = useWorkspaces();
  const { findWorkspacesByUser, status } = useWorkspacesByUser();
  const userId = getProfileByKey('id');
  const workspaces = getProfileByKey('workspaces');
  const { list } = useGlobalState(({ workspaces }) => workspaces);
  const dispatch = useDispatch();
  const isNotLoading = isRoot() ? !loading : status !== 'pending';
  const isRenderEmpty = isEmpty(list?.content || workspaces) && isNotLoading;
  const [name, setName] = useState('');

  const onIDMFlow = useCallback(() => {
    if (isRoot()) {
      filterWorkspace();
    } else {
      findWorkspacesByUser(userId);
    }
  }, [filterWorkspace, findWorkspacesByUser, userId]);

  useEffect(() => {
    if (isIDMEnabled()) {
      onIDMFlow();
    } else {
      if(isRoot()) {
        dispatch(resetContentAction());
        filterWorkspace();
      }
      else {
        dispatch(resetContentAction());
        findWorkspacesByUser(userId);
      }
    }
  }, [onIDMFlow, filterWorkspace, findWorkspacesByUser, dispatch, userId]);

  const onChange = useCallback((value: string) => {
      setName(value);
      const page = 0;
      dispatch(resetContentAction());
      filterWorkspace(value, page);
  }, [dispatch, filterWorkspace]);

  const loadMore = (page: number) => {
    filterWorkspace(name, page);
  };

  const renderList = (data: WorkspacePaginationItem[]) =>
    map(data, item => renderItem(item))

  const renderItem = ({ id, name, status }: WorkspacePaginationItem) => (
    <MenuItem
      key={id}
      id={id}
      name={name}
      status={status}
      selectedWorkspace={(name: string) => selectedWorkspace(name)}
    />
  );

    const renderEmpty = () => (
      <Styled.Empty>
        <Text.h3 color="dark">No workspace was found</Text.h3>
      </Styled.Empty>
    );

    const renderContent = () => (
      <InfiniteScroll
        hasMore={!list?.last}
        loadMore={loadMore}
        isLoading={loading}
        loader={<Styled.Loader />}
      >
        {isRenderEmpty ? renderEmpty() : renderList(list?.content)}
      </InfiniteScroll>
    );

  return (
    <>
      <Styled.Actions>
        <Styled.Button
          id="workspaceModal"
          onClick={onCreate}
          isDisabled={!isRoot()}
        >
          <LabeledIcon icon="plus-circle" marginContent="5px">
            <Text.h5 color="dark">Create workspace</Text.h5>
          </LabeledIcon>
        </Styled.Button>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput
          resume
          onSearch={(value) => onChange(value)}
          disabled={!isRoot()}
          maxLength={64}
        />
      {renderContent()}
      </Styled.Content>
    </>
  );
};

export default WorkspaceMenu;
