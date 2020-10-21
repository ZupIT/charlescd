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
import Styled from './styled';

type Props = {
  status: string;
  message: string;
};

const ConnectionStatus = ({ status, message }: Props) => {
  let statusText = 'error';
  if (status === '200') statusText = 'success';

  return (
    <Styled.StatusMessageWrapper
      data-testid={`connection-${statusText}`}
      status={statusText}
    >
      <Icon name={statusText} />
      <Text.h5>{message}</Text.h5>
    </Styled.StatusMessageWrapper>
  );
};

export default ConnectionStatus;
