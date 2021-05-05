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

import { act, render, screen, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import * as clipboardUtils from 'core/utils/clipboard';
import View from '..';
import { FetchMock } from 'jest-fetch-mock/types';

const components = [
  {
    id: '123',
    name: 'Component 1',
    latencyThreshold: '1',
    errorThreshold: '1',
  }, {
    id: '456',
    name: 'Component 2',
    latencyThreshold: '2',
    errorThreshold: '2',
  }
]

const props = {
  module: {
    id: '123',
    name: 'module',
    gitRepositoryAddress: 'https://github.com',
    helmRepository: 'https://github.com',
    components: [components[0]]
  },
  onChange: jest.fn(),
  onSelectComponent: jest.fn()
}

test('render Modules View triggering card options dropdown', async () => {
  render(<View {...props}/>);

  const Content = await screen.findByTestId('contentIcon-modules');
  expect(Content).toBeInTheDocument();

  const DropdownTrigger = await screen.findByTestId('icon-vertical-dots');
  expect(DropdownTrigger).toBeInTheDocument();
  userEvent.click(DropdownTrigger);

  const DropdownItemDelete = screen.queryByText('Delete');
  const DropdownItemCopyID = screen.getByText('Copy ID');
  expect(DropdownItemDelete).not.toBeInTheDocument();
  expect(DropdownItemCopyID).toBeInTheDocument();
});

test('render Modules View with multiple components triggering card options dropdown', async () => {
  render(<View {...props} module={{ ...props.module, components: components }}/>);

  const Content = await screen.findByTestId('contentIcon-modules');
  expect(Content).toBeInTheDocument();

  const DropdownTrigger = await screen.findAllByTestId('icon-vertical-dots');
  expect(DropdownTrigger[0]).toBeInTheDocument();
  userEvent.click(DropdownTrigger[0]);

  const DropdownItemDelete = screen.getByText('Delete');
  const DropdownItemCopyID = screen.getByText('Copy ID');

  expect(DropdownItemDelete).toBeInTheDocument();
  expect(DropdownItemCopyID).toBeInTheDocument();
});

test('render View and try Copy ID', async () => {
  const copyToClipboardSpy = jest.spyOn(clipboardUtils, 'copyToClipboard');
  render(<View {...props} module={{ ...props.module, components: components }}/>);

  const Content = await screen.findByTestId('contentIcon-modules');
  expect(Content).toBeInTheDocument();

  const DropdownTrigger = await screen.findAllByTestId('icon-vertical-dots');
  expect(DropdownTrigger[0]).toBeInTheDocument();
  userEvent.click(DropdownTrigger[0]);

  const DropdownItemCopyID = screen.getByText('Copy ID');
  expect(DropdownItemCopyID).toBeInTheDocument();

  act(() => userEvent.click(DropdownItemCopyID));
  expect(copyToClipboardSpy).toBeCalled();
});

test('render View and try delete', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}))

  render(<View {...props} module={{ ...props.module, components: components }}/>);

  const Content = await screen.findByTestId('contentIcon-modules');
  expect(Content).toBeInTheDocument();

  const DropdownTrigger = await screen.findAllByTestId('icon-vertical-dots');
  expect(DropdownTrigger[0]).toBeInTheDocument();
  userEvent.click(DropdownTrigger[0]);

  const DropdownItemDelete = screen.getByText('Delete');
  expect(DropdownItemDelete).toBeInTheDocument();

  act(() => userEvent.click(DropdownItemDelete));
  await waitFor(() => expect(props.onChange).toBeCalled());
});
