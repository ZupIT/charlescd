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
import { render, screen, act, fireEvent, waitFor } from 'unit-test/testUtils';
import { FetchMock, MockResponseInitFunction } from 'jest-fetch-mock';
import selectEvent from 'react-select-event';
import FormUserGroup from '../Form';
import { Roles, UserGroups } from './fixtures';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});


test('If the user group response is not empty, it must be possible to choose an option in the select component.', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      content: UserGroups
    }))
    .mockResponseOnce(JSON.stringify({
      content: Roles,
    }))
    .mockResponseOnce(JSON.stringify({
      content: UserGroups
    }));
  render(
    <FormUserGroup onFinish={jest.fn()} />
  );


  const selectUserGroup = await screen.findByText('Select a user group');
  await act(async () => selectEvent.select(selectUserGroup, 'Maintainer'));

  expect(screen.getByText('Select permissions for the group selected above.')).toBeInTheDocument();
});

test('After choose one valid user group should be possible to choose a permission', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      content: UserGroups
    }))
    .mockResponseOnce(JSON.stringify({
      content: Roles,
    }))
    .mockResponseOnce(JSON.stringify({
      content: UserGroups
    }));
  render(
    <FormUserGroup onFinish={jest.fn()} />
  );


  const selectUserGroup = await screen.findByText('Select a user group');
  await act(async () => selectEvent.select(selectUserGroup, 'Maintainer'));

  expect(screen.getByText('Select permissions for the group selected above.')).toBeInTheDocument();

  const selectPermissionUserGroup = await screen.findByText('Choose a permission');
  await act(async () => selectEvent.select(selectPermissionUserGroup, 'Maintainer'));
});


test('Shows no options when UserGroups response is empty', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      content: []
    }))
    .mockResponseOnce(JSON.stringify({
      content: Roles,
    }))
    .mockResponseOnce(JSON.stringify({
      content: []
    }));
  render(
    <FormUserGroup onFinish={jest.fn()} />
  );

  const selectUserGroup = await screen.findByText('Select a user group');
  await act(async () => selectEvent.openMenu(selectUserGroup));

  const selectOptions = await screen.findByText("No options");
  expect(selectOptions).toBeInTheDocument();
});

test('onSubmit and onFinish should be called', async () => {

  const mockSaveMethod = jest.fn();
  const mockOnFinish = jest.fn();
  const mockResponseSave: MockResponseInitFunction = async (req) => {

    if (req.method === "POST") {
      mockSaveMethod();
      return new Promise(resolve => setTimeout(() => resolve({ body: JSON.stringify({response: true}) }), 100))
    }
    return null;
  }

  
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      content: UserGroups
    }))
    .mockResponseOnce(JSON.stringify({
      content: Roles,
    }))
    .mockResponseOnce(JSON.stringify({
      content: UserGroups
    }))
    .mockResponse(mockResponseSave);

  
  render(
    <FormUserGroup onFinish={mockOnFinish} />
  );

  const selectUserGroup = await screen.findByText('Select a user group');
  await act(async () => selectEvent.select(selectUserGroup, 'Maintainer'));

  expect(screen.getByText('Select permissions for the group selected above.')).toBeInTheDocument();

  const selectPermissionUserGroup = await screen.findByText('Choose a permission');
  await act(async () => selectEvent.select(selectPermissionUserGroup, 'Maintainer'));

  const buttonSave = await screen.findByTestId("button-default-save")
  fireEvent.click(buttonSave)

  await waitFor(() => {
    expect(mockSaveMethod).toBeCalled();
    expect(mockOnFinish).toBeCalled();
  })
});
