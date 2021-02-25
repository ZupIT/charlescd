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
import { render, screen, act, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock';
import AddMetric from '../AddMetric';
import { metricsData } from './fixtures';
import * as NotificationActions from 'core/components/Notification/state/actions';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

const errorsFromAPI = {
  errors: [
    {
      detail: 'Nickname is required'
    }
  ]
};

test('render Add Metric default value', async () => {
  const handleGoBack = jest.fn();

  render(
    <AddMetric
      id={'1'}
      onGoBack={handleGoBack}
      metric={metricsData}
    />
  );

  const goBackButton = screen.getByTestId('icon-arrow-left');
  const submitButton = screen.getByTestId('button-default-submit');

  const addMetricElement = await screen.findByTestId('add-metric');
  expect(addMetricElement).toBeInTheDocument();

  const nicknameLabelElement = screen.getByText('Type a nickname for the metric');
  expect(nicknameLabelElement).toBeInTheDocument();

  const datasourceLabelElement = screen.getByText('Select a datasource');
  expect(datasourceLabelElement).toBeInTheDocument();

  userEvent.click(goBackButton);
  expect(handleGoBack).toBeCalledTimes(1);

  await act(async () => userEvent.click(submitButton));
  expect(handleGoBack).toBeCalledTimes(2);
});

test('should handle submit error and show default error message', async () => {
  const toggleNotificationSpy = jest.spyOn(NotificationActions, 'toogleNotification');

  render(
    <AddMetric
      id={'1'}
      onGoBack={jest.fn()}
      metric={metricsData}
    />
  );

  const submitButton = screen.getByText('Save');

  await waitFor(() => expect(submitButton).not.toBeDisabled());
  (fetch as FetchMock).mockRejectedValue({
    status: 500,
    json: () => Promise.resolve({ message: 'Error' })
  });

  await act(async () => userEvent.click(submitButton));
  expect(toggleNotificationSpy).toHaveBeenCalledWith({
    status: 'error',
    text: 'Error on save metric'
  });

  toggleNotificationSpy.mockRestore();
});

test('should handle submit error and show errors from API', async () => {
  const toggleNotificationSpy = jest.spyOn(NotificationActions, 'toogleNotification');

  render(
    <AddMetric
      id={'1'}
      onGoBack={jest.fn()}
      metric={{ ...metricsData, filters: undefined }}
    />
  );

  const submitButton = screen.getByText('Save');

  await waitFor(() => expect(submitButton).not.toBeDisabled());
  (fetch as FetchMock).mockRejectedValue({
    status: 500,
    json: () => Promise.resolve(errorsFromAPI)
  });

  await act(async () => userEvent.click(submitButton));
  expect(toggleNotificationSpy).toHaveBeenCalledWith({
    status: 'error',
    text: errorsFromAPI.errors[0].detail
  });

  toggleNotificationSpy.mockRestore();
});

test('should switch between Basic/advanced query', async () => {
  render(
    <AddMetric
      id={'1'}
      onGoBack={jest.fn()}
      metric={{ ...metricsData, filters: undefined }}
    />
  );

  const basicButton = screen.getByText('Basic');
  const advancedButton = screen.getByText('Advanced');

  userEvent.click(basicButton);
  userEvent.click(advancedButton);

  expect(await screen.findByText('Type a query')).toBeInTheDocument();

});

test('should toggle add threshold', async () => {
  render(
    <AddMetric
      id={'1'}
      onGoBack={jest.fn()}
      metric={{ ...metricsData, metric: undefined, query: '', filters: undefined }}
    />
  );

  expect(screen.getByText('Conditional')).toBeInTheDocument();
  expect(screen.getByText('Equal')).toBeInTheDocument();

  userEvent.click(screen.getByTestId('icon-trash'));
  expect(await screen.findByText('Add threshold')).toBeInTheDocument();

  userEvent.click(screen.getByTestId('icon-add'));
  expect(screen.queryByText('Add threshold')).not.toBeInTheDocument();
  expect(await screen.findByText('Conditional')).toBeInTheDocument();
});