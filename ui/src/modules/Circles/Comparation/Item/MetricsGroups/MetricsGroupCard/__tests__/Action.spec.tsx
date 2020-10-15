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
import { render, screen, fireEvent } from 'unit-test/testUtils';
import { actionData } from '../../__tests__/fixtures';
import ActionCard from '../Action';

test('render Action Card', async () => {
  render(
    <ActionCard
      handleDeleteAction={jest.fn()}
      handleEditAction={jest.fn()}
      action={actionData}
    />
    );

  const staus = screen.getByTestId('action-status-success');
  const nickname = screen.getByText('action');
  const actionType = screen.getByText('Circle promotion');
  const triggeredAt = screen.getByText('10/08/2015 12:35');
  const dropdown = screen.getByTestId('icon-vertical-dots');

  expect(staus).toBeInTheDocument();
  expect(nickname).toBeInTheDocument();
  expect(actionType).toBeInTheDocument();
  expect(triggeredAt).toBeInTheDocument();

  fireEvent.click(dropdown);
  fireEvent.click(screen.getByText('Edit action'));

  fireEvent.click(dropdown);
  fireEvent.click(screen.getByText('Delete action'));
});
