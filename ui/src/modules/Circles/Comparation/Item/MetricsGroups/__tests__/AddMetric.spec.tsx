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
import { render, screen, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock';
import AddMetric from '../AddMetric';
import { metricsData } from './fixtures';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

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

