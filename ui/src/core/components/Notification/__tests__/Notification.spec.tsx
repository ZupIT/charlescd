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
import { render, fireEvent } from 'unit-test/testUtils';
import { Notification } from '../interfaces/Notification';
import NotificationComponent from '..';

test('render default Notification', () => {
  const notification: Notification = {text:'Text', status:'success'};
  const onDismiss = jest.fn();

  const { getByText, getByTestId } = render(
    <NotificationComponent notification={notification} onDismiss={onDismiss}/>
  );

  const notificationTextElement = getByText('Text');
  const dismissNotification = getByTestId('icon-cancel');
  fireEvent.click(dismissNotification);

  expect(notificationTextElement).toBeInTheDocument();
  expect(onDismiss).toBeCalled();
});
