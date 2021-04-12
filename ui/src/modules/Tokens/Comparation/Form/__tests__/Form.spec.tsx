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

import { render, screen, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock/types';
import Form  from '..';

test('Render Token Form in create mode', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'token' }));
  render(<Form />);

  const ContentToken = await screen.findByTestId('contentIcon-token');
  const ContentWorkspaces = screen.queryByTestId('contentIcon-workspaces');
  const ContentScopes = screen.queryByTestId('contentIcon-scopes');

  expect(ContentToken).toBeInTheDocument();
  expect(ContentWorkspaces).not.toBeInTheDocument();
  expect(ContentScopes).not.toBeInTheDocument();
});

test('Render Token Form in create mode: Defining name', async () => {
  render(<Form mode="create" />);

  const ContentToken = await screen.findByTestId('contentIcon-token');
  expect(ContentToken).toBeInTheDocument();

  const InputName = await screen.findByTestId('input-text-name');
  const ButtonSubmitName = await screen.findByTestId('button-default-submit');
  expect(InputName).toBeInTheDocument();
  expect(ButtonSubmitName).toBeInTheDocument();

  userEvent.type(InputName, 'Token 001');
  await act(async () => userEvent.click(ButtonSubmitName));

  const ContentWorkspaces = await screen.findByTestId('contentIcon-workspaces');
  const ContentScopes = screen.queryByTestId('contentIcon-scopes');

  expect(ContentWorkspaces).toBeInTheDocument();
  expect(ContentScopes).not.toBeInTheDocument();
});

// test('Render Token Form in create mode: Defining name and workspaces', async () => {
//   (fetch as FetchMock).mockResponseOnce(JSON.stringify(workspaces));
//   render(<Form mode="create" />);

//   const ContentToken = await screen.findByTestId('contentIcon-token');
//   expect(ContentToken).toBeInTheDocument();

//   const InputName = await screen.findByTestId('input-text-name');
//   const ButtonSubmitName = await screen.findByTestId('button-default-submit');
//   expect(InputName).toBeInTheDocument();
//   expect(ButtonSubmitName).toBeInTheDocument();

//   userEvent.type(InputName, 'Token 001');
//   await act(async () => userEvent.click(ButtonSubmitName));

//   const ContentWorkspaces = await screen.findByTestId('contentIcon-workspaces');
//   expect(ContentWorkspaces).toBeInTheDocument();
  
//   const ButtonAddWorkspaces = await screen.findByTestId('button-iconRounded-plus-circle');
//   expect(ButtonAddWorkspaces).toBeInTheDocument();

//   await act(async () => userEvent.click(ButtonAddWorkspaces));
  
//   const ModalAddWorkspaces = await screen.findByTestId('modal-default');
//   expect(ModalAddWorkspaces).toBeInTheDocument();
  
//   const Select = await screen.findByTestId('react-select');
//   await act(() => selectEvent.select(Select, 'MANUAL'));
  
//   const WorkspaceItem = await screen.findByTestId('item-123');
//   expect(WorkspaceItem).toBeInTheDocument();

//   const ContentScopes = screen.queryByTestId('contentIcon-scopes');
//   expect(ContentScopes).not.toBeInTheDocument();
// });