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
import { render, screen, fireEvent, act } from 'unit-test/testUtils';
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

  const goBackButton = await screen.findByTestId('icon-arrow-left');
  const submitButton = await screen.findByTestId('button-default-submit');

  expect(screen.getByTestId('add-metric')).toBeInTheDocument();
  expect(screen.getByTestId('label-text-nickname')).toBeInTheDocument();

  fireEvent.click(goBackButton);
  expect(handleGoBack).toBeCalledTimes(1);

  await act(async () => fireEvent.click(submitButton));
  expect(handleGoBack).toBeCalledTimes(2);
});
