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

import React, { useCallback, useEffect, useState } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import { isRoot } from 'core/utils/auth';
import MenuItem from './MenuItem';
import Styled from './styled';
import { useWorkspaces } from '../hooks';
import InfiniteScroll from 'core/components/InfiniteScroll';
import { Workspace } from '../interfaces/Workspace';

interface Props {
  onCreate: () => void;
}
const WorkspaceMenu = ({ onCreate }: Props) => {
  const { getWorkspaces, resetWorkspaces, data: { status, workspaces, last } } = useWorkspaces();
  const [name, setName] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      getWorkspaces();
    }
  }, [getWorkspaces, status]);

  const onSearch = useCallback((value: string) => {
    setName(value);
    const page = 0;
    resetWorkspaces();
    getWorkspaces(value, page);
  }, [getWorkspaces, resetWorkspaces]);

  const loadMore = (page: number) => {
    getWorkspaces(name, page);
  };

  const renderList = (data: Workspace[]) =>
    map(data, item => renderItem(item))

  const renderItem = (workspace: Workspace) => (
    <MenuItem
      key={workspace.id}
      workspace={workspace}
    />
  );

  const renderEmpty = () => (
    <Styled.Empty>
      <Text tag='H3' color="dark">No workspace was found</Text>
    </Styled.Empty>
  );

  const renderContent = () => (
    <InfiniteScroll
      hasMore={!last}
      loadMore={loadMore}
      isLoading={status === 'pending'}
      loader={<Styled.Loader />}
    >
      {isEmpty(workspaces) && status !== 'pending' ? renderEmpty() : renderList(workspaces)}
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
            <Text tag='H5' color="dark">Create workspace</Text>
          </LabeledIcon>
        </Styled.Button>
      </Styled.Actions>
      <Styled.Content>
        <Styled.SearchInput
          resume
          onSearch={onSearch}
          disabled={!isRoot()}
          maxLength={64}
        />
      {renderContent()}
      </Styled.Content>
    </>
  );
};

export default WorkspaceMenu;
