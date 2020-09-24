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
import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock';
import selectEvent from 'react-select-event';
import FormUserGroup from '../Form';

test('should select form user group', async () => {
  (fetch as FetchMock)
    .mockResponse(JSON.stringify({
      content: [
        { id: '1', name: 'Maintainer' }
      ]
    }));

  render(
    <FormUserGroup onFinish={jest.fn()} />
  );
  
  const addButton = await screen.findByText('Add');
  expect(addButton).toBeInTheDocument();
    
  const selectUserGroup = screen.getByText('Select a user group');
  await selectEvent.select(selectUserGroup, 'Maintainer');

  expect(screen.getByTestId('button-default-add')).not.toBeDisabled();
});

test('should find a user group by name', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      content: [
        { id: '1', name: 'Maintainer' }
      ]
    }))
    .mockResponseOnce(JSON.stringify({}))
    .mockResponseOnce(JSON.stringify({
      content: [
        { id: '2', name: 'Developer' }
      ]
    }));

  const { container } = render(
    <FormUserGroup onFinish={jest.fn()} />
  );
  
  const addButton = await screen.findByText('Add');
  expect(addButton).toBeInTheDocument();
  
  const selectInput = container.getElementsByTagName('input')[0];
  userEvent.type(selectInput, 'Dev');

  const selectUserGroup = await screen.findByText('Select a user group');
  await selectEvent.select(selectUserGroup, 'Developer');

  expect(screen.getByTestId('button-default-add')).not.toBeDisabled();
});
