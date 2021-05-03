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
import first from 'lodash/first';
import last from 'lodash/last';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import Select from 'core/components/Form/Select/Single/Select';
import Button from 'core/components/Button';
import Text from 'core/components/Text';
import List from './Content/List';
import { options, Option } from './constants';
import Styled from './styled';
import DocumentationLink from 'core/components/DocumentationLink';

export interface Props {
  workspaces: WorkspacePaginationItem[];
  onClose: () => void;
  onContinue: (workspaces: WorkspacePaginationItem[], type: Option) => void;
}

const Modal = ({ workspaces, onClose, onContinue }: Props) => {
  const [draft, setDraft] = useState<WorkspacePaginationItem[]>(workspaces);
  const isAddMode = isEmpty(draft);
  const [type, setType] = useState<Option>(isAddMode ? first(options) : last(options));
  const isManual = type?.value === 'MANUAL';

  const toggleWorkspace = (workspace: WorkspacePaginationItem) => {
    setDraft(xorBy(draft, [workspace], 'id'));
  };

  const renderDescription = () => (
    isManual
      ? '*This token will have access only to the selected workspaces. '
      : '*This token will have access to all selected workspaces. '
  )
  
  return (
    <Styled.Modal onClose={onClose}>
      <Styled.Header>
        <Text.h2 color="light">Add workspaces</Text.h2>
        <Select
          options={options}
          defaultValue={type}
          placeholder="Define the workspaces that will be associated"
          onChange={setType}
        />
      </Styled.Header>
      <Styled.Caption>
        <Text.h5 color="dark">
          {renderDescription()}
          Read our 
          <DocumentationLink
            documentationLink="https://docs.charlescd.io"
            text="documentation"
          />
          for further details.
        </Text.h5>
      </Styled.Caption>
      {isManual && <List draft={draft} onSelect={toggleWorkspace} />}
      <Styled.Item>
        <Button.Default
          id="continue"
          type="button"
          size="SMALL"
          isDisabled={isManual && isEmpty(draft)}
          onClick={() => onContinue(draft, type)}
        >
          Next
        </Button.Default>
      </Styled.Item>
    </Styled.Modal>
  )
}

export default memo(Modal);