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
// @ts-nocheck


import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';

export type Props = {
  status: 'error' | 'success' | 'idle';
  successMessage?: string;
  errorMessage?: string;
};

const Message = ({ successMessage, errorMessage, status }: Props) => {
  return (
    status !== 'idle' && (
      <Styled.StatusMessageWrapper
        data-testid={`connection-${status}`}
        status={status}
      >
        <Icon name={status} />
        <Text tag="H5">
          {status === 'success' ? successMessage : errorMessage}
        </Text>
      </Styled.StatusMessageWrapper>
    )
  );
};

export default Message;
