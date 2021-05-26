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

import { useState, memo } from 'react';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import { checkProps } from './helpers';
import Styled from '../styled';

export interface Props {
  selected: boolean;
  workspace: WorkspacePaginationItem;
  onChange: (workspace: WorkspacePaginationItem) => void;
}

const Item = ({ workspace, selected, onChange }: Props) => {
  const [isChecked, setIsChecked] = useState<boolean>(selected);

  const onClick = () => {
    setIsChecked(!isChecked);
    onChange(workspace);
  }

  return (
    <Styled.Item data-testid={`item-${workspace?.id}`}>
      <Styled.Description>
        <Text tag="H4" color="light">{workspace?.name}</Text>
        <Styled.Subtitle>
          <Text tag="H4" fontStyle="italic" color="dark">Owned by:⠀</Text>
          <Text tag="H4" color="light">{workspace?.authorEmail}</Text>
        </Styled.Subtitle>
      </Styled.Description>
      <Icon { ...checkProps(isChecked) } size="22px" onClick={onClick} />
    </Styled.Item>
  )
}

export default memo(Item);
