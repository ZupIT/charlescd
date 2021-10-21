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
import selectEvent from 'react-select-event';
import Modal, { Props }  from '..';
import { FetchMock } from 'jest-fetch-mock/types';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

const props: Props = {
  workspaces: [],
  onClose: jest.fn(),
  onContinue: jest.fn(),
}

const workspaces: WorkspacePaginationItem[] = [{
  id: '123',
  name: 'workspace',
  authorEmail: 'charlescd@zup.com.br',
  users: null,
  status: 'COMPLETE'
}]

test('Render Modal for the first time', async () => {
  render(<Modal {...props} />);

  const Title = await screen.findByText('Add workspaces');
  expect(Title).toBeInTheDocument();
});

test('Render Modal and select all workspaces option', async () => {
  render(<Modal {...props} />);

  const Select = await screen.findByText('Define the workspaces that will be associated');
  expect(Select).toBeInTheDocument();
  await act(async () => selectEvent.select(Select, 'Allow access for all workspaces'));

  const InputWorkspaceSearch = screen.queryByTestId('input-text-workspace-search');
  expect(InputWorkspaceSearch).not.toBeInTheDocument();

  const ListWorkspace = screen.queryByTestId('workspace-list-content');
  expect(ListWorkspace).not.toBeInTheDocument();

  const buttonContinue = await screen.findByTestId('button-default-continue');
  expect(buttonContinue).toBeInTheDocument();
});

test('Render Modal and select manual select workspaces option', async () => {
  render(<Modal {...props} />);

  const Select = await screen.findByText('Define the workspaces that will be associated');
  expect(Select).toBeInTheDocument();
  await act(async () => selectEvent.select(Select, 'Only specific workspaces'));

  const InputWorkspaceSearch = await screen.findByTestId('input-text-workspace-search');
  expect(InputWorkspaceSearch).toBeInTheDocument();
  await act(async () => selectEvent.select(Select, 'Only specific workspaces'));

  const ListWorkspace = await screen.findByTestId('workspace-list-content');
  expect(ListWorkspace).toBeInTheDocument();

  const ButtonContinue = await screen.findByTestId('button-default-continue');
  expect(ButtonContinue).toBeInTheDocument();
});

test('Render Modal and select manual select workspaces option with empty content', async () => {
  render(<Modal {...props} />);

  const Select = await screen.findByText('Define the workspaces that will be associated');
  expect(Select).toBeInTheDocument();
  await act(async () => selectEvent.select(Select, 'Only specific workspaces'));

  const ListWorkspace = await screen.findByTestId('workspace-list-content');
  expect(ListWorkspace).toBeInTheDocument();

  const EmptyContent = await screen.findByText('Workspace not found');
  expect(EmptyContent).toBeInTheDocument();
});

test('Render Modal and select manual select workspaces option with content', async () => {
  const response = {
    content: workspaces,
    last: true,
  };

  (fetch as FetchMock).mockResponse(
    JSON.stringify(response)
  );

  render(<Modal {...props} />);

  const Select = await screen.findByText('Define the workspaces that will be associated');
  expect(Select).toBeInTheDocument();
  await act(async () => selectEvent.select(Select, 'Only specific workspaces'));

  const ListWorkspace = await screen.findByTestId('workspace-list-content');
  expect(ListWorkspace).toBeInTheDocument();

  const EmptyContent = screen.queryByText('Workspace not found');
  expect(EmptyContent).not.toBeInTheDocument();

  const FirstContent = await screen.findByTestId(`item-${workspaces[0].id}`);
  expect(FirstContent).toBeInTheDocument();
});
