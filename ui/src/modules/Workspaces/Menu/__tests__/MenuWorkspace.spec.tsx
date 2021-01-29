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
import { fireEvent, render, screen, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Menu from '../index';
import { workspaces } from './fixtures';

const props = {
  items: workspaces.content,
  onSearch: jest.fn()
};

test('renders Workspace menu', async () => {
  render(
    <Menu
      items={props.items}
      onSearch={props.onSearch}
      selectedWorkspace={jest.fn()}
    />
  );
  const createButton = screen.getByTestId('labeledIcon-plus-circle');
  const searchInput = screen.getByTestId('input-text-search');
  const workspacesArray = screen.getAllByText(/Workspace/);

  expect(createButton).toBeInTheDocument();
  expect(searchInput).toBeInTheDocument();
  expect(workspacesArray.length).toBe(5);
});

test('renders Workspace menu without any results', async () => {
  const search = jest.fn();
  render(
    <Menu
      items={[]}
      onSearch={search}
      selectedWorkspace={jest.fn()}
    />
  );

  const inputSearch = screen.getByTestId('input-text-search');

  userEvent.type(inputSearch, 'unknown');

  await waitFor(() => expect(screen.getByText('No workspace was found')).toBeInTheDocument());

});

test('renders Workspace menu on loading', () => {
  render(
    <Menu
      items={props.items}
      onSearch={props.onSearch}
      selectedWorkspace={jest.fn()}
      isLoading
    />
  );
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('should click Workspace item', () => {
  const selectedWorkspace = jest.fn();
  render(
    <Menu
      items={props.items}
      onSearch={props.onSearch}
      selectedWorkspace={selectedWorkspace}
    />
  );

  const items = screen.getAllByTestId('labeledIcon-workspace');
  fireEvent.click(items[0]);

  expect(selectedWorkspace).toHaveBeenCalled();
});