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

import React from 'react';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { ConnectionStatusEnum as stausEnum } from './interfaces';
import Styled from './styled';

type Props = {
  status: string;
};

const ConnectionStatus = ({ status }: Props) => {
  if (status === stausEnum.FAILED)
    return (
      <Styled.StatusMessageWrapper
        data-testid="connection-error"
        status="error"
      >
        <Icon name="error" />
        <Text.h5>Connection to metric provider failed.</Text.h5>
      </Styled.StatusMessageWrapper>
    );
  if (status === stausEnum.SUCCESS)
    return (
      <Styled.StatusMessageWrapper
        data-testid="connection-succeful"
        status="success"
      >
        <Icon name="success" />
        <Text.h5>Successful connection with the metrics provider.</Text.h5>
      </Styled.StatusMessageWrapper>
    );
  else
    return (
      <Styled.StatusMessageWrapper
        data-testid="connection-falied-to-reach"
        status="error"
      >
        <Icon name="error" />
        <Text.h5>Failed to reach the metrics provider.</Text.h5>
      </Styled.StatusMessageWrapper>
    );
};

export default ConnectionStatus;
