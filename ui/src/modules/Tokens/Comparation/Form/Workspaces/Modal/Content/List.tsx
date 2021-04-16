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

import { memo, Fragment, useCallback, useEffect, useState } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import some from 'lodash/some';
import debounce from 'lodash/debounce';
import InfiniteScroll from 'core/components/InfiniteScroll';
import Text from 'core/components/Text';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import Item from './Item';
import Empty from './Empty';
import { useWorkspaces } from '../hooks';
import Loader from './loader';
import Styled from './styled';

export interface Props {
  draft: WorkspacePaginationItem[];
  onSelect: (workspace: WorkspacePaginationItem) => void;
}

const List = ({ draft, onSelect }: Props) => {
  const { getWorkspaces, resetWorkspaces, data: { status, workspaces, last } } = useWorkspaces();
  const [name, setName] = useState<string>('');

  const onSearch = useCallback((value: string) => {
    const page = 0;
    setName(value);
    resetWorkspaces();
    getWorkspaces(value, page);
  }, [getWorkspaces, resetWorkspaces]);

  const handleChange = debounce(onSearch, 700);

  useEffect(() => {
    if (status === 'idle') {
      getWorkspaces();
    }
  }, [getWorkspaces, status]);

  const loadMore = (page: number) => {
    getWorkspaces(name, page);
  };

  const renderItems = () => 
    map(workspaces, (workspace, index) => (
      <Item
        key={`item-${index}-${workspace?.id}`}
        workspace={workspace}
        selected={some(draft, workspace)}
        onChange={workspace => onSelect(workspace)}
      />
    ))

  const NoContent = () => (
    <Styled.NoContent>
      <Text.h4 color="dark">No more results.</Text.h4>
    </Styled.NoContent>
  )

  return (
    <Fragment>
      <Styled.Item>
        <Styled.Search
          resume
          name="workspace-search"
          label="Filter workspaces"
          icon="search"
          onChange={e => handleChange(e.currentTarget.value)}
          maxLength={64}
        />
      </Styled.Item>
      <Styled.Content data-testid="workspace-list-content">
        <InfiniteScroll
          hasMore={!last}
          loadMore={loadMore}
          isLoading={status === 'pending'}
          loader={<Loader />}
        >
          {isEmpty(workspaces) && status !== 'pending' ? <Empty /> : renderItems()}
          {!isEmpty(workspaces) && status !== 'pending' && <NoContent />}
        </InfiniteScroll>
      </Styled.Content>
    </Fragment>
  );
}

export default memo(List);