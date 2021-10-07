// @ts-nocheck
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

import { render, screen, act, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock/types';
import { Token } from 'modules/Tokens/interfaces';
import Form from '..';

const token: Token = {
  id: 'f18b25e1-02e1-4c2f-9d5e-eef42f0fd83b',
  name: 'New Token',
  permissions: ['modules_read'],
  workspaces: [],
  allWorkspaces: true,
  revoked: false,
  created_at: '2021-04-12T22:16:26.359112Z',
  revoked_at: null,
  last_used_at: null,
  author: 'charlesadmin@admin',
};

test('Render Token Form in view mode and show Author', async () => {
  render(<Form mode="view" data={token} />);

  const TokenAuthor = await screen.findByText(`Created by ${token.author}`);
  expect(TokenAuthor).toBeInTheDocument();
});

test('Render Token Form in view mode and token never used', async () => {
  render(<Form mode="view" data={token} />);

  const MessageTokenNotUsedYet = await screen.findByText(
    'This token has not been used yet.'
  );
  expect(MessageTokenNotUsedYet).toBeInTheDocument();
});

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
  const ButtonSubmitName = await screen.findByTestId(
    'button-default-input-title'
  );
  expect(InputName).toBeInTheDocument();
  expect(ButtonSubmitName).toBeInTheDocument();

  userEvent.type(InputName, 'Token 001');
  await act(async () => userEvent.click(ButtonSubmitName));

  const ContentWorkspaces = await screen.findByTestId('contentIcon-workspaces');
  const ContentScopes = screen.queryByTestId('contentIcon-scopes');

  expect(ContentWorkspaces).toBeInTheDocument();
  expect(ContentScopes).not.toBeInTheDocument();
});

test('should show button next when creating a new token', () => {
  render(<Form mode="create" />);

  expect(screen.getByPlaceholderText('Type a name')).toBeInTheDocument();
  expect(screen.getByText('Next')).toBeInTheDocument();
});

test('should show edit workspaces button', async () => {
  render(<Form mode="create" />);

  const inputName = await screen.findByTestId('input-text-name');
  userEvent.type(inputName, 'Token 001');

  userEvent.click(screen.getByRole('button'));
  userEvent.click(await screen.findByText('Add workspaces'));

  await waitFor(() => expect(screen.getByTestId('modal-default')).toBeInTheDocument());

  expect(screen.getByText('Allow access for all workspaces')).toBeInTheDocument();

  expect(screen.getByText('Next')).toBeInTheDocument();
  userEvent.click(screen.getByTestId('button-default-continue'));

  await waitFor(() => 
    expect(screen.getByTestId('button-iconRounded-edit')).toHaveTextContent('Edit workspaces')
  );

  expect(screen.queryByText('Add workspaces')).not.toBeInTheDocument();
});
