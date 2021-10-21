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

import userEvent from '@testing-library/user-event';
import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import { Action } from '../../types';
import { actionData } from '../../__tests__/fixtures';
import ActionCard from '../ActionCard';

test('render Action Card', async () => {
  const action = jest.fn();

  render(
    <ActionCard
      handleDeleteAction={action}
      handleEditAction={action}
      action={actionData}
    />
    );

  const status = screen.getByTestId('action-status-success');
  const nickname = screen.getByText('action');
  const actionType = screen.getByText('Circle promotion');
  const triggeredAt = screen.getByText('08/10/2015 | 12:35:00');
  const dropdown = await screen.findByTestId('icon-vertical-dots');

  expect(status).toBeInTheDocument();
  expect(nickname).toBeInTheDocument();
  expect(actionType).toBeInTheDocument();
  expect(triggeredAt).toBeInTheDocument();

  userEvent.click(dropdown);
  expect(screen.getByText('Edit action')).toBeInTheDocument();
  userEvent.click(screen.getByText('Delete action'));
  userEvent.click(screen.getByText('Yes, delete'));

  expect(action).toHaveBeenCalledTimes(1);
});

test('render Action Card and confirm delete', async () => {
  const deleteActionFn = jest.fn();

  render(
    <ActionCard
      handleDeleteAction={deleteActionFn}
      handleEditAction={jest.fn()}
      action={actionData}
    />
  );

  const dropdown = screen.getByTestId('icon-vertical-dots');
  userEvent.click(dropdown);
  userEvent.click(screen.getByText('Delete action'));
  userEvent.click(screen.getByText('Yes, delete'));
  expect(deleteActionFn).toHaveBeenCalled()
});

test('render Action Card and dismiss delete', async () => {
  const deleteActionFn = jest.fn();

  render(
    <ActionCard
      handleDeleteAction={deleteActionFn}
      handleEditAction={jest.fn()}
      action={actionData}
    />
  );

  const dropdown = screen.getByTestId('icon-vertical-dots');
  userEvent.click(dropdown);
  userEvent.click(screen.getByText('Delete action'));
  userEvent.click(screen.getByText('No'));
  
  expect(screen.queryByText('delete-action-card')).not.toBeInTheDocument();
  expect(screen.getByTestId('metric-group-card-action')).toBeInTheDocument();
});

test('render Action Card with empty triggeredAt', async () => {
  const actionData = { } as Action;

  render(
    <ActionCard
      handleDeleteAction={jest.fn()}
      handleEditAction={jest.fn()}
      action={actionData}
    />
  );

  expect(screen.getByText('-')).toBeInTheDocument();
});