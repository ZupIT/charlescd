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
import { CONNECTION_SUCCESS } from 'core/hooks/useTestConnection';
import Styled from './styled';

type Props = {
  message?: string;
};

type MessageProps = {
  status: string;
  messageText: string;
};

const MessageStatus = ({ status, messageText }: MessageProps) => (
  <Styled.StatusMessageWrapper
    data-testid={`connection-${status}`}
    status={status}
  >
    <Icon name={status} />
    <Text.h5>{messageText}</Text.h5>
  </Styled.StatusMessageWrapper>
);

const ConnectionStatus = ({ message }: Props) => {
  if (message !== CONNECTION_SUCCESS) {
    return MessageStatus({
      status: 'error',
      messageText: message || 'Connection to metric provider failed.'
    });
  }

  return MessageStatus({
    status: 'success',
    messageText: 'Successful connection with the metrics provider.'
  });
};

export default ConnectionStatus;
