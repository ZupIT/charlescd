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
import Notification from 'core/components/Notification';
import { useGlobalState, useDispatch } from 'core/state/hooks';
import { dismissNotification } from 'core/components/Notification/state/actions';
import Styled from './styled';

const Footer = () => {
  const { notification } = useGlobalState(({ notification }) => notification);
  const dispatch = useDispatch();

  return (
    <Styled.Footer data-testid="footer">
      {notification.isVisible && (
        <Notification
          notification={notification}
          onDismiss={() => dispatch(dismissNotification())}
        />
      )}
    </Styled.Footer>
  );
};

export default Footer;
