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

import { ReactElement } from 'react';
import { render, screen, act, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock';
import * as StateHooks from 'core/state/hooks';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import Credentials from '../';
import * as clipboardUtils from 'core/utils/clipboard';
import { Actions, Subjects } from "core/utils/abilities";
import * as MetricProviderHooks from '../Sections/MetricProvider/hooks';
import { Datasources } from '../Sections/MetricProvider/__tests__/fixtures';
import routes from 'core/constants/routes';

interface fakeCanProps {
  I?: Actions;
  a?: Subjects;
  passThrough?: boolean;
  isDisabled?: boolean;
  allowedRoutes?: boolean;
  children: ReactElement;
}

jest.mock('containers/Can', () => {
  return {
    __esModule: true,
    default: ({ children }: fakeCanProps) => {
      return <div>{children}</div>;
    }
  };
});

const originalWindow = {...window};

beforeEach(() => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: routes.settings
  };
});

afterEach(() => {
  window = originalWindow;
});

beforeEach(() => {
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));
})

test('render Credentials default component', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify([{ name: 'workspace', nickname: 'action', id: '1' }])
  );

  render(<Credentials />);

  const credentialsElement = await screen.findByTestId("credentials");
  expect(credentialsElement).toBeInTheDocument();
});

test('should render Credentials items', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify([{ name: 'workspace', nickname: 'action', id: '1' }])
  );

  render(<Credentials />);

  await waitFor(() => expect(screen.getByTestId('contentIcon-workspace')).toBeInTheDocument());
  expect(screen.getByText('Registry')).toBeInTheDocument();
  expect(screen.getByText('Deployment Configuration')).toBeInTheDocument();
  expect(screen.getByText('Circle Matcher')).toBeInTheDocument();
  expect(screen.getByText('Datasources')).toBeInTheDocument();
  expect(screen.getByText('Metric Action')).toBeInTheDocument();
  expect(screen.getByText('User group')).toBeInTheDocument();
});

test('should render Credentials items in the right order', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify([{ name: 'workspace', nickname: 'action', id: '1' }])
  );

  const itemsRightOrder = [
    'Registry',
    'Deployment Configuration',
    'Circle Matcher',
    'Datasources',
    'Metric Action',
    'Webhook',
    'User group'
  ];

  render(<Credentials />);

  const items = await screen.findAllByTestId(/contentIcon-.*/);
  const itemsFiltered = items.slice(1);
  itemsFiltered.forEach((item, index) => {
    expect(item.textContent).toBe(itemsRightOrder[index]);
  })
});

test('render User Group credentials', async () => {
  const useDatasourceSpy = jest.spyOn(MetricProviderHooks, 'useDatasource').mockImplementation(() => ({
    responseAll: [...Datasources],
    getAll: jest.fn
  }));

  render(<Credentials />);

  const content = screen.getByTestId('contentIcon-users');
  expect(content).toBeInTheDocument();

  const addUserGroupButton = screen.getByText('Add User group');
  userEvent.click(addUserGroupButton);

  const backButton = screen.getByTestId('icon-arrow-left');
  expect(backButton).toBeInTheDocument();

  await act(async () => userEvent.click(backButton));
  expect(backButton).not.toBeInTheDocument();

  useDatasourceSpy.mockRestore();
});

test('render Deployment Configuration Credentials', async () => {
  render(<Credentials />);

  const addCDConfigButton = await screen.findByText('Add Deployment Configuration');

  await act(async () => userEvent.click(addCDConfigButton));

  const backButton = screen.getByTestId('icon-arrow-left');
  expect(backButton).toBeInTheDocument();
});

test('render Circle Matcher Credentials', async () => {
  render(<Credentials />);

  const addCircleMatcherButton = await screen.findByText('Add Circle Matcher');
  await act(async () => userEvent.click(addCircleMatcherButton));

  const backButton = screen.getByTestId('icon-arrow-left');
  expect(backButton).toBeInTheDocument();
});

test('click to copy to clipboard', async () => {

  const copyToClipboardSpy = jest.spyOn(clipboardUtils, 'copyToClipboard');

  render(<Credentials />);

  const dropdownElement = await screen.findAllByTestId('icon-vertical-dots');
  userEvent.click(dropdownElement[0]);
  const copyIDElement = screen.getByText('Copy ID');

  expect(copyIDElement).toBeInTheDocument();

  act(() => userEvent.click(copyIDElement));

  expect(copyToClipboardSpy).toBeCalled();
});

test('should render Credentials items with the right type: Required or Optional', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify([{ name: 'workspace', nickname: 'action', id: '1' }])
  );

  const configurationItems = [
    { name: 'Registry', type: 'Required' },
    { name: 'Deployment Configuration', type: 'Required' },
    { name: 'Circle Matcher', type: 'Required' },
    { name: 'Datasources', type: 'Optional' },
    { name: 'Metric Action', type: 'Optional' },
    { name: 'Webhook', type: 'Optional' },
    { name: 'User group', type: 'Optional' },
  ];

  render(<Credentials />);

  const types = await screen.findAllByTestId(/configuration-type.*/);

  types.forEach((type, index) => {
    expect(type.textContent).toBe(configurationItems[index].type);
  })
});