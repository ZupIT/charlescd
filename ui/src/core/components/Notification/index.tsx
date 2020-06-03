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
import { Notification } from './interfaces/Notification';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import Styled from './styled';

interface Props {
  notification: Notification;
  onDismiss: Function;
}

const NotificationComponent = ({ notification, onDismiss }: Props) => (
  <Styled.Notification color={notification.status} data-testid="notification">
    <Styled.Wrapper>
      <Icon name={notification.status} color="light" />
      <Text.h4 color="light" weight="light">
        {notification.text}
      </Text.h4>
    </Styled.Wrapper>
    <Styled.Icon name="cancel" color="light" onClick={() => onDismiss()} />
  </Styled.Notification>
);

export default NotificationComponent;
