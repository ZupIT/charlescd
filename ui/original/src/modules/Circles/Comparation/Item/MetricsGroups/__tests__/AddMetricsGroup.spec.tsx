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
import { render, screen, waitFor, act } from 'unit-test/testUtils';
import AddMetricsGroup from '../AddMetricsGroup';
import { FetchMock } from 'jest-fetch-mock/types';
import userEvent from '@testing-library/user-event';
import { metricGroupItem } from './fixtures';
import * as NotificationActions from 'core/components/Notification/state/actions';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

const errorsFromAPI = {
  errors: [
    {
      detail: 'name is invalid'
    }
  ]
};

test('render Add Metric default value', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({})
  );
  const onCloseModal = jest.fn();
  const onSaveGroup = jest.fn();

  render(
    <AddMetricsGroup
      id="1"
      onCloseModal={onCloseModal}
      onSaveGroup={onSaveGroup}
    />
  );

  const modalTitle = screen.getByText('Add metrics group');
  const nameLabel = screen.getByText('Type a name for the metrics group');
  const nameInput = screen.getByTestId('input-text-name');
  const submitButton = screen.getByText('Save group');

  userEvent.type(nameInput, 'norris');
  userEvent.click(submitButton);

  await waitFor(() => expect(onSaveGroup).toHaveBeenCalled());
  expect(nameLabel).toBeInTheDocument();
  expect(modalTitle).toBeInTheDocument();
});


test('render edit Metric label', async () => {
  render(
    <AddMetricsGroup
      id="1"
      onCloseModal={jest.fn()}
      onSaveGroup={jest.fn()}
      metricGroup={metricGroupItem}
    />
  );

  const modalTitle = screen.getByText('Edit metrics group');
  expect(modalTitle).toBeInTheDocument();
});

test('should handle submit error and show default error message', async () => {
  const toggleNotificationSpy = jest.spyOn(NotificationActions, 'toogleNotification');
  (fetch as FetchMock).mockRejectedValue({
    status: 500,
    json: () => Promise.resolve({ error: 'error on save group' })
  });

  render(
    <AddMetricsGroup
      id="1"
      onCloseModal={jest.fn()}
      onSaveGroup={jest.fn()}
    />
  );

  userEvent.type(screen.getByTestId('input-text-name'), 'norris');
  await act(async () => userEvent.click(screen.getByText('Save group')));

  expect(toggleNotificationSpy).toHaveBeenCalledWith({
    status: 'error',
    text: 'Error on save metric group'
  });

  toggleNotificationSpy.mockRestore();
});

test('should handle submit error and show errors from API', async () => {
  const toggleNotificationSpy = jest.spyOn(NotificationActions, 'toogleNotification');
  (fetch as FetchMock).mockRejectedValue({
    status: 500,
    json: () => Promise.resolve(errorsFromAPI)
  });

  render(
    <AddMetricsGroup
      id="1"
      onCloseModal={jest.fn()}
      onSaveGroup={jest.fn()}
    />
  );

  userEvent.type(screen.getByTestId('input-text-name'), 'norris');
  await act(async () => userEvent.click(screen.getByText('Save group')));

  expect(toggleNotificationSpy).toHaveBeenCalledWith({
    status: 'error',
    text: errorsFromAPI.errors[0].detail
  });
});