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

import { Fragment, useEffect, useState, useCallback } from 'react';
import map from 'lodash/map';
import some from 'lodash/some';
import debounce from 'lodash/debounce';
import InfiniteScroll from 'core/components/InfiniteScroll';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import Item from './Item';
import Loader from './Loader';
import Styled from './styled';

export interface Props {
  draft: WorkspacePaginationItem[];
}

const List = ({ draft }: Props) => {
  const [name, setName] = useState<string>('');

  const onSearch = useCallback((value: string) => {
    const page = 0;
    setName(value);
    console.log('onSearch')
  }, []);

  const handleChange = debounce(onSearch, 700);

  const loadMore = (page: number) => {
    console.log('loadMore')
  };

  const renderItems = () => 
    map(draft, (workspace, index) => (
      <Item
        key={`item-${index}-${workspace?.id}`}
        workspace={workspace}
      />
    ))

  return (
    <Fragment>
      <Styled.Wrapper>
        <Styled.Search
          resume
          name="workspace-search"
          label="Filter workspaces"
          icon="search"
          onChange={e => handleChange(e.currentTarget.value)}
          maxLength={64}
        />
      </Styled.Wrapper>
      <Styled.Content data-testid="workspace-list-content">
        <InfiniteScroll
          hasMore={true}
          loadMore={loadMore}
          isLoading={false}
          loader={<Loader />}
        >
          {renderItems()}
        </InfiniteScroll>
      </Styled.Content>
    </Fragment>
  );
}

export default List;