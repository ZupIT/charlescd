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

import { useEffect, useState } from 'react';
import xor from 'lodash/xor';
import Select from 'core/components/Form/Select/Single/Select';
import Button from 'core/components/Button';
import List from './Content/List';
import { options, Option } from './constants';
import Styled from './styled';

interface Props {
  onClose: Function;
  onContinue: (workspaces: string) => void;
}

const AddWorkspaces = ({ onClose, onContinue }: Props) => {
  console.log('RENDER AddWorkspaces');
  const [type, setType] = useState<Option>();
  const [workspaces, setWorkspaces] = useState<string[]>();
  const isManual = type?.value === 'MANUAL';

  useEffect(() => {
    console.log('workspaces', workspaces);
  }, [workspaces]);

  const toggleWorkspace = (id: string) => {
    console.log('id', id);
    setWorkspaces(xor(workspaces, [id]));
  };

  const renderList = () => 
    isManual && <List selecteds={workspaces} onSelect={toggleWorkspace} />

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
        >
          Next
        </Button.Default>
      </Styled.Item>
    </Styled.Modal>
  )
}

export default AddWorkspaces;