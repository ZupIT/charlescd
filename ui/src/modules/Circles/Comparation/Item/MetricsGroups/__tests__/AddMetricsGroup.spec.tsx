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
import { render, screen, waitFor } from 'unit-test/testUtils';
import AddMetricsGroup from '../AddMetricsGroup';
import { FetchMock } from 'jest-fetch-mock/types';
import userEvent from '@testing-library/user-event';
import { metricGroupItem } from './fixtures';

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
})