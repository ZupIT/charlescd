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

import { useState } from 'react';
import Select from 'core/components/Form/Select/Single/Select';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { options, Option } from './constants';
import Styled from './styled';

interface Props {
  onClose: Function;
  onContinue: Function;
}

const AddWorkspaces = ({ onClose, onContinue }: Props) => {
  const [type, setType] = useState<Option>();
  const isIndividual = type?.value === 'INDIVIDUAL';

  const onClick = () => console.log('onClick Item');

  const Item = () => (
    <Styled.Item>
      <Styled.Description>
        <Text.h4 color="light">Workspace 1</Text.h4>
        <Styled.Subtitle>
          <Text.h4 fontStyle="italic" color="dark">Owned by:</Text.h4>{` `}
          <Text.h4 color="light">mateus.cruz@zup.com.br</Text.h4>
        </Styled.Subtitle>
      </Styled.Description>
      <Icon name="plus-circle" color="dark" onClick={onClick} />
    </Styled.Item>
  )

  const Content = () => (
    <Styled.Content>
      <Item />
    </Styled.Content>
  );

  return (
    <Styled.Modal onClose={() => onClose()}>
      <Styled.Header>
        Add Workspaces
        <Select
          options={options}
          placeholder="Define the workspaces that will be associated"
          onChange={option => setType(option)}
        />
      </Styled.Header>
      {isIndividual && <Content />}
    </Styled.Modal>
  )
}

export default AddWorkspaces;