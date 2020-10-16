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
import userEvent from '@testing-library/user-event';
import { render, screen, act } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import AddAction from '../AddAction';
import { metricsGroupData } from './fixtures';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render Add Action default value', async () => {
  const handleGoBack = jest.fn();

  render(
    <AddAction
      onGoBack={handleGoBack}
      metricsGroup={metricsGroupData[0]}
      circleId="123"
    />
  );

  const goBackButton = await screen.findByTestId('icon-arrow-left');
  const submitButton = await screen.findByTestId('button-default-submit');

  userEvent.click(goBackButton);

  expect(handleGoBack).toBeCalledTimes(1);
  expect(submitButton).toBeInTheDocument();
});

test('add New action', async () => {
  const handleGoBack = jest.fn();

  render(
    <AddAction
      onGoBack={handleGoBack}
      metricsGroup={metricsGroupData[0]}
      circleId="123"
    />
  );

  const inputNickname = await screen.findByTestId('input-text-nickname');
  const selectActionType = await screen.findByTestId('select-actionId');

  await act(() => userEvent.type(inputNickname, 'nickname'));
  userEvent.selectOptions(selectActionType, 'CIRCLE_DEPLOY');
});
