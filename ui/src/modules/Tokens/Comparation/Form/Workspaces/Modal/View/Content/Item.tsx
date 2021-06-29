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

import { memo } from 'react';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import Text from 'core/components/Text';
import Styled from './styled';

export interface Props {
  workspace: WorkspacePaginationItem;
}

const Item = ({ workspace }: Props) => {
  return (
    <Styled.Item data-testid={`item-${workspace?.id}`}>
      <Styled.Description>
        <Text.h4 color="light">{workspace?.name}</Text.h4>
        <Styled.Subtitle>
          <Text.h4 fontStyle="italic" color="dark">Owned by:⠀</Text.h4>
          <Text.h4 color="light">{workspace?.authorEmail}</Text.h4>
        </Styled.Subtitle>
      </Styled.Description>
    </Styled.Item>
  )
}

// TODO memo?
export default memo(Item);
