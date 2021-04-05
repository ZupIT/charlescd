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
import Styled from '../styled';

interface Props {
  index: number;
  workspace: WorkspacePaginationItem;
  onChange: (id: string) => void;
}

type Toggle = { id: string };

const Item = ({ index, workspace, onChange }: Props) => {
  console.log('RENDER Item');
  // const { register } = useFormContext();
  const [isChecked, setIsChecked] = useState<boolean>();

  const onClick = (id: string) => {
    setIsChecked(!isChecked);
    onChange(id);
  }

  const Toggle = ({ id }: Toggle) => (
    isChecked 
      ? <Icon name="checkmark-circle" color="success" size="22px" onClick={() => onClick(id)} />
      : <Icon name="plus-circle" color="dark" size="22px" onClick={() => onClick(id)} />
  );

  return (
    <Styled.Item data-testid={workspace.id}>
      <Styled.Description>
        <Text.h4 color="light">{workspace.name}</Text.h4>
        <Styled.Subtitle>
          <Text.h4 fontStyle="italic" color="dark">Owned by:</Text.h4>{` `}
          <Text.h4 color="light">mateus.cruz@zup.com.br</Text.h4>
        </Styled.Subtitle>
      </Styled.Description>
      <Toggle id={workspace.id} />
      {/* <Form.Checkbox
        ref={register()}
        name={`workspaces[${index}]`}
        value={workspace.id}
      /> */}
    </Styled.Item>
  )
}

export default memo(Item);
