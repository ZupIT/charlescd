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
import { FetchMock } from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { pluginsData } from './fixtures';
import FormAddAction from '../Form';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render add Metric Action form', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(pluginsData)
  );

  const handleOnFinish = jest.fn();

  render(<FormAddAction onFinish={handleOnFinish}/>);

  const actionForm = await screen.findByText('Add Metric Action');
  expect(actionForm).toBeInTheDocument();

  const actionInformationPart1 = screen.getByText(/You can create an action and add a trigger to perform an automatic task. Consult our/);
  const actionInformationPart2 = screen.getByText(/documentation/);
  const actionInformationPart3 = screen.getByText(/for further details./);

  expect(actionInformationPart1).toBeInTheDocument();
  expect(actionInformationPart2).toBeInTheDocument();
  expect(actionInformationPart3).toBeInTheDocument();
});

test('render add Metric Action form and add an action', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(pluginsData)
  );

  const handleOnFinish = jest.fn();

  render(<FormAddAction onFinish={handleOnFinish}/>);

  const selectPlugin = screen.getByText('Select a plugin');
  const nextButton = await screen.findByTestId('button-default-next');

  expect(nextButton).toBeDisabled();

  await act(() => userEvent.type(screen.getByTestId('input-text-nickname'), 'nickname'));
  await act(() => userEvent.type(screen.getByTestId('input-text-description'), 'description'));
  selectEvent.select(selectPlugin, 'plugin 1');

  await waitFor(() => expect(nextButton).toBeEnabled());
  userEvent.click(nextButton);

  const defaultButton = screen.getByText('Default');
  const customButton = screen.getByText('Custom path');
  const saveButton = await screen.findByTestId('button-default-save');

  expect(saveButton).toBeEnabled();
  userEvent.click(customButton);

  await act(() => userEvent.type(screen.getByTestId('input-text-configuration'), 'url config'));

  userEvent.click(defaultButton);
  expect(saveButton).toBeEnabled();
});

test('render add Metric Action form and add an action close card', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(pluginsData)
  );

  const handleOnFinish = jest.fn();

  render(<FormAddAction onFinish={handleOnFinish}/>);

  const selectPlugin = screen.getByText('Select a plugin');
  const NextButton = await screen.findByTestId('button-default-next');

  expect(NextButton).toBeDisabled();

  await act(() => userEvent.type(screen.getByTestId('input-text-nickname'), 'nickname'));
  await act(() => userEvent.type(screen.getByTestId('input-text-description'), 'description'));
  selectEvent.select(selectPlugin, 'plugin 1');

  await waitFor(() => expect(NextButton).toBeEnabled());
  userEvent.click(NextButton);

  const cancelCard = screen.getByTestId('icon-cancel');
  
  userEvent.click(cancelCard);

  const actionForm = screen.getByTestId('add-action-form');

  expect(actionForm).toBeInTheDocument();
});

test('should click a link to documentation about metric action', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(pluginsData)
  );

  const handleOnFinish = jest.fn();
  const url = 'https://docs.charlescd.io/reference/metrics/metrics-actions';

  render(<FormAddAction onFinish={handleOnFinish}/>);

  const linkToDocumentation = await screen.findByText('documentation');
  expect(linkToDocumentation.closest('a')).toHaveAttribute('href', url);
});
