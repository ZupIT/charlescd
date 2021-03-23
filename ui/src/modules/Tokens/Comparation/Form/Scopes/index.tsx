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
import ContentIcon from 'core/components/ContentIcon';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { SetValue } from '../interfaces';
import Styled from './styled';

interface Props {
  setValue: SetValue;
}

const Scopes = ({ setValue }: Props) => {
  const [scopes, setScopes] = useState<string[]>();

  const addScope = (value: string) => {
    setScopes(xor(scopes, [value]));
  }

  useEffect(() => {
    setValue('permissions', scopes);
  }, [setValue, scopes]);

  return (
    <ContentIcon icon="scopes">
      <Text.h2 color="light">Scopes</Text.h2>
      <Styled.Content>
        <Form.Checkbox
          label="Modules"
          value="UNDEPLOY"
          description="Give full access to our module API"
          onChange={() => addScope('module_write')}
        />
      </Styled.Content>
    </ContentIcon>
  )
}

export default Scopes;
