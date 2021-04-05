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

import { Fragment, useCallback, useEffect, useState } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import InfiniteScroll from 'core/components/InfiniteScroll';
import Text from 'core/components/Text';
import Item from './Item';
import { useWorkspaces } from '../hooks';
import Styled from '../styled';

interface Props {
  selecteds: string[];
  onSelect: (id: string) => void;
}

const List = ({ selecteds, onSelect }: Props) => {
  const { getWorkspaces, resetWorkspaces, data: { status, workspaces, last } } = useWorkspaces();
  const [name, setName] = useState<string>('');

  const onSearch = useCallback((name: string) => {
    const page = 0;
    resetWorkspaces();
    getWorkspaces(name, page);
  }, [getWorkspaces, resetWorkspaces]);

  // useEffect(() => {
  //   if (status === 'idle') getWorkspaces();
  // }, [getWorkspaces, status]);

  useEffect(() => {
    onSearch(name);
  }, [name, onSearch]);

  const loadMore = (page: number) => {
    getWorkspaces(name, page);
  };

  const renderItems = () => 
    map(workspaces, (workspace, index) => (
      <Item
        key={workspace?.id}
        index={index}
        workspace={workspace}
        onChange={id => onSelect(id)}
      />
    ))

  const renderEmpty = () => (
    <Styled.Empty>
      <Text.h3 color="dark">No workspace was found</Text.h3>
    </Styled.Empty>
  );

  const renderContent = () => (
    <InfiniteScroll
      hasMore={!last}
      loadMore={loadMore}
      isLoading={status === 'pending'}
      loader={<Fragment>Loading..</Fragment>}
    >
      {isEmpty(workspaces) && status !== 'pending' ? renderEmpty() : renderItems()}
    </InfiniteScroll>
  );

  return (
    <Fragment>
      <Styled.Search
        resume
        label="Filter workspaces"
        onSearch={setName}
        maxLength={64}
      />
      {/* <Styled.Search label="Filter workspaces" onChange={onSearch} /> */}
      <Styled.Content>
        {renderContent()}
      </Styled.Content>
    </Fragment>
  );
}

export default List;
