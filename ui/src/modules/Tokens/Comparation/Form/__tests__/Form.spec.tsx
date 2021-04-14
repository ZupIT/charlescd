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
import { Token } from 'modules/Tokens/interfaces';
import Form  from '..';


const token: Token = {
  id: "f18b25e1-02e1-4c2f-9d5e-eef42f0fd83b",
  name: "New Token",
  permissions: ["modules_read"], 
  workspaces: [],
  allWorkspaces: true,
  revoked: false,
  created_at: "2021-04-12T22:16:26.359112Z",
  revoked_at: null,
  last_used_at: null,
  author: "charlesadmin@admin"
};

test('Render Token Form in view mode and show Author', async () => {
  render(<Form mode="view" data={token} />);

  const TokenAuthor = await screen.findByText(`Created by ${token.author}`);
  expect(TokenAuthor).toBeInTheDocument();
});

test('Render Token Form in view mode and token never used', async () => {
  render(<Form mode="view" data={token} />);

  const MessageTokenNotUsedYet = await screen.findByText('This token has not been used yet.');
  expect(MessageTokenNotUsedYet).toBeInTheDocument();
});

// test('Render Token Form in view mode and token have been used', async () => {
//   render(<Form mode="view" data={{ ...token, last_used_at: '2021-04-12T22:16:26.359112Z'} } />);

//   const MessageTokenNotUsedYet = await screen.findByText('Last used at 12/04/2021 • 19:16:26');
//   expect(MessageTokenNotUsedYet).toBeInTheDocument();
// });

test('Render Token Form in create mode', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'token' }));
  render(<Form mode="create" />);

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