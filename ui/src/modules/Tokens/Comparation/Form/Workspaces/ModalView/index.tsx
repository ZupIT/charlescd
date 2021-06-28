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

import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import Styled from './styled';
import Text from 'core/components/Text';
import InfiniteScroll from 'core/components/InfiniteScroll';
import Loader from '../Modal/Content/loader';
import List from './Content/List';

export interface Props {
  workspaces: WorkspacePaginationItem[];
  onClose: () => void;
};

const ModalView = ({ workspaces, onClose }: Props) => {
const loadMore = (page: number) => {
  console.log('loadMore')
  // getWorkspaces(name, page);
};

  return (
    <Styled.Modal onClose={onClose}>
      <Styled.Header>
        <Text.h2 color="light">View workspaces</Text.h2>
      </Styled.Header>
      <Styled.Content data-testid="workspace-list-content">
        <InfiniteScroll
          hasMore={false}
          loadMore={loadMore}
          isLoading={false}
          loader={<Loader />}
        >
          {<List draft={workspaces} />}
        </InfiniteScroll>
      </Styled.Content>
    </Styled.Modal>
  )
}

export default ModalView;