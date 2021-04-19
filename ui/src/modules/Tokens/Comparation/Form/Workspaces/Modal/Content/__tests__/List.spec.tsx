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

import { render, screen } from 'unit-test/testUtils';
import List, { Props }  from '../List';
import { FetchMock } from 'jest-fetch-mock/types';
import { WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

const props: Props = {
  draft: null,
  onSelect: jest.fn()
}

const workspaces: WorkspacePaginationItem[] = [{
  id: '123',
  name: 'workspace',
  authorEmail: 'charlescd@zup.com.br',
  users: null,
  status: 'COMPLETE'
}]

test('Render List empty', async () => {
  render(<List {...props} />);

  const EmptyContent = await screen.findByText('Workspace not found');
  expect(EmptyContent).toBeInTheDocument();

  const ListWorkspace = screen.queryByText('workspace-list-content');
  expect(ListWorkspace).not.toBeInTheDocument();
});

test('Render List with content', async () => {
  const response = {
    content: workspaces,
    last: true,
  };

  (fetch as FetchMock).mockResponse(
    JSON.stringify(response)
  );

  render(<List {...props} />);

  const EmptyContent = screen.queryByText('Workspace not found');
  expect(EmptyContent).not.toBeInTheDocument();

  const ListWorkspace = await screen.findByTestId('workspace-list-content');
  expect(ListWorkspace).toBeInTheDocument();
});

