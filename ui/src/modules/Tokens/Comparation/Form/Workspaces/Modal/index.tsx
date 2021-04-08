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

import { memo, useState } from 'react';
import xorBy from 'lodash/xorBy';
import isEmpty from 'lodash/isEmpty';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import Select from 'core/components/Form/Select/Single/Select';
import Button from 'core/components/Button';
import List from './Content/List';
import { options, Option } from './constants';
import Styled from './styled';

interface Props {
  workspaces: WorkspacePaginationItem[];
  onClose: Function;
  onContinue: (workspaces: WorkspacePaginationItem[]) => void;
}

const AddWorkspaces = ({ workspaces, onClose, onContinue }: Props) => {
  const [type, setType] = useState<Option>();
  const [draft, setDraft] = useState<WorkspacePaginationItem[]>(workspaces);
  const isAddMode = isEmpty(draft);
  const isManual = type?.value === 'MANUAL';

  const toggleWorkspace = (workspace: WorkspacePaginationItem) => {
    setDraft(xorBy(draft, [workspace], 'id'));
  };

  const renderList = () => 
    isManual && <List draft={draft} onSelect={toggleWorkspace} />

  return (
    <Styled.Modal onClose={() => onClose()}>
      <Styled.Header>
        Add Workspaces
        <Select
          options={options}
          placeholder="Define the workspaces that will be associated"
          onChange={setType}
        />
      </Styled.Header>
      {renderList()}
      <Styled.Item>
        <Button.Default
          type="button"
          size="SMALL"
          onClick={() => onContinue(draft)}
        >
          {`${isAddMode ? 'Add' : 'Save'}`}
        </Button.Default>
      </Styled.Item>
    </Styled.Modal>
  )
}

export default memo(AddWorkspaces);